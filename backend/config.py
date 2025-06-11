from pydantic_settings import BaseSettings
from typing import Optional, List
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Pose Estimation API"
    APP_VERSION: str = "1.0.0"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    
    # Database
    DATABASE_URL: Optional[str] = None
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "password"
    DB_NAME: str = "pose_estimation_db"
    
    # Redis
    REDIS_URL: Optional[str] = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    JWT_SECRET_KEY: str = "your-jwt-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # File Storage
    STORAGE_TYPE: str = "local"  # local, s3, gcp
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    MAX_VIDEO_DURATION: int = 300  # 5 minutes
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".mp4", ".mov", ".avi", ".webm"]
    
    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: Optional[str] = None
    
    # Google Cloud Storage
    GCP_PROJECT_ID: Optional[str] = None
    GCP_BUCKET: Optional[str] = None
    GCP_CREDENTIALS_PATH: Optional[str] = None
    
    # Celery
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_RESULT_SERIALIZER: str = "json"
    CELERY_ACCEPT_CONTENT: List[str] = ["json"]
    CELERY_TIMEZONE: str = "UTC"
    
    # OpenPose
    OPENPOSE_MODEL_PATH: str = "models/openpose"
    OPENPOSE_NET_RESOLUTION: str = "368x368"
    OPENPOSE_OUTPUT_RESOLUTION: str = "1280x720"
    OPENPOSE_MODEL_POSE: str = "BODY_25"
    OPENPOSE_RENDER_THRESHOLD: float = 0.05
    
    # GPU
    USE_GPU: bool = True
    GPU_DEVICE_ID: int = 0
    MAX_GPU_MEMORY: float = 0.8  # 80% of GPU memory
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    RATE_LIMIT_PER_DAY: int = 10000
    
    # Monitoring
    ENABLE_MONITORING: bool = True
    ENABLE_METRICS: bool = True
    METRICS_ENABLED: bool = True
    METRICS_PORT: int = 9090
    SENTRY_DSN: Optional[str] = None
    
    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_TLS: bool = True
    SMTP_USE_TLS: bool = True
    EMAIL_FROM: Optional[str] = None
    
    # Webhook
    WEBHOOK_TIMEOUT: int = 30
    WEBHOOK_MAX_RETRIES: int = 3
    WEBHOOK_RETRY_DELAY: int = 60
    
    # Job Processing
    MAX_CONCURRENT_JOBS: int = 5
    JOB_TIMEOUT_SECONDS: int = 3600
    JOB_RETRY_ATTEMPTS: int = 3
    
    # Cache
    CACHE_TTL_SECONDS: int = 3600
    CACHE_MAX_SIZE: int = 1000
    
    # Security
    CORS_ORIGINS: List[str] = ["*"]
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    ALLOWED_HOSTS: List[str] = ["*"]
    ENABLE_HTTPS: bool = False
    SSL_CERT_PATH: Optional[str] = None
    SSL_KEY_PATH: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    LOG_FILE: Optional[str] = None
    
    # Multi-tenant
    ENABLE_MULTI_TENANT: bool = False
    DEFAULT_ORGANIZATION: str = "default"
    
    # Data Retention
    DATA_RETENTION_DAYS: int = 365
    CLEANUP_INTERVAL_HOURS: int = 24
    
    # Backup
    BACKUP_ENABLED: bool = False
    BACKUP_INTERVAL_HOURS: int = 24
    BACKUP_RETENTION_DAYS: int = 30
    BACKUP_S3_BUCKET: Optional[str] = None
    
    # Localization
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: List[str] = ["en", "id", "es", "fr", "de"]
    
    # API Documentation
    DOCS_URL: str = "/docs"
    REDOC_URL: str = "/redoc"
    OPENAPI_URL: str = "/openapi.json"
    
    # Development
    RELOAD: bool = False
    SERVE_STATIC_FILES: bool = True
    
    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def redis_url(self) -> str:
        if self.REDIS_URL:
            return self.REDIS_URL
        auth = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
        return f"redis://{auth}{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    @property
    def celery_broker_url(self) -> str:
        return self.CELERY_BROKER_URL or self.redis_url
    
    @property
    def celery_result_backend(self) -> str:
        return self.CELERY_RESULT_BACKEND or self.redis_url
    
    def get_upload_path(self) -> Path:
        """Get the upload directory path"""
        upload_path = Path(self.UPLOAD_DIR)
        upload_path.mkdir(parents=True, exist_ok=True)
        return upload_path
    
    def is_allowed_file(self, filename: str) -> bool:
        """Check if file extension is allowed"""
        return any(filename.lower().endswith(ext) for ext in self.ALLOWED_EXTENSIONS)
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()

# Environment-specific configurations
class DevelopmentSettings(Settings):
    DEBUG: bool = True
    RELOAD: bool = True
    LOG_LEVEL: str = "DEBUG"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080"]

class ProductionSettings(Settings):
    DEBUG: bool = False
    RELOAD: bool = False
    LOG_LEVEL: str = "INFO"
    ENABLE_HTTPS: bool = True
    CORS_ORIGINS: List[str] = []  # Set specific origins in production

class TestingSettings(Settings):
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./test.db"
    REDIS_URL: str = "redis://localhost:6379/1"
    LOG_LEVEL: str = "DEBUG"

def get_settings() -> Settings:
    """Get settings based on environment"""
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        return ProductionSettings()
    elif env == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()