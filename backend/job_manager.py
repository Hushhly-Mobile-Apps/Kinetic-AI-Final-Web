from celery import Celery
from celery.result import AsyncResult
from typing import Dict, List, Optional, Any
import json
import logging
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
import redis
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import JobQueue, JobStatus, JobPriority, User
from schemas import JobCreate, JobUpdate, JobResponse
from pose_estimation import pose_estimator
from media_processing import media_processor

logger = logging.getLogger(__name__)

# Initialize Celery
celery_app = Celery(
    "pose_estimation_worker",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["backend.tasks"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer=settings.CELERY_TASK_SERIALIZER,
    result_serializer=settings.CELERY_RESULT_SERIALIZER,
    accept_content=settings.CELERY_ACCEPT_CONTENT,
    timezone=settings.CELERY_TIMEZONE,
    enable_utc=True,
    task_track_started=True,
    task_time_limit=settings.JOB_TIMEOUT_SECONDS,
    task_soft_time_limit=settings.JOB_TIMEOUT_SECONDS - 60,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=100,
    task_routes={
        'backend.tasks.process_image_pose': {'queue': 'image_processing'},
        'backend.tasks.process_video_pose': {'queue': 'video_processing'},
        'backend.tasks.process_realtime_pose': {'queue': 'realtime_processing'},
        'backend.tasks.cleanup_old_data': {'queue': 'maintenance'},
        'backend.tasks.send_webhook_notification': {'queue': 'notifications'},
    },
    task_default_queue='default',
    task_create_missing_queues=True,
)

@dataclass
class JobResult:
    """Job execution result"""
    job_id: str
    status: JobStatus
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    progress: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    processing_time: Optional[float] = None

class JobManager:
    """Manage background jobs and task queues"""
    
    def __init__(self):
        self.redis_client = redis.Redis.from_url(settings.redis_url)
        self.max_retries = settings.JOB_RETRY_ATTEMPTS
        self.is_started = False
    
    async def start(self):
        """Initialize and start the job manager"""
        if self.is_started:
            return
        
        try:
            # Test Redis connection
            self.redis_client.ping()
            logger.info("Redis connection established")
            
            # Initialize Celery worker monitoring
            self.is_started = True
            logger.info("Job manager started successfully")
            
        except Exception as e:
            logger.warning(f"Job manager startup warning: {e}")
            # Continue without Redis/Celery for basic functionality
            self.is_started = True
    
    def create_job(self, db: Session, job_data: JobCreate, user_id: int) -> JobQueue:
        """Create a new job in the database"""
        job = JobQueue(
            user_id=user_id,
            job_type=job_data.job_type,
            priority=job_data.priority or JobPriority.NORMAL,
            parameters=job_data.parameters,
            status=JobStatus.PENDING
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        logger.info(f"Created job {job.id} for user {user_id}")
        return job
    
    def submit_image_pose_job(self, db: Session, media_id: int, user_id: int, 
                             priority: JobPriority = JobPriority.NORMAL) -> JobQueue:
        """Submit image pose estimation job"""
        job_data = JobCreate(
            job_type="image_pose_estimation",
            priority=priority,
            parameters={"media_id": media_id}
        )
        
        job = self.create_job(db, job_data, user_id)
        
        # Submit to Celery
        task = celery_app.send_task(
            'backend.tasks.process_image_pose',
            args=[job.id, media_id],
            queue='image_processing',
            priority=self._get_celery_priority(priority)
        )
        
        # Update job with Celery task ID
        job.celery_task_id = task.id
        job.status = JobStatus.QUEUED
        db.commit()
        
        return job
    
    def submit_video_pose_job(self, db: Session, media_id: int, user_id: int,
                             frame_skip: int = 1, priority: JobPriority = JobPriority.NORMAL) -> JobQueue:
        """Submit video pose estimation job"""
        job_data = JobCreate(
            job_type="video_pose_estimation",
            priority=priority,
            parameters={
                "media_id": media_id,
                "frame_skip": frame_skip
            }
        )
        
        job = self.create_job(db, job_data, user_id)
        
        # Submit to Celery
        task = celery_app.send_task(
            'backend.tasks.process_video_pose',
            args=[job.id, media_id, frame_skip],
            queue='video_processing',
            priority=self._get_celery_priority(priority)
        )
        
        job.celery_task_id = task.id
        job.status = JobStatus.QUEUED
        db.commit()
        
        return job
    
    def submit_pose_comparison_job(self, db: Session, media_id_1: int, media_id_2: int,
                                  user_id: int, priority: JobPriority = JobPriority.NORMAL) -> JobQueue:
        """Submit pose comparison job"""
        job_data = JobCreate(
            job_type="pose_comparison",
            priority=priority,
            parameters={
                "media_id_1": media_id_1,
                "media_id_2": media_id_2
            }
        )
        
        job = self.create_job(db, job_data, user_id)
        
        task = celery_app.send_task(
            'backend.tasks.process_pose_comparison',
            args=[job.id, media_id_1, media_id_2],
            queue='default',
            priority=self._get_celery_priority(priority)
        )
        
        job.celery_task_id = task.id
        job.status = JobStatus.QUEUED
        db.commit()
        
        return job
    
    def get_job_status(self, db: Session, job_id: int) -> Optional[JobResult]:
        """Get job status and result"""
        job = db.query(JobQueue).filter(JobQueue.id == job_id).first()
        if not job:
            return None
        
        # Get Celery task result if available
        celery_result = None
        if job.celery_task_id:
            try:
                celery_result = AsyncResult(job.celery_task_id, app=celery_app)
            except Exception as e:
                logger.error(f"Error getting Celery result for job {job_id}: {e}")
        
        # Calculate processing time
        processing_time = None
        if job.started_at and job.completed_at:
            processing_time = (job.completed_at - job.started_at).total_seconds()
        
        return JobResult(
            job_id=str(job.id),
            status=job.status,
            result=job.result,
            error=job.error_message,
            progress=job.progress,
            started_at=job.started_at,
            completed_at=job.completed_at,
            processing_time=processing_time
        )
    
    def cancel_job(self, db: Session, job_id: int, user_id: int) -> bool:
        """Cancel a job"""
        job = db.query(JobQueue).filter(
            JobQueue.id == job_id,
            JobQueue.user_id == user_id
        ).first()
        
        if not job:
            return False
        
        if job.status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
            return False
        
        # Cancel Celery task
        if job.celery_task_id:
            try:
                celery_app.control.revoke(job.celery_task_id, terminate=True)
            except Exception as e:
                logger.error(f"Error cancelling Celery task {job.celery_task_id}: {e}")
        
        # Update job status
        job.status = JobStatus.CANCELLED
        job.completed_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Cancelled job {job_id}")
        return True
    
    def retry_job(self, db: Session, job_id: int, user_id: int) -> bool:
        """Retry a failed job"""
        job = db.query(JobQueue).filter(
            JobQueue.id == job_id,
            JobQueue.user_id == user_id
        ).first()
        
        if not job or job.status != JobStatus.FAILED:
            return False
        
        if job.retry_count >= self.max_retries:
            return False
        
        # Reset job status
        job.status = JobStatus.PENDING
        job.retry_count += 1
        job.error_message = None
        job.started_at = None
        job.completed_at = None
        
        # Resubmit based on job type
        if job.job_type == "image_pose_estimation":
            task = celery_app.send_task(
                'backend.tasks.process_image_pose',
                args=[job.id, job.parameters["media_id"]],
                queue='image_processing',
                priority=self._get_celery_priority(job.priority)
            )
        elif job.job_type == "video_pose_estimation":
            task = celery_app.send_task(
                'backend.tasks.process_video_pose',
                args=[job.id, job.parameters["media_id"], job.parameters.get("frame_skip", 1)],
                queue='video_processing',
                priority=self._get_celery_priority(job.priority)
            )
        else:
            return False
        
        job.celery_task_id = task.id
        job.status = JobStatus.QUEUED
        db.commit()
        
        logger.info(f"Retried job {job_id} (attempt {job.retry_count})")
        return True
    
    def get_user_jobs(self, db: Session, user_id: int, status: Optional[JobStatus] = None,
                     limit: int = 50, offset: int = 0) -> List[JobQueue]:
        """Get jobs for a user"""
        query = db.query(JobQueue).filter(JobQueue.user_id == user_id)
        
        if status:
            query = query.filter(JobQueue.status == status)
        
        return query.order_by(JobQueue.created_at.desc()).offset(offset).limit(limit).all()
    
    def get_queue_stats(self, db: Session) -> Dict[str, Any]:
        """Get queue statistics"""
        stats = {
            "total_jobs": db.query(JobQueue).count(),
            "pending_jobs": db.query(JobQueue).filter(JobQueue.status == JobStatus.PENDING).count(),
            "running_jobs": db.query(JobQueue).filter(JobQueue.status == JobStatus.RUNNING).count(),
            "completed_jobs": db.query(JobQueue).filter(JobQueue.status == JobStatus.COMPLETED).count(),
            "failed_jobs": db.query(JobQueue).filter(JobQueue.status == JobStatus.FAILED).count(),
            "cancelled_jobs": db.query(JobQueue).filter(JobQueue.status == JobStatus.CANCELLED).count(),
        }
        
        # Get Celery queue stats
        try:
            inspect = celery_app.control.inspect()
            active_tasks = inspect.active()
            scheduled_tasks = inspect.scheduled()
            
            stats["celery_active_tasks"] = sum(len(tasks) for tasks in (active_tasks or {}).values())
            stats["celery_scheduled_tasks"] = sum(len(tasks) for tasks in (scheduled_tasks or {}).values())
        except Exception as e:
            logger.error(f"Error getting Celery stats: {e}")
            stats["celery_active_tasks"] = 0
            stats["celery_scheduled_tasks"] = 0
        
        return stats
    
    def cleanup_old_jobs(self, db: Session, days_old: int = 30):
        """Clean up old completed jobs"""
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        
        old_jobs = db.query(JobQueue).filter(
            JobQueue.completed_at < cutoff_date,
            JobQueue.status.in_([JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED])
        ).all()
        
        for job in old_jobs:
            db.delete(job)
        
        db.commit()
        logger.info(f"Cleaned up {len(old_jobs)} old jobs")
    
    def update_job_progress(self, db: Session, job_id: int, progress: float, 
                           status: Optional[JobStatus] = None):
        """Update job progress"""
        job = db.query(JobQueue).filter(JobQueue.id == job_id).first()
        if job:
            job.progress = progress
            if status:
                job.status = status
            if status == JobStatus.RUNNING and not job.started_at:
                job.started_at = datetime.utcnow()
            db.commit()
    
    def complete_job(self, db: Session, job_id: int, result: Dict[str, Any], 
                    error: Optional[str] = None):
        """Mark job as completed"""
        job = db.query(JobQueue).filter(JobQueue.id == job_id).first()
        if job:
            job.status = JobStatus.COMPLETED if not error else JobStatus.FAILED
            job.result = result
            job.error_message = error
            job.completed_at = datetime.utcnow()
            job.progress = 100.0 if not error else job.progress
            db.commit()
            
            # Send webhook notification if configured
            if job.user.webhook_url:
                celery_app.send_task(
                    'backend.tasks.send_webhook_notification',
                    args=[job.id],
                    queue='notifications'
                )
    
    def _get_celery_priority(self, priority: JobPriority) -> int:
        """Convert JobPriority to Celery priority"""
        priority_map = {
            JobPriority.LOW: 3,
            JobPriority.NORMAL: 6,
            JobPriority.HIGH: 9,
            JobPriority.URGENT: 10
        }
        return priority_map.get(priority, 6)
    
    def get_worker_stats(self) -> Dict[str, Any]:
        """Get Celery worker statistics"""
        try:
            inspect = celery_app.control.inspect()
            stats = inspect.stats()
            active = inspect.active()
            registered = inspect.registered()
            
            return {
                "workers": list(stats.keys()) if stats else [],
                "worker_stats": stats or {},
                "active_tasks": active or {},
                "registered_tasks": registered or {}
            }
        except Exception as e:
            logger.error(f"Error getting worker stats: {e}")
            return {}
    
    def purge_queue(self, queue_name: str) -> int:
        """Purge all tasks from a queue"""
        try:
            purged = celery_app.control.purge()
            return purged
        except Exception as e:
            logger.error(f"Error purging queue {queue_name}: {e}")
            return 0
    
    def get_job_logs(self, job_id: int) -> List[str]:
        """Get logs for a specific job"""
        try:
            # Get logs from Redis (if stored there)
            log_key = f"job_logs:{job_id}"
            logs = self.redis_client.lrange(log_key, 0, -1)
            return [log.decode('utf-8') for log in logs]
        except Exception as e:
            logger.error(f"Error getting logs for job {job_id}: {e}")
            return []
    
    def add_job_log(self, job_id: int, message: str):
        """Add log entry for a job"""
        try:
            log_key = f"job_logs:{job_id}"
            timestamp = datetime.utcnow().isoformat()
            log_entry = f"[{timestamp}] {message}"
            
            self.redis_client.lpush(log_key, log_entry)
            self.redis_client.ltrim(log_key, 0, 999)  # Keep last 1000 logs
            self.redis_client.expire(log_key, 86400 * 7)  # Expire after 7 days
        except Exception as e:
            logger.error(f"Error adding log for job {job_id}: {e}")

# Global job manager instance
job_manager = JobManager()