from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"
    VIP = "vip"

class TokenData(BaseModel):
    user_id: int
    username: Optional[str] = None
    role: Optional[UserRole] = None

class JobStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class JobPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    VIP = "vip"

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    timezone: Optional[str] = "UTC"
    language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None

class UserProfileUpdate(UserUpdate):
    pass

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class UserWithToken(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# Media Schemas
class MediaMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    custom_fields: Optional[Dict[str, Any]] = {}

class MediaBase(BaseModel):
    filename: str
    file_type: str
    is_public: Optional[bool] = False
    tags: Optional[List[str]] = []

class MediaCreate(MediaBase):
    pass

class MediaResponse(MediaBase):
    id: str
    user_id: int
    file_path: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    duration: Optional[float] = None
    fps: Optional[float] = None
    resolution: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    is_processed: bool
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Pose Keypoints Schemas
class PoseKeypointsBase(BaseModel):
    frame_number: int = 0
    timestamp: Optional[float] = None
    keypoints: List[List[float]]  # Array of [x, y, confidence] for each keypoint
    confidence_scores: Optional[List[float]] = None
    pose_score: Optional[float] = None
    num_people: int = 1

class PoseKeypointsCreate(PoseKeypointsBase):
    media_id: str

class PoseKeypointsResponse(PoseKeypointsBase):
    id: int
    media_id: str
    user_id: int
    model_version: Optional[str] = None
    processing_time: Optional[float] = None
    is_anonymized: bool
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Job Schemas
class JobBase(BaseModel):
    job_type: str
    priority: JobPriority = JobPriority.NORMAL
    timeout_seconds: int = 3600

class JobCreate(JobBase):
    media_id: Optional[str] = None

class JobUpdate(BaseModel):
    status: Optional[JobStatus] = None
    progress: Optional[float] = None
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

class JobResponse(JobBase):
    id: str
    user_id: int
    media_id: Optional[str] = None
    status: JobStatus
    progress: float
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    retry_count: int
    max_retries: int
    estimated_completion: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Feedback Schemas
class FeedbackBase(BaseModel):
    feedback_type: str
    rating: Optional[int] = None
    message: str
    
    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

class FeedbackCreate(FeedbackBase):
    media_id: Optional[str] = None

class FeedbackResponse(FeedbackBase):
    id: int
    user_id: int
    media_id: Optional[str] = None
    is_resolved: bool
    admin_response: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Pose Estimation Schemas
class PoseEstimationRequest(BaseModel):
    media_id: int
    options: Optional[Dict[str, Any]] = None

class PoseEstimationResponse(BaseModel):
    media_id: int
    keypoints: List[Dict[str, Any]]
    confidence_score: float
    processing_time: float
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

class VideoProcessingRequest(BaseModel):
    media_id: int
    frame_skip: Optional[int] = 1
    options: Optional[Dict[str, Any]] = None

class PoseKeypointResponse(BaseModel):
    id: int
    media_id: int
    frame_number: int
    keypoints: List[Dict[str, Any]]
    confidence_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaginatedPoseKeypointResponse(BaseModel):
    items: List[PoseKeypointResponse]
    total: int
    page: int
    size: int
    pages: int

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class AccountDeletionRequest(BaseModel):
    password: str
    confirmation: str

class UserRoleUpdate(BaseModel):
    role: str

class UserStatusUpdate(BaseModel):
    is_active: bool

class AnalyticsResponse(BaseModel):
    total_users: int
    active_users: int
    total_media: int
    total_poses: int
    storage_used: int
    api_calls_today: int

class WebhookResponse(BaseModel):
    id: int
    url: str
    events: List[str]
    is_active: bool
    created_at: datetime

class WebhookCreate(BaseModel):
    url: str
    events: List[str]
    is_active: bool = True

class WebhookUpdate(BaseModel):
    url: Optional[str] = None
    events: Optional[List[str]] = None
    is_active: Optional[bool] = None

# Pose Comparison Schemas
class PoseComparisonRequest(BaseModel):
    media_id_1: str
    media_id_2: str
    comparison_method: Optional[str] = "euclidean"

class PoseComparisonResponse(BaseModel):
    similarity_score: float
    comparison_method: str
    media_id_1: str
    media_id_2: str
    details: Optional[Dict[str, Any]] = None
    created_at: datetime

# API Key Schemas
class APIKeyCreate(BaseModel):
    name: str
    permissions: List[str]
    rate_limit: Optional[int] = 1000
    expires_at: Optional[datetime] = None

class APIKeyResponse(BaseModel):
    id: int
    name: str
    key: str  # Only returned on creation
    permissions: List[str]
    rate_limit: int
    is_active: bool
    last_used: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Organization Schemas
class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationResponse(OrganizationBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Webhook Schemas
class WebhookEndpointCreate(BaseModel):
    url: str
    events: List[str]
    secret: Optional[str] = None

class WebhookEndpointResponse(BaseModel):
    id: int
    user_id: int
    url: str
    events: List[str]
    is_active: bool
    retry_count: int
    last_success: Optional[datetime] = None
    last_failure: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Notification Schemas
class NotificationCreate(BaseModel):
    title: str
    message: str
    notification_type: str
    data: Optional[Dict[str, Any]] = None

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    data: Optional[Dict[str, Any]] = None
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Export Schemas
class ExportRequest(BaseModel):
    user_id: Optional[int] = None
    format: str = "json"  # json, csv
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    include_anonymized: bool = False
    
    @validator('format')
    def validate_format(cls, v):
        if v.lower() not in ['json', 'csv']:
            raise ValueError('Format must be either json or csv')
        return v.lower()

# Statistics Schemas
class UserStatistics(BaseModel):
    total_media_uploaded: int
    total_poses_analyzed: int
    total_processing_time: float
    average_pose_score: float
    most_active_day: Optional[str] = None
    recent_activity: List[Dict[str, Any]]

class SystemStatistics(BaseModel):
    total_users: int
    total_media: int
    total_poses: int
    active_jobs: int
    system_uptime: float
    average_processing_time: float
    gpu_utilization: Optional[float] = None
    memory_usage: Optional[float] = None

# Health Check Schema
class HealthCheckResponse(BaseModel):
    status: str
    timestamp: datetime
    services: Dict[str, str]
    version: Optional[str] = None
    uptime: Optional[float] = None

# Error Schemas
class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime

# Batch Processing Schemas
class BatchJobCreate(BaseModel):
    media_ids: List[str]
    job_type: str
    priority: JobPriority = JobPriority.NORMAL
    callback_url: Optional[str] = None

class BatchJobResponse(BaseModel):
    batch_id: str
    job_ids: List[str]
    total_jobs: int
    status: str
    created_at: datetime

# Real-time Streaming Schemas
class StreamingFrame(BaseModel):
    timestamp: datetime
    frame_data: str  # Base64 encoded frame
    metadata: Optional[Dict[str, Any]] = None

class StreamingResult(BaseModel):
    timestamp: datetime
    keypoints: List[List[float]]
    confidence_scores: List[float]
    pose_score: float
    processing_time: float
    alerts: Optional[List[str]] = None

# Model Management Schemas
class ModelVersionCreate(BaseModel):
    name: str
    version: str
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None

class ModelVersionResponse(BaseModel):
    id: int
    name: str
    version: str
    description: Optional[str] = None
    model_path: str
    config: Optional[Dict[str, Any]] = None
    is_active: bool
    performance_metrics: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True