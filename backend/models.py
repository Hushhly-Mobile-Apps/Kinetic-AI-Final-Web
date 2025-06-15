from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, Float, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"
    VIP = "vip"

class JobStatus(enum.Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class JobPriority(enum.Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    VIP = "vip"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    timezone = Column(String, default="UTC")
    language = Column(String, default="en")
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    api_key = Column(String, unique=True)
    api_key_created_at = Column(DateTime)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    media = relationship("Media", back_populates="user")
    pose_keypoints = relationship("PoseKeypoints", back_populates="user")
    jobs = relationship("JobQueue", back_populates="user")
    feedback = relationship("Feedback", back_populates="user")
    organization = relationship("Organization", back_populates="users")
    audit_logs = relationship("AuditLog", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    settings = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="organization")

class Media(Base):
    __tablename__ = "media"
    
    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # image, video
    mime_type = Column(String)
    file_size = Column(Integer)  # bytes
    duration = Column(Float)  # seconds for video
    fps = Column(Float)  # frames per second for video
    resolution = Column(String)  # "1920x1080"
    width = Column(Integer)
    height = Column(Integer)
    is_processed = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    meta_data = Column(JSON)
    tags = Column(JSON)  # Array of tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="media")
    pose_keypoints = relationship("PoseKeypoints", back_populates="media")
    jobs = relationship("JobQueue", back_populates="media")

class PoseKeypoints(Base):
    __tablename__ = "pose_keypoints"
    
    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(String, ForeignKey("media.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    frame_number = Column(Integer, default=0)  # 0 for images
    timestamp = Column(Float)  # timestamp in video
    keypoints = Column(JSON, nullable=False)  # Array of keypoint coordinates
    confidence_scores = Column(JSON)  # Confidence scores for each keypoint
    pose_score = Column(Float)  # Overall pose confidence
    num_people = Column(Integer, default=1)
    model_version = Column(String)  # Version of pose estimation model used
    processing_time = Column(Float)  # Time taken to process in seconds
    is_anonymized = Column(Boolean, default=False)
    meta_data = Column(JSON)  # Additional metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    media = relationship("Media", back_populates="pose_keypoints")
    user = relationship("User", back_populates="pose_keypoints")

class JobQueue(Base):
    __tablename__ = "job_queue"
    
    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    media_id = Column(String, ForeignKey("media.id"))
    job_type = Column(String, nullable=False)  # video_pose_estimation, image_pose_estimation, etc.
    status = Column(Enum(JobStatus), default=JobStatus.QUEUED)
    priority = Column(Enum(JobPriority), default=JobPriority.NORMAL)
    progress = Column(Float, default=0.0)  # 0.0 to 100.0
    result = Column(JSON)  # Job result data
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    timeout_seconds = Column(Integer, default=3600)
    estimated_completion = Column(DateTime)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    media = relationship("Media", back_populates="jobs")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    media_id = Column(String, ForeignKey("media.id"))
    feedback_type = Column(String)  # pose_quality, accuracy, suggestion, bug_report
    rating = Column(Integer)  # 1-5 rating
    message = Column(Text)
    is_resolved = Column(Boolean, default=False)
    admin_response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="feedback")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)  # login, upload, delete, etc.
    resource_type = Column(String)  # user, media, pose_keypoints
    resource_id = Column(String)
    ip_address = Column(String)
    user_agent = Column(String)
    details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")

class ModelVersion(Base):
    __tablename__ = "model_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    description = Column(Text)
    model_path = Column(String, nullable=False)
    config = Column(JSON)
    is_active = Column(Boolean, default=False)
    performance_metrics = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key_hash = Column(String, nullable=False, unique=True)
    name = Column(String)  # User-defined name for the key
    permissions = Column(JSON)  # Array of allowed permissions
    rate_limit = Column(Integer)  # Requests per hour
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class PoseComparison(Base):
    __tablename__ = "pose_comparisons"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    media_id_1 = Column(String, ForeignKey("media.id"), nullable=False)
    media_id_2 = Column(String, ForeignKey("media.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    comparison_method = Column(String)  # euclidean, cosine, etc.
    details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemMetrics(Base):
    __tablename__ = "system_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, nullable=False)
    metric_value = Column(Float, nullable=False)
    metric_type = Column(String)  # counter, gauge, histogram
    labels = Column(JSON)  # Additional labels for the metric
    timestamp = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info")  # info, success, warning, error, appointment
    notification_type = Column(String)  # job_complete, error, alert (for backward compatibility)
    is_read = Column(Boolean, default=False)
    notification_metadata = Column(JSON)  # Additional notification metadata
    data = Column(JSON)  # Additional notification data (for backward compatibility)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class WebhookEndpoint(Base):
    __tablename__ = "webhook_endpoints"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    url = Column(String, nullable=False)
    secret = Column(String)  # For webhook signature verification
    events = Column(JSON)  # Array of events to subscribe to
    is_active = Column(Boolean, default=True)
    retry_count = Column(Integer, default=0)
    last_success = Column(DateTime)
    last_failure = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)