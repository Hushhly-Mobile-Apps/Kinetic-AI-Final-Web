from typing import Optional, Dict, Any, List
import asyncio
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db_session
from models import User, Notification
from email_service import email_service
from tasks import send_email_notification, send_appointment_reminder, send_exercise_completion_notification
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    """Unified notification service for real-time and email notifications"""
    
    def __init__(self):
        self.connection_manager = None  # Will be set from main.py
    
    def set_connection_manager(self, manager):
        """Set the WebSocket connection manager"""
        self.connection_manager = manager
    
    async def create_notification(
        self,
        user_id: int,
        title: str,
        message: str,
        notification_type: str = "info",
        send_email: bool = False,
        send_realtime: bool = True,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Create and send notification via multiple channels"""
        
        try:
            db = get_db_session()
            
            # Get user
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"User {user_id} not found")
                return False
            
            # Create notification in database
            notification = Notification(
                user_id=user_id,
                title=title,
                message=message,
                type=notification_type,
                notification_metadata=metadata or {},
                created_at=datetime.utcnow(),
                is_read=False
            )
            
            db.add(notification)
            db.commit()
            
            # Send real-time notification via WebSocket
            if send_realtime and self.connection_manager:
                notification_data = {
                    "id": notification.id,
                    "title": title,
                    "message": message,
                    "type": notification_type,
                    "metadata": metadata or {},
                    "created_at": notification.created_at.isoformat(),
                    "is_read": False
                }
                
                await self.connection_manager.send_notification(user_id, notification_data)
            
            # Send email notification
            if send_email:
                send_email_notification.delay(
                    user_id=user_id,
                    subject=title,
                    message=message
                )
            
            db.close()
            logger.info(f"Notification created and sent to user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating notification: {e}")
            return False
    
    async def broadcast_notification(
        self,
        title: str,
        message: str,
        notification_type: str = "info",
        send_email: bool = False,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Broadcast notification to all users"""
        
        try:
            db = get_db_session()
            
            # Get all users
            users = db.query(User).all()
            
            # Create notifications for all users
            for user in users:
                notification = Notification(
                    user_id=user.id,
                    title=title,
                    message=message,
                    type=notification_type,
                    notification_metadata=metadata or {},
                    created_at=datetime.utcnow(),
                    is_read=False
                )
                
                db.add(notification)
            
            db.commit()
            
            # Send real-time broadcast
            if self.connection_manager:
                notification_data = {
                    "title": title,
                    "message": message,
                    "type": notification_type,
                    "metadata": metadata or {},
                    "created_at": datetime.utcnow().isoformat(),
                    "is_read": False
                }
                
                await self.connection_manager.broadcast_notification(notification_data)
            
            # Send email to all users if requested
            if send_email:
                for user in users:
                    send_email_notification.delay(
                        user_id=user.id,
                        subject=title,
                        message=message
                    )
            
            db.close()
            logger.info(f"Broadcast notification sent to {len(users)} users")
            return True
            
        except Exception as e:
            logger.error(f"Error broadcasting notification: {e}")
            return False
    
    async def send_appointment_notification(
        self,
        user_id: int,
        appointment_details: Dict[str, Any],
        send_email: bool = True
    ) -> bool:
        """Send appointment-related notification"""
        
        title = "Appointment Reminder"
        message = f"You have an upcoming appointment on {appointment_details.get('date', 'TBD')} at {appointment_details.get('time', 'TBD')}"
        
        # Send real-time notification
        await self.create_notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type="appointment",
            send_email=False,  # We'll handle email separately
            metadata=appointment_details
        )
        
        # Send specialized appointment email
        if send_email:
            try:
                db = get_db_session()
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    send_appointment_reminder.delay(user.email, appointment_details)
                db.close()
            except Exception as e:
                logger.error(f"Error sending appointment email: {e}")
        
        return True
    
    async def send_exercise_completion_notification(
        self,
        user_id: int,
        exercise_name: str,
        completion_data: Dict[str, Any],
        send_email: bool = True
    ) -> bool:
        """Send exercise completion notification"""
        
        title = "Exercise Completed!"
        message = f"Great job! You've completed {exercise_name}"
        
        # Send real-time notification
        await self.create_notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type="success",
            send_email=False,  # We'll handle email separately
            metadata={"exercise_name": exercise_name, **completion_data}
        )
        
        # Send specialized exercise completion email
        if send_email:
            try:
                db = get_db_session()
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    send_exercise_completion_notification.delay(
                        user.email, exercise_name, completion_data
                    )
                db.close()
            except Exception as e:
                logger.error(f"Error sending exercise completion email: {e}")
        
        return True
    
    async def mark_notification_read(self, notification_id: int, user_id: int) -> bool:
        """Mark notification as read"""
        
        try:
            db = get_db_session()
            
            notification = db.query(Notification).filter(
                Notification.id == notification_id,
                Notification.user_id == user_id
            ).first()
            
            if notification:
                notification.is_read = True
                notification.read_at = datetime.utcnow()
                db.commit()
                
                # Send real-time update
                if self.connection_manager:
                    update_data = {
                        "notification_id": notification_id,
                        "is_read": True,
                        "read_at": notification.read_at.isoformat()
                    }
                    
                    await self.connection_manager.send_notification(user_id, {
                        "type": "notification_update",
                        "data": update_data
                    })
                
                db.close()
                return True
            
            db.close()
            return False
            
        except Exception as e:
            logger.error(f"Error marking notification as read: {e}")
            return False
    
    def get_user_notifications(
        self,
        user_id: int,
        limit: int = 50,
        unread_only: bool = False
    ) -> List[Dict[str, Any]]:
        """Get user notifications"""
        
        try:
            db = get_db_session()
            
            query = db.query(Notification).filter(Notification.user_id == user_id)
            
            if unread_only:
                query = query.filter(Notification.is_read == False)
            
            notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()
            
            result = []
            for notification in notifications:
                result.append({
                    "id": notification.id,
                    "title": notification.title,
                    "message": notification.message,
                    "type": notification.type,
                    "metadata": notification.metadata,
                    "created_at": notification.created_at.isoformat(),
                    "is_read": notification.is_read,
                    "read_at": notification.read_at.isoformat() if notification.read_at else None
                })
            
            db.close()
            return result
            
        except Exception as e:
            logger.error(f"Error getting user notifications: {e}")
            return []

# Global notification service instance
notification_service = NotificationService()