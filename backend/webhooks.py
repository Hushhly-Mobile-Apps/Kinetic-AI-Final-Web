import asyncio
import json
import hmac
import hashlib
from typing import Dict, Any, List, Optional, Callable
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass, asdict
from enum import Enum
import aiohttp
import time
from urllib.parse import urlparse

from config import settings
from cache import cache
from models import WebhookEndpoint
from database import get_db

logger = logging.getLogger(__name__)

class WebhookEventType(str, Enum):
    """Webhook event types"""
    JOB_COMPLETED = "job.completed"
    JOB_FAILED = "job.failed"
    JOB_STARTED = "job.started"
    POSE_ESTIMATION_COMPLETED = "pose_estimation.completed"
    POSE_ESTIMATION_FAILED = "pose_estimation.failed"
    MEDIA_UPLOADED = "media.uploaded"
    MEDIA_DELETED = "media.deleted"
    USER_REGISTERED = "user.registered"
    USER_UPDATED = "user.updated"
    ALERT_TRIGGERED = "alert.triggered"
    SYSTEM_HEALTH_CHANGED = "system.health_changed"

@dataclass
class WebhookEvent:
    """Webhook event data structure"""
    id: str
    event_type: WebhookEventType
    timestamp: datetime
    data: Dict[str, Any]
    user_id: Optional[int] = None
    organization_id: Optional[int] = None
    retry_count: int = 0
    max_retries: int = 3
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'event_type': self.event_type.value,
            'timestamp': self.timestamp.isoformat(),
            'data': self.data,
            'user_id': self.user_id,
            'organization_id': self.organization_id
        }

class WebhookSecurity:
    """Handle webhook security (signatures, validation)"""
    
    @staticmethod
    def generate_signature(payload: str, secret: str) -> str:
        """Generate HMAC signature for webhook payload"""
        signature = hmac.new(
            secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return f"sha256={signature}"
    
    @staticmethod
    def verify_signature(payload: str, signature: str, secret: str) -> bool:
        """Verify webhook signature"""
        expected_signature = WebhookSecurity.generate_signature(payload, secret)
        return hmac.compare_digest(signature, expected_signature)
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Validate webhook URL"""
        try:
            parsed = urlparse(url)
            return all([
                parsed.scheme in ['http', 'https'],
                parsed.netloc,
                not parsed.netloc.startswith('localhost') or settings.ENVIRONMENT == 'development'
            ])
        except Exception:
            return False

class WebhookDelivery:
    """Handle webhook delivery with retries and rate limiting"""
    
    def __init__(self):
        self.session = None
        self.delivery_queue = asyncio.Queue()
        self.rate_limits = {}  # URL -> last_request_time
        self.min_interval = 1.0  # Minimum seconds between requests to same URL
    
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create HTTP session"""
        if self.session is None or self.session.closed:
            timeout = aiohttp.ClientTimeout(total=30, connect=10)
            self.session = aiohttp.ClientSession(
                timeout=timeout,
                headers={'User-Agent': f'KineticAI-Webhooks/{settings.VERSION}'}
            )
        return self.session
    
    async def deliver_webhook(self, endpoint: WebhookEndpoint, event: WebhookEvent) -> bool:
        """Deliver webhook to endpoint"""
        try:
            # Rate limiting
            await self._apply_rate_limit(endpoint.url)
            
            # Prepare payload
            payload = json.dumps(event.to_dict(), separators=(',', ':'))
            
            # Generate signature
            signature = WebhookSecurity.generate_signature(payload, endpoint.secret)
            
            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signature,
                'X-Webhook-Event': event.event_type.value,
                'X-Webhook-ID': event.id,
                'X-Webhook-Timestamp': str(int(event.timestamp.timestamp()))
            }
            
            # Add custom headers
            if endpoint.headers:
                headers.update(endpoint.headers)
            
            session = await self._get_session()
            
            # Make request
            async with session.post(
                endpoint.url,
                data=payload,
                headers=headers
            ) as response:
                
                # Log delivery attempt
                logger.info(
                    f"Webhook delivered to {endpoint.url}: "
                    f"status={response.status}, event={event.event_type}"
                )
                
                # Update endpoint stats
                await self._update_endpoint_stats(endpoint, response.status, True)
                
                # Consider 2xx status codes as successful
                return 200 <= response.status < 300
        
        except asyncio.TimeoutError:
            logger.warning(f"Webhook timeout for {endpoint.url}")
            await self._update_endpoint_stats(endpoint, 0, False, "timeout")
            return False
        
        except Exception as e:
            logger.error(f"Webhook delivery failed for {endpoint.url}: {e}")
            await self._update_endpoint_stats(endpoint, 0, False, str(e))
            return False
    
    async def _apply_rate_limit(self, url: str):
        """Apply rate limiting for URL"""
        now = time.time()
        last_request = self.rate_limits.get(url, 0)
        
        time_since_last = now - last_request
        if time_since_last < self.min_interval:
            sleep_time = self.min_interval - time_since_last
            await asyncio.sleep(sleep_time)
        
        self.rate_limits[url] = time.time()
    
    async def _update_endpoint_stats(self, endpoint: WebhookEndpoint, 
                                   status_code: int, success: bool, 
                                   error: str = None):
        """Update endpoint delivery statistics"""
        try:
            db = next(get_db())
            
            # Update endpoint stats
            endpoint.last_delivery_at = datetime.utcnow()
            endpoint.total_deliveries += 1
            
            if success:
                endpoint.successful_deliveries += 1
                endpoint.consecutive_failures = 0
            else:
                endpoint.failed_deliveries += 1
                endpoint.consecutive_failures += 1
                endpoint.last_error = error
            
            # Disable endpoint if too many consecutive failures
            if endpoint.consecutive_failures >= 10:
                endpoint.is_active = False
                logger.warning(
                    f"Disabled webhook endpoint {endpoint.url} "
                    f"due to {endpoint.consecutive_failures} consecutive failures"
                )
            
            db.commit()
        
        except Exception as e:
            logger.error(f"Error updating endpoint stats: {e}")
    
    async def close(self):
        """Close HTTP session"""
        if self.session and not self.session.closed:
            await self.session.close()

class WebhookManager:
    """Main webhook manager"""
    
    def __init__(self):
        self.delivery = WebhookDelivery()
        self.event_handlers = {}
        self.background_task = None
        self.setup_default_handlers()
    
    def setup_default_handlers(self):
        """Setup default event handlers"""
        self.register_handler(WebhookEventType.JOB_COMPLETED, self._handle_job_completed)
        self.register_handler(WebhookEventType.JOB_FAILED, self._handle_job_failed)
        self.register_handler(WebhookEventType.ALERT_TRIGGERED, self._handle_alert)
    
    def register_handler(self, event_type: WebhookEventType, handler: Callable):
        """Register event handler"""
        if event_type not in self.event_handlers:
            self.event_handlers[event_type] = []
        self.event_handlers[event_type].append(handler)
    
    async def emit_event(self, event_type: WebhookEventType, data: Dict[str, Any],
                        user_id: Optional[int] = None, 
                        organization_id: Optional[int] = None):
        """Emit webhook event"""
        try:
            # Create event
            event = WebhookEvent(
                id=self._generate_event_id(),
                event_type=event_type,
                timestamp=datetime.utcnow(),
                data=data,
                user_id=user_id,
                organization_id=organization_id
            )
            
            # Run event handlers
            handlers = self.event_handlers.get(event_type, [])
            for handler in handlers:
                try:
                    await handler(event)
                except Exception as e:
                    logger.error(f"Error in event handler: {e}")
            
            # Queue for delivery
            await self._queue_event_delivery(event)
            
            logger.info(f"Webhook event emitted: {event_type.value}")
        
        except Exception as e:
            logger.error(f"Error emitting webhook event: {e}")
    
    async def _queue_event_delivery(self, event: WebhookEvent):
        """Queue event for delivery to registered endpoints"""
        try:
            db = next(get_db())
            
            # Get active webhook endpoints
            query = db.query(WebhookEndpoint).filter(
                WebhookEndpoint.is_active == True
            )
            
            # Filter by user/organization
            if event.user_id:
                query = query.filter(WebhookEndpoint.user_id == event.user_id)
            elif event.organization_id:
                query = query.filter(WebhookEndpoint.organization_id == event.organization_id)
            
            endpoints = query.all()
            
            # Queue delivery for each matching endpoint
            for endpoint in endpoints:
                # Check if endpoint is subscribed to this event type
                if event.event_type.value in endpoint.event_types:
                    await self.delivery.delivery_queue.put((endpoint, event))
        
        except Exception as e:
            logger.error(f"Error queuing event delivery: {e}")
    
    async def _handle_job_completed(self, event: WebhookEvent):
        """Handle job completed event"""
        # Add additional processing if needed
        logger.info(f"Job completed: {event.data.get('job_id')}")
    
    async def _handle_job_failed(self, event: WebhookEvent):
        """Handle job failed event"""
        # Add additional processing if needed
        logger.warning(f"Job failed: {event.data.get('job_id')} - {event.data.get('error')}")
    
    async def _handle_alert(self, event: WebhookEvent):
        """Handle alert triggered event"""
        # Add additional processing if needed
        logger.warning(f"Alert triggered: {event.data.get('alert_name')}")
    
    def _generate_event_id(self) -> str:
        """Generate unique event ID"""
        import uuid
        return str(uuid.uuid4())
    
    async def start_delivery_worker(self):
        """Start background delivery worker"""
        if self.background_task is not None:
            return
        
        self.background_task = asyncio.create_task(self._delivery_worker())
        logger.info("Webhook delivery worker started")
    
    async def stop_delivery_worker(self):
        """Stop background delivery worker"""
        if self.background_task:
            self.background_task.cancel()
            try:
                await self.background_task
            except asyncio.CancelledError:
                pass
            self.background_task = None
        
        await self.delivery.close()
        logger.info("Webhook delivery worker stopped")
    
    async def _delivery_worker(self):
        """Background worker for webhook delivery"""
        while True:
            try:
                # Get next delivery from queue
                endpoint, event = await self.delivery.delivery_queue.get()
                
                # Attempt delivery
                success = await self.delivery.deliver_webhook(endpoint, event)
                
                # Handle retry logic
                if not success and event.retry_count < event.max_retries:
                    event.retry_count += 1
                    
                    # Exponential backoff
                    delay = min(300, 2 ** event.retry_count)  # Max 5 minutes
                    
                    logger.info(
                        f"Retrying webhook delivery in {delay}s "
                        f"(attempt {event.retry_count}/{event.max_retries})"
                    )
                    
                    # Schedule retry
                    asyncio.create_task(self._schedule_retry(endpoint, event, delay))
                
                elif not success:
                    logger.error(
                        f"Webhook delivery failed permanently after "
                        f"{event.max_retries} retries: {endpoint.url}"
                    )
                
                # Mark task as done
                self.delivery.delivery_queue.task_done()
            
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in delivery worker: {e}")
                await asyncio.sleep(1)
    
    async def _schedule_retry(self, endpoint: WebhookEndpoint, 
                            event: WebhookEvent, delay: int):
        """Schedule webhook retry after delay"""
        await asyncio.sleep(delay)
        await self.delivery.delivery_queue.put((endpoint, event))
    
    async def test_endpoint(self, endpoint_url: str, secret: str) -> Dict[str, Any]:
        """Test webhook endpoint"""
        try:
            # Create test event
            test_event = WebhookEvent(
                id="test-" + self._generate_event_id(),
                event_type=WebhookEventType.SYSTEM_HEALTH_CHANGED,
                timestamp=datetime.utcnow(),
                data={
                    "test": True,
                    "message": "This is a test webhook delivery"
                }
            )
            
            # Create temporary endpoint
            temp_endpoint = WebhookEndpoint(
                url=endpoint_url,
                secret=secret,
                event_types=[WebhookEventType.SYSTEM_HEALTH_CHANGED.value],
                is_active=True
            )
            
            # Attempt delivery
            success = await self.delivery.deliver_webhook(temp_endpoint, test_event)
            
            return {
                "success": success,
                "message": "Test webhook delivered successfully" if success else "Test webhook delivery failed",
                "event_id": test_event.id
            }
        
        except Exception as e:
            return {
                "success": False,
                "message": f"Test webhook failed: {str(e)}",
                "error": str(e)
            }
    
    def get_delivery_stats(self) -> Dict[str, Any]:
        """Get webhook delivery statistics"""
        try:
            db = next(get_db())
            
            # Get endpoint stats
            endpoints = db.query(WebhookEndpoint).all()
            
            total_endpoints = len(endpoints)
            active_endpoints = sum(1 for e in endpoints if e.is_active)
            total_deliveries = sum(e.total_deliveries for e in endpoints)
            successful_deliveries = sum(e.successful_deliveries for e in endpoints)
            failed_deliveries = sum(e.failed_deliveries for e in endpoints)
            
            return {
                "total_endpoints": total_endpoints,
                "active_endpoints": active_endpoints,
                "inactive_endpoints": total_endpoints - active_endpoints,
                "total_deliveries": total_deliveries,
                "successful_deliveries": successful_deliveries,
                "failed_deliveries": failed_deliveries,
                "success_rate": successful_deliveries / max(total_deliveries, 1) * 100,
                "queue_size": self.delivery.delivery_queue.qsize(),
                "endpoints": [
                    {
                        "id": e.id,
                        "url": e.url,
                        "is_active": e.is_active,
                        "total_deliveries": e.total_deliveries,
                        "successful_deliveries": e.successful_deliveries,
                        "failed_deliveries": e.failed_deliveries,
                        "consecutive_failures": e.consecutive_failures,
                        "last_delivery_at": e.last_delivery_at.isoformat() if e.last_delivery_at else None,
                        "last_error": e.last_error
                    }
                    for e in endpoints
                ]
            }
        
        except Exception as e:
            logger.error(f"Error getting delivery stats: {e}")
            return {"error": str(e)}

# Global webhook manager instance
webhook_manager = WebhookManager()

# Utility functions
async def emit_job_completed(job_id: str, user_id: int, result: Dict[str, Any]):
    """Emit job completed event"""
    await webhook_manager.emit_event(
        WebhookEventType.JOB_COMPLETED,
        {
            "job_id": job_id,
            "result": result,
            "completed_at": datetime.utcnow().isoformat()
        },
        user_id=user_id
    )

async def emit_job_failed(job_id: str, user_id: int, error: str):
    """Emit job failed event"""
    await webhook_manager.emit_event(
        WebhookEventType.JOB_FAILED,
        {
            "job_id": job_id,
            "error": error,
            "failed_at": datetime.utcnow().isoformat()
        },
        user_id=user_id
    )

async def emit_pose_estimation_completed(media_id: int, user_id: int, 
                                       keypoints: Dict[str, Any], 
                                       processing_time: float):
    """Emit pose estimation completed event"""
    await webhook_manager.emit_event(
        WebhookEventType.POSE_ESTIMATION_COMPLETED,
        {
            "media_id": media_id,
            "keypoints_count": len(keypoints.get("keypoints", [])),
            "processing_time": processing_time,
            "completed_at": datetime.utcnow().isoformat()
        },
        user_id=user_id
    )

async def emit_media_uploaded(media_id: int, user_id: int, filename: str, file_size: int):
    """Emit media uploaded event"""
    await webhook_manager.emit_event(
        WebhookEventType.MEDIA_UPLOADED,
        {
            "media_id": media_id,
            "filename": filename,
            "file_size": file_size,
            "uploaded_at": datetime.utcnow().isoformat()
        },
        user_id=user_id
    )

async def emit_alert_triggered(alert_name: str, metric: str, current_value: float, 
                             threshold: float, severity: str):
    """Emit alert triggered event"""
    await webhook_manager.emit_event(
        WebhookEventType.ALERT_TRIGGERED,
        {
            "alert_name": alert_name,
            "metric": metric,
            "current_value": current_value,
            "threshold": threshold,
            "severity": severity,
            "triggered_at": datetime.utcnow().isoformat()
        }
    )

# Webhook endpoint management functions
def create_webhook_endpoint(user_id: int, url: str, event_types: List[str], 
                          secret: Optional[str] = None, 
                          headers: Optional[Dict[str, str]] = None,
                          organization_id: Optional[int] = None) -> WebhookEndpoint:
    """Create new webhook endpoint"""
    try:
        # Validate URL
        if not WebhookSecurity.validate_url(url):
            raise ValueError("Invalid webhook URL")
        
        # Generate secret if not provided
        if not secret:
            import secrets
            secret = secrets.token_urlsafe(32)
        
        db = next(get_db())
        
        endpoint = WebhookEndpoint(
            user_id=user_id,
            organization_id=organization_id,
            url=url,
            secret=secret,
            event_types=event_types,
            headers=headers or {},
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(endpoint)
        db.commit()
        db.refresh(endpoint)
        
        logger.info(f"Created webhook endpoint: {url}")
        return endpoint
    
    except Exception as e:
        logger.error(f"Error creating webhook endpoint: {e}")
        raise

def update_webhook_endpoint(endpoint_id: int, **kwargs) -> Optional[WebhookEndpoint]:
    """Update webhook endpoint"""
    try:
        db = next(get_db())
        
        endpoint = db.query(WebhookEndpoint).filter(
            WebhookEndpoint.id == endpoint_id
        ).first()
        
        if not endpoint:
            return None
        
        # Update fields
        for key, value in kwargs.items():
            if hasattr(endpoint, key):
                setattr(endpoint, key, value)
        
        endpoint.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(endpoint)
        
        logger.info(f"Updated webhook endpoint: {endpoint.url}")
        return endpoint
    
    except Exception as e:
        logger.error(f"Error updating webhook endpoint: {e}")
        raise

def delete_webhook_endpoint(endpoint_id: int) -> bool:
    """Delete webhook endpoint"""
    try:
        db = next(get_db())
        
        endpoint = db.query(WebhookEndpoint).filter(
            WebhookEndpoint.id == endpoint_id
        ).first()
        
        if not endpoint:
            return False
        
        db.delete(endpoint)
        db.commit()
        
        logger.info(f"Deleted webhook endpoint: {endpoint.url}")
        return True
    
    except Exception as e:
        logger.error(f"Error deleting webhook endpoint: {e}")
        return False

def get_user_webhook_endpoints(user_id: int) -> List[WebhookEndpoint]:
    """Get webhook endpoints for user"""
    try:
        db = next(get_db())
        
        return db.query(WebhookEndpoint).filter(
            WebhookEndpoint.user_id == user_id
        ).all()
    
    except Exception as e:
        logger.error(f"Error getting user webhook endpoints: {e}")
        return []