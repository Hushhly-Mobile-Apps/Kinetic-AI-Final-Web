from celery import current_task
from celery.exceptions import Retry
import cv2
import numpy as np
from typing import Dict, Any, List
import logging
from datetime import datetime, timedelta
import requests
import json
from pathlib import Path
import asyncio
from sqlalchemy.orm import Session

from job_manager import celery_app
from database import SessionLocal, get_db
from models import JobQueue, JobStatus, Media, PoseKeypoints, User, PoseComparison
from pose_estimation import pose_estimator
from media_processing import media_processor
from config import settings
from schemas import PoseKeypointsCreate, PoseComparisonRequest

logger = logging.getLogger(__name__)

def get_db_session() -> Session:
    """Get database session for tasks"""
    return SessionLocal()

def update_job_status(job_id: int, status: JobStatus, progress: float = None, 
                     result: Dict[str, Any] = None, error: str = None):
    """Update job status in database"""
    db = get_db_session()
    try:
        job = db.query(JobQueue).filter(JobQueue.id == job_id).first()
        if job:
            job.status = status
            if progress is not None:
                job.progress = progress
            if result is not None:
                job.result = result
            if error is not None:
                job.error_message = error
            if status == JobStatus.RUNNING and not job.started_at:
                job.started_at = datetime.utcnow()
            elif status in [JobStatus.COMPLETED, JobStatus.FAILED]:
                job.completed_at = datetime.utcnow()
            db.commit()
    except Exception as e:
        logger.error(f"Error updating job {job_id} status: {e}")
    finally:
        db.close()

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_image_pose(self, job_id: int, media_id: int):
    """Process pose estimation for a single image"""
    db = get_db_session()
    
    try:
        # Update job status to running
        update_job_status(job_id, JobStatus.RUNNING, 0.0)
        
        # Get media file
        media = db.query(Media).filter(Media.id == media_id).first()
        if not media:
            raise ValueError(f"Media {media_id} not found")
        
        # Load image
        image = cv2.imread(media.file_path)
        if image is None:
            raise ValueError(f"Could not load image from {media.file_path}")
        
        update_job_status(job_id, JobStatus.RUNNING, 25.0)
        
        # Perform pose estimation
        result = pose_estimator.estimate_pose_image(image)
        
        update_job_status(job_id, JobStatus.RUNNING, 75.0)
        
        # Save keypoints to database
        pose_data = PoseKeypointsCreate(
            media_id=media_id,
            keypoints=result.keypoints,
            confidence_scores=result.confidence_scores,
            processing_time=result.processing_time,
            model_version="openpose_v1.0"
        )
        
        pose_keypoints = PoseKeypoints(
            media_id=media_id,
            keypoints=[kp.dict() for kp in result.keypoints],
            confidence_scores=result.confidence_scores,
            processing_time=result.processing_time,
            model_version="openpose_v1.0",
            frame_number=0
        )
        
        db.add(pose_keypoints)
        db.commit()
        db.refresh(pose_keypoints)
        
        # Prepare result
        task_result = {
            "pose_keypoints_id": pose_keypoints.id,
            "keypoints_count": len(result.keypoints),
            "average_confidence": sum(result.confidence_scores) / len(result.confidence_scores),
            "processing_time": result.processing_time,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        update_job_status(job_id, JobStatus.COMPLETED, 100.0, task_result)
        
        logger.info(f"Completed image pose estimation for job {job_id}, media {media_id}")
        return task_result
        
    except Exception as exc:
        logger.error(f"Error in image pose estimation job {job_id}: {exc}")
        
        # Retry logic
        if self.request.retries < self.max_retries:
            update_job_status(job_id, JobStatus.PENDING)
            raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
        else:
            update_job_status(job_id, JobStatus.FAILED, error=str(exc))
            raise exc
    
    finally:
        db.close()

@celery_app.task(bind=True, max_retries=3, default_retry_delay=120)
def process_video_pose(self, job_id: int, media_id: int, frame_skip: int = 1):
    """Process pose estimation for video frames"""
    db = get_db_session()
    
    try:
        # Update job status to running
        update_job_status(job_id, JobStatus.RUNNING, 0.0)
        
        # Get media file
        media = db.query(Media).filter(Media.id == media_id).first()
        if not media:
            raise ValueError(f"Media {media_id} not found")
        
        # Open video
        cap = cv2.VideoCapture(media.file_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video {media.file_path}")
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        update_job_status(job_id, JobStatus.RUNNING, 5.0)
        
        processed_frames = 0
        total_frames_to_process = frame_count // (frame_skip + 1)
        keypoints_results = []
        
        frame_number = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Skip frames if specified
            if frame_number % (frame_skip + 1) != 0:
                frame_number += 1
                continue
            
            # Estimate pose for current frame
            result = pose_estimator.estimate_pose_image(frame)
            
            # Save keypoints to database
            pose_keypoints = PoseKeypoints(
                media_id=media_id,
                keypoints=[kp.dict() for kp in result.keypoints],
                confidence_scores=result.confidence_scores,
                processing_time=result.processing_time,
                model_version="openpose_v1.0",
                frame_number=frame_number,
                timestamp=result.timestamp or datetime.utcnow()
            )
            
            db.add(pose_keypoints)
            keypoints_results.append({
                "frame_number": frame_number,
                "keypoints_count": len(result.keypoints),
                "average_confidence": sum(result.confidence_scores) / len(result.confidence_scores)
            })
            
            processed_frames += 1
            frame_number += 1
            
            # Update progress
            progress = 5.0 + (processed_frames / total_frames_to_process) * 90.0
            update_job_status(job_id, JobStatus.RUNNING, progress)
            
            # Commit every 10 frames to avoid large transactions
            if processed_frames % 10 == 0:
                db.commit()
                logger.info(f"Processed {processed_frames}/{total_frames_to_process} frames for job {job_id}")
        
        cap.release()
        db.commit()
        
        # Prepare result
        task_result = {
            "total_frames_processed": processed_frames,
            "total_keypoints_detected": len(keypoints_results),
            "average_confidence": sum(r["average_confidence"] for r in keypoints_results) / len(keypoints_results) if keypoints_results else 0,
            "video_duration": frame_count / fps if fps > 0 else 0,
            "processing_fps": processed_frames / ((datetime.utcnow() - db.query(JobQueue).filter(JobQueue.id == job_id).first().started_at).total_seconds()) if processed_frames > 0 else 0,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        update_job_status(job_id, JobStatus.COMPLETED, 100.0, task_result)
        
        logger.info(f"Completed video pose estimation for job {job_id}, media {media_id}. Processed {processed_frames} frames.")
        return task_result
        
    except Exception as exc:
        logger.error(f"Error in video pose estimation job {job_id}: {exc}")
        
        # Retry logic
        if self.request.retries < self.max_retries:
            update_job_status(job_id, JobStatus.PENDING)
            raise self.retry(exc=exc, countdown=120 * (2 ** self.request.retries))
        else:
            update_job_status(job_id, JobStatus.FAILED, error=str(exc))
            raise exc
    
    finally:
        db.close()

@celery_app.task(bind=True, max_retries=2)
def process_pose_comparison(self, job_id: int, media_id_1: int, media_id_2: int):
    """Compare poses between two media files"""
    db = get_db_session()
    
    try:
        update_job_status(job_id, JobStatus.RUNNING, 0.0)
        
        # Get pose keypoints for both media
        pose1 = db.query(PoseKeypoints).filter(PoseKeypoints.media_id == media_id_1).first()
        pose2 = db.query(PoseKeypoints).filter(PoseKeypoints.media_id == media_id_2).first()
        
        if not pose1 or not pose2:
            raise ValueError("Pose keypoints not found for one or both media files")
        
        update_job_status(job_id, JobStatus.RUNNING, 25.0)
        
        # Convert keypoints to proper format
        from .schemas import PoseKeypoint
        keypoints1 = [PoseKeypoint(**kp) for kp in pose1.keypoints]
        keypoints2 = [PoseKeypoint(**kp) for kp in pose2.keypoints]
        
        # Calculate similarity
        similarity = pose_estimator.calculate_pose_similarity(keypoints1, keypoints2)
        
        update_job_status(job_id, JobStatus.RUNNING, 75.0)
        
        # Save comparison result
        comparison = PoseComparison(
            media_id_1=media_id_1,
            media_id_2=media_id_2,
            similarity_score=similarity,
            comparison_method="euclidean_distance",
            details={
                "keypoints_compared": len(keypoints1),
                "confidence_1": sum(pose1.confidence_scores) / len(pose1.confidence_scores),
                "confidence_2": sum(pose2.confidence_scores) / len(pose2.confidence_scores)
            }
        )
        
        db.add(comparison)
        db.commit()
        db.refresh(comparison)
        
        task_result = {
            "comparison_id": comparison.id,
            "similarity_score": similarity,
            "comparison_method": "euclidean_distance",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        update_job_status(job_id, JobStatus.COMPLETED, 100.0, task_result)
        
        logger.info(f"Completed pose comparison for job {job_id}")
        return task_result
        
    except Exception as exc:
        logger.error(f"Error in pose comparison job {job_id}: {exc}")
        
        if self.request.retries < self.max_retries:
            update_job_status(job_id, JobStatus.PENDING)
            raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
        else:
            update_job_status(job_id, JobStatus.FAILED, error=str(exc))
            raise exc
    
    finally:
        db.close()

@celery_app.task
def send_webhook_notification(job_id: int):
    """Send webhook notification when job completes"""
    db = get_db_session()
    
    try:
        job = db.query(JobQueue).filter(JobQueue.id == job_id).first()
        if not job or not job.user.webhook_url:
            return
        
        # Prepare webhook payload
        payload = {
            "job_id": job.id,
            "job_type": job.job_type,
            "status": job.status.value,
            "user_id": job.user_id,
            "created_at": job.created_at.isoformat(),
            "completed_at": job.completed_at.isoformat() if job.completed_at else None,
            "result": job.result,
            "error": job.error_message,
            "processing_time": (job.completed_at - job.started_at).total_seconds() if job.started_at and job.completed_at else None
        }
        
        # Send webhook
        response = requests.post(
            job.user.webhook_url,
            json=payload,
            timeout=settings.WEBHOOK_TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
        
        response.raise_for_status()
        logger.info(f"Webhook notification sent for job {job_id}")
        
    except Exception as e:
        logger.error(f"Error sending webhook notification for job {job_id}: {e}")
    
    finally:
        db.close()

@celery_app.task
def cleanup_old_data():
    """Clean up old data (media files, keypoints, jobs)"""
    db = get_db_session()
    
    try:
        # Clean up old jobs
        cutoff_date = datetime.utcnow() - timedelta(days=settings.DATA_RETENTION_DAYS)
        
        old_jobs = db.query(JobQueue).filter(
            JobQueue.completed_at < cutoff_date,
            JobQueue.status.in_([JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED])
        ).all()
        
        for job in old_jobs:
            db.delete(job)
        
        # Clean up old media files (if configured)
        old_media = db.query(Media).filter(
            Media.created_at < cutoff_date
        ).all()
        
        for media in old_media:
            # Delete physical file
            media_processor.delete_media_file(media.file_path)
            
            # Delete associated keypoints
            db.query(PoseKeypoints).filter(PoseKeypoints.media_id == media.id).delete()
            
            # Delete media record
            db.delete(media)
        
        db.commit()
        
        # Clean up temporary files
        media_processor.cleanup_temp_files()
        
        logger.info(f"Cleaned up {len(old_jobs)} old jobs and {len(old_media)} old media files")
        
    except Exception as e:
        logger.error(f"Error in cleanup task: {e}")
    
    finally:
        db.close()

@celery_app.task
def generate_analytics_report(user_id: int = None):
    """Generate analytics report for user or system"""
    db = get_db_session()
    
    try:
        # Generate various analytics
        if user_id:
            # User-specific analytics
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {"error": "User not found"}
            
            # Get user's media and pose data
            media_count = db.query(Media).filter(Media.user_id == user_id).count()
            pose_count = db.query(PoseKeypoints).join(Media).filter(Media.user_id == user_id).count()
            
            # Calculate average confidence
            avg_confidence = db.query(PoseKeypoints).join(Media).filter(
                Media.user_id == user_id
            ).with_entities(PoseKeypoints.confidence_scores).all()
            
            if avg_confidence:
                all_scores = []
                for scores in avg_confidence:
                    all_scores.extend(scores[0])
                avg_conf = sum(all_scores) / len(all_scores) if all_scores else 0
            else:
                avg_conf = 0
            
            report = {
                "user_id": user_id,
                "total_media": media_count,
                "total_poses": pose_count,
                "average_confidence": avg_conf,
                "generated_at": datetime.utcnow().isoformat()
            }
        else:
            # System-wide analytics
            total_users = db.query(User).count()
            total_media = db.query(Media).count()
            total_poses = db.query(PoseKeypoints).count()
            total_jobs = db.query(JobQueue).count()
            
            report = {
                "total_users": total_users,
                "total_media": total_media,
                "total_poses": total_poses,
                "total_jobs": total_jobs,
                "generated_at": datetime.utcnow().isoformat()
            }
        
        logger.info(f"Generated analytics report for user {user_id or 'system'}")
        return report
        
    except Exception as e:
        logger.error(f"Error generating analytics report: {e}")
        return {"error": str(e)}
    
    finally:
        db.close()

@celery_app.task
def send_email_notification(user_id: int, subject: str, message: str):
    """Send email notification to user"""
    from email_service import email_service
    db = get_db_session()
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"error": "User not found"}
        
        # Send actual email using the enhanced email service
        email_sent = email_service.send_notification_email(
            to_email=user.email,
            subject=subject,
            body=message,
            notification_type="info"
        )
        
        if email_sent:
            logger.info(f"Email notification sent to {user.email}: {subject}")
            return {"status": "sent", "recipient": user.email}
        else:
            logger.error(f"Failed to send email to {user.email}")
            return {"error": "Failed to send email"}
        
    except Exception as e:
        logger.error(f"Error sending email notification: {e}")
        return {"error": str(e)}
    
    finally:
        db.close()

@celery_app.task
def send_appointment_reminder(to_email: str, appointment_details: dict):
    """Send appointment reminder email"""
    from email_service import email_service
    
    try:
        result = email_service.send_appointment_reminder(to_email, appointment_details)
        if result:
            logger.info(f"Appointment reminder sent to {to_email}")
            return {"status": "success", "message": "Appointment reminder sent"}
        else:
            logger.error(f"Failed to send appointment reminder to {to_email}")
            return {"status": "error", "message": "Failed to send appointment reminder"}
    except Exception as e:
        logger.error(f"Error sending appointment reminder: {e}")
        return {"status": "error", "message": str(e)}

@celery_app.task
def send_exercise_completion_notification(to_email: str, exercise_name: str, completion_data: dict):
    """Send exercise completion notification"""
    from email_service import email_service
    
    try:
        result = email_service.send_exercise_completion_notification(to_email, exercise_name, completion_data)
        if result:
            logger.info(f"Exercise completion notification sent to {to_email}")
            return {"status": "success", "message": "Exercise completion notification sent"}
        else:
            logger.error(f"Failed to send exercise completion notification to {to_email}")
            return {"status": "error", "message": "Failed to send exercise completion notification"}
    except Exception as e:
        logger.error(f"Error sending exercise completion notification: {e}")
        return {"status": "error", "message": str(e)}

# Periodic tasks
@celery_app.task
def periodic_cleanup():
    """Periodic cleanup task"""
    cleanup_old_data.delay()

@celery_app.task
def periodic_health_check():
    """Periodic health check task"""
    try:
        # Check database connection
        db = get_db_session()
        db.execute("SELECT 1")
        db.close()
        
        # Check pose estimator
        if not pose_estimator.is_initialized:
            logger.warning("Pose estimator not initialized")
        
        # Check storage
        storage_stats = media_processor.get_storage_stats()
        
        logger.info(f"Health check completed. Storage stats: {storage_stats}")
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "error": str(e), "timestamp": datetime.utcnow().isoformat()}

# Configure periodic tasks
celery_app.conf.beat_schedule = {
    'cleanup-old-data': {
        'task': 'backend.tasks.periodic_cleanup',
        'schedule': 86400.0,  # Run daily
    },
    'health-check': {
        'task': 'backend.tasks.periodic_health_check',
        'schedule': 300.0,  # Run every 5 minutes
    },
}

celery_app.conf.timezone = 'UTC'