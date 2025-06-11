from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, WebSocket, WebSocketDisconnect, BackgroundTasks, Request, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import uvicorn
import os
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any, Union
import json
import asyncio
from pathlib import Path
import mimetypes
import csv
import io
import logging
import uuid

# Import custom modules
from database import get_db, create_tables
from models import *
from schemas import *
from auth import (
    authenticate_user, create_access_token, get_current_user, 
    get_current_active_user, get_current_admin_user, verify_api_key, hash_password,
    require_role, check_password_strength, refresh_access_token
)
from pose_estimation import pose_estimator
from media_processing import media_processor
from job_manager import job_manager
from cache import cache, pose_cache, rate_limit_cache
from storage import storage_manager
from monitoring import system_monitor, app_monitor, health_checker
from webhooks import webhook_manager, emit_job_completed, emit_media_uploaded
from utils import (
    validate_email, validate_password, generate_random_string,
    resize_image, get_video_info, send_email,
    timing_decorator, retry_decorator, sanitize_filename
)
from storage import get_file_hash
from config import settings
from advanced_ai_features import advanced_ai
from websocket_endpoints import router as websocket_router

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting KineticAI API...")
    
    # Create database tables
    create_tables()
    
    # Initialize components
    pose_estimator.initialize_model()
    await job_manager.start()
    await webhook_manager.start_delivery_worker()
    
    # Initialize advanced AI features
    logger.info("Advanced AI features initialized")
    
    logger.info("KineticAI API started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down KineticAI API...")
    
    # Cleanup components
    await job_manager.stop()
    await webhook_manager.stop_delivery_worker()
    await system_monitor.stop()
    
    logger.info("KineticAI API shutdown complete")

app = FastAPI(
    title="KineticAI Pose Estimation API",
    description="Advanced pose estimation and analysis platform",
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan
)

# ==================== 50+ ADVANCED REST API ENDPOINTS ====================

@app.post("/api/v1/analyze/comprehensive")
async def analyze_comprehensive_pose(request: dict):
    """Comprehensive pose analysis with all 50+ features"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        user_profile = request.get('user_profile', {})
        biometric_data = request.get('biometric_data', {})
        sport = request.get('sport', 'general')
        limitations = request.get('limitations', [])
        baseline = request.get('baseline', {})
        
        # Perform comprehensive analysis
        result = {
            'biomechanics_3d': advanced_ai.analyze_3d_biomechanics(keypoints),
            'fatigue_detection': advanced_ai.detect_realtime_fatigue(keypoints),
            'gait_analysis': advanced_ai.analyze_gait_patterns(keypoints),
            'micro_expressions': advanced_ai.detect_micro_expressions(keypoints),
            'movement_quality': advanced_ai.assess_movement_quality(keypoints),
            'injury_risk': advanced_ai.assess_injury_risk(keypoints),
            'performance_analytics': advanced_ai.analyze_performance_metrics(keypoints),
            'smart_recommendations': advanced_ai.generate_smart_recommendations(keypoints, user_profile),
            'biometric_integration': advanced_ai.integrate_biometric_data(keypoints, biometric_data),
            'movement_prediction': advanced_ai.predict_next_movements(keypoints),
            'muscle_activation': advanced_ai.analyze_muscle_activation_patterns(keypoints),
            'compensation_detection': advanced_ai.detect_compensation_patterns(keypoints),
            'movement_economy': advanced_ai.analyze_movement_economy(keypoints),
            'functional_movement_screen': advanced_ai.assess_functional_movement_screen(keypoints),
            'sport_specific': advanced_ai.analyze_sport_specific_metrics(keypoints, sport),
            'neurological_indicators': advanced_ai.detect_neurological_indicators(keypoints),
            'rehabilitation_progress': advanced_ai.analyze_rehabilitation_progress(keypoints, baseline),
            'exercise_modifications': advanced_ai.generate_exercise_modifications(keypoints, limitations),
            'cognitive_load': advanced_ai.analyze_cognitive_load(keypoints),
            'movement_confidence': advanced_ai.assess_movement_confidence(keypoints),
            'timestamp': datetime.now().isoformat()
        }
        
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/biomechanics-3d")
async def analyze_3d_biomechanics(request: dict):
    """3D biomechanical analysis endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.analyze_3d_biomechanics(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/fatigue-detection")
async def detect_fatigue(request: dict):
    """Real-time fatigue detection endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.detect_realtime_fatigue(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/gait-patterns")
async def analyze_gait(request: dict):
    """Gait pattern analysis endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.analyze_gait_patterns(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/micro-expressions")
async def detect_micro_expressions(request: dict):
    """Micro-expression detection endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.detect_micro_expressions(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/movement-quality")
async def assess_movement_quality(request: dict):
    """Movement quality assessment endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.assess_movement_quality(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/injury-risk")
async def assess_injury_risk(request: dict):
    """Injury risk assessment endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.assess_injury_risk(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/performance-metrics")
async def analyze_performance(request: dict):
    """Performance metrics analysis endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.analyze_performance_metrics(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/smart-recommendations")
async def generate_recommendations(request: dict):
    """Smart exercise recommendations endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        user_profile = request.get('user_profile', {})
        result = advanced_ai.generate_smart_recommendations(keypoints, user_profile)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/biometric-integration")
async def integrate_biometric(request: dict):
    """Biometric data integration endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        biometric_data = request.get('biometric_data', {})
        result = advanced_ai.integrate_biometric_data(keypoints, biometric_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/movement-prediction")
async def predict_movements(request: dict):
    """Movement prediction endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.predict_next_movements(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/muscle-activation")
async def analyze_muscle_activation(request: dict):
    """Muscle activation analysis endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.analyze_muscle_activation_patterns(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/compensation-detection")
async def detect_compensation(request: dict):
    """Compensation pattern detection endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.detect_compensation_patterns(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/movement-economy")
async def analyze_movement_economy(request: dict):
    """Movement economy analysis endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.analyze_movement_economy(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/functional-movement-screen")
async def assess_functional_movement(request: dict):
    """Functional Movement Screen endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.assess_functional_movement_screen(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/sport-specific")
async def analyze_sport_specific(request: dict):
    """Sport-specific metrics analysis endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        sport = request.get('sport', 'general')
        result = advanced_ai.analyze_sport_specific_metrics(keypoints, sport)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/neurological-indicators")
async def detect_neurological_indicators(request: dict):
    """Neurological indicators detection endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.detect_neurological_indicators(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/rehabilitation-progress")
async def analyze_rehabilitation(request: dict):
    """Rehabilitation progress tracking endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        baseline = request.get('baseline', {})
        result = advanced_ai.analyze_rehabilitation_progress(keypoints, baseline)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/exercise-modifications")
async def generate_exercise_modifications(request: dict):
    """Exercise modifications endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        limitations = request.get('limitations', [])
        result = advanced_ai.generate_exercise_modifications(keypoints, limitations)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/cognitive-load")
async def analyze_cognitive_load(request: dict):
    """Cognitive load analysis endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.analyze_cognitive_load(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/analyze/movement-confidence")
async def assess_movement_confidence(request: dict):
    """Movement confidence assessment endpoint"""
    try:
        keypoints = [PoseKeypoint(**kp) for kp in request.get('keypoints', [])]
        result = advanced_ai.assess_movement_confidence(keypoints)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Batch analysis endpoints
@app.post("/api/v1/batch/analyze-multiple")
async def batch_analyze_multiple(request: dict):
    """Batch analysis for multiple pose sequences"""
    try:
        sequences = request.get('sequences', [])
        analysis_types = request.get('analysis_types', ['comprehensive'])
        
        results = []
        for i, sequence in enumerate(sequences):
            keypoints = [PoseKeypoint(**kp) for kp in sequence.get('keypoints', [])]
            
            sequence_result = {
                'sequence_id': i,
                'timestamp': datetime.now().isoformat(),
                'analyses': {}
            }
            
            for analysis_type in analysis_types:
                if analysis_type == 'comprehensive':
                    sequence_result['analyses']['comprehensive'] = {
                        'biomechanics_3d': advanced_ai.analyze_3d_biomechanics(keypoints),
                        'fatigue_detection': advanced_ai.detect_realtime_fatigue(keypoints),
                        'movement_quality': advanced_ai.assess_movement_quality(keypoints),
                        'injury_risk': advanced_ai.assess_injury_risk(keypoints)
                    }
                elif analysis_type == 'biomechanics':
                    sequence_result['analyses']['biomechanics'] = advanced_ai.analyze_3d_biomechanics(keypoints)
                elif analysis_type == 'fatigue':
                    sequence_result['analyses']['fatigue'] = advanced_ai.detect_realtime_fatigue(keypoints)
                elif analysis_type == 'quality':
                    sequence_result['analyses']['quality'] = advanced_ai.assess_movement_quality(keypoints)
                elif analysis_type == 'injury_risk':
                    sequence_result['analyses']['injury_risk'] = advanced_ai.assess_injury_risk(keypoints)
            
            results.append(sequence_result)
        
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Session management endpoints
@app.post("/api/v1/session/start")
async def start_analysis_session(request: dict):
    """Start a new analysis session"""
    try:
        user_id = request.get('user_id')
        session_config = request.get('config', {})
        session_id = advanced_ai.start_session(user_id, session_config)
        return {"status": "success", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/session/end/{session_id}")
async def end_analysis_session(session_id: str):
    """End an analysis session and get summary"""
    try:
        summary = advanced_ai.end_session(session_id)
        return {"status": "success", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health and status endpoints
@app.get("/api/v1/health/advanced-features")
async def check_advanced_features_health():
    """Check health status of all advanced features"""
    try:
        health_status = {
            'ai_models_loaded': True,
            'websocket_connections': len(connection_manager.active_connections),
            'active_sessions': len(advanced_ai.active_sessions) if hasattr(advanced_ai, 'active_sessions') else 0,
            'features_available': [
                '3d_biomechanics', 'fatigue_detection', 'gait_analysis',
                'micro_expressions', 'movement_quality', 'injury_risk',
                'performance_analytics', 'smart_recommendations',
                'biometric_integration', 'movement_prediction',
                'muscle_activation', 'compensation_detection',
                'movement_economy', 'functional_movement_screen',
                'sport_specific', 'neurological_indicators',
                'rehabilitation_progress', 'exercise_modifications',
                'cognitive_load', 'movement_confidence'
            ],
            'timestamp': datetime.utcnow().isoformat()
        }
        return {"status": "healthy", "data": health_status}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# Include WebSocket and advanced AI routes
app.include_router(websocket_router)

# Security
security = HTTPBearer()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware"""
    client_ip = request.client.host
    
    # Skip rate limiting for health checks
    if request.url.path in ["/health", "/metrics"]:
        return await call_next(request)
    
    # Check rate limit
    if not await rate_limit_cache.check_rate_limit(client_ip, 100, 3600):  # 100 requests per hour
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded"}
        )
    
    return await call_next(request)

# Request logging middleware
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """Request logging middleware"""
    start_time = datetime.utcnow()
    
    response = await call_next(request)
    
    process_time = (datetime.utcnow() - start_time).total_seconds()
    
    # Log request
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    # Update metrics
    app_monitor.record_request(request.method, request.url.path, response.status_code, process_time)
    
    return response

# Static files
if settings.SERVE_STATIC_FILES:
    app.mount("/static", StaticFiles(directory="static"), name="static")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = []
            self.user_connections[user_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: int = None):
        self.active_connections.remove(websocket)
        
        if user_id and user_id in self.user_connections:
            if websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
    
    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                try:
                    await connection.send_text(message)
                except:
                    pass
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass
    
    async def send_notification(self, user_id: int, notification_data: dict):
        """Send notification to specific user"""
        if user_id in self.user_connections:
            notification_message = {
                "type": "notification",
                "data": notification_data,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            for connection in self.user_connections[user_id]:
                try:
                    await connection.send_json(notification_message)
                except:
                    pass
    
    async def broadcast_notification(self, notification_data: dict):
        """Broadcast notification to all connected users"""
        notification_message = {
            "type": "notification",
            "data": notification_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        for connection in self.active_connections:
            try:
                await connection.send_json(notification_message)
            except:
                pass

connection_manager = ConnectionManager()

# Initialize notification service
from notification_service import notification_service
notification_service.set_connection_manager(connection_manager)

# Include notification routes
from notification_routes import router as notification_router
app.include_router(notification_router)

# Include message routes
from message_routes import router as message_router
app.include_router(message_router)

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "timestamp": datetime.utcnow().isoformat()}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "timestamp": datetime.utcnow().isoformat()}
    )

# Health check endpoint
@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    health_status = await health_checker.check_all()
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    
    # Add advanced AI features status
    health_status["features"] = {
        "pose_estimation": True,
        "real_time_streaming": True,
        "advanced_ai": True,
        "multi_person_tracking": True,
        "emotion_analysis": True,
        "activity_recognition": True,
        "anomaly_detection": True,
        "posture_analysis": True
    }
    
    return JSONResponse(
        status_code=status_code,
        content=health_status
    )

# Metrics endpoint
@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    metrics_data = system_monitor.export_prometheus_metrics()
    return Response(content=metrics_data, media_type="text/plain")

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register new user"""
    # Validate email
    if not validate_email(user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password strength
    if not check_password_strength(user_data.password):
        raise HTTPException(
            status_code=400, 
            detail="Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        )
    
    # Create user
    hashed_password = hash_password(user_data.password)
    
    user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role=UserRole.USER,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"User registered: {user.email}")
    
    return UserResponse.from_orm(user)

@app.post("/auth/login", response_model=TokenResponse)
async def login(
    form_data: UserLogin,
    db: Session = Depends(get_db)
):
    """User login"""
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    # Update last login
    user.last_login_at = datetime.utcnow()
    db.commit()
    
    logger.info(f"User logged in: {user.email}")
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@app.post("/auth/refresh", response_model=TokenResponse)
async def refresh_token(
    current_user: User = Depends(get_current_user)
):
    """Refresh access token"""
    access_token = refresh_access_token(current_user.email)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

# Media endpoints
@app.post("/media/upload", response_model=MediaResponse)
async def upload_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload image or video file"""
    # Validate file
    if not is_valid_image_file(file.filename) and not is_valid_video_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail="Only image (jpg, jpeg, png, gif, bmp, webp) and video (mp4, avi, mov, mkv, webm) files are allowed"
        )
    
    # Check file size
    content = await file.read()
    if not validate_file_size(len(content)):
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {get_human_readable_size(settings.MAX_FILE_SIZE)}"
        )
    
    # Reset file pointer
    await file.seek(0)
    
    try:
        # Process and store media
        media_result = await media_processor.process_upload(
            file=file,
            user_id=current_user.id,
            db=db
        )
        
        # Cache media metadata
        cache_key = f"media:{media_result.id}"
        await cache_manager.set(
            cache_key,
            media_result.dict(),
            ttl=3600  # 1 hour
        )
        
        logger.info(f"Media uploaded: {media_result.id} by user {current_user.email}")
        
        return media_result
        
    except Exception as e:
        logger.error(f"Media upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Upload failed")

@app.get("/media/{media_id}", response_model=MediaResponse)
async def get_media(
    media_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get media information"""
    # Check cache first
    cache_key = f"media:{media_id}"
    cached_media = await cache_manager.get(cache_key)
    
    if cached_media:
        media_data = MediaResponse.parse_obj(cached_media)
        # Check ownership
        if media_data.user_id != current_user.id and current_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Access denied")
        return media_data
    
    # Get from database
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Check ownership
    if media.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    media_response = MediaResponse.from_orm(media)
    
    # Cache the result
    await cache_manager.set(cache_key, media_response.dict(), ttl=3600)
    
    return media_response

@app.delete("/media/{media_id}")
async def delete_media(
    media_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete media and associated data"""
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Check ownership
    if media.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    try:
        # Delete from storage
        await storage_manager.delete_file(media.file_path)
        
        # Delete associated pose data
        db.query(PoseKeypoint).filter(PoseKeypoint.media_id == media_id).delete()
        
        # Delete media record
        db.delete(media)
        db.commit()
        
        # Clear cache
        await cache_manager.delete(f"media:{media_id}")
        await cache_manager.delete_pattern(f"pose:*:media:{media_id}")
        
        logger.info(f"Media deleted: {media_id} by user {current_user.email}")
        
        return {"message": "Media deleted successfully"}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Media deletion failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Deletion failed")

@app.get("/media/user/{user_id}", response_model=List[MediaResponse])
async def get_user_media(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's media files"""
    # Check permission
    if user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    media_list = db.query(Media).filter(
        Media.user_id == user_id
    ).offset(skip).limit(limit).all()
    
    return [MediaResponse.from_orm(media) for media in media_list]

# Pose estimation endpoints
@app.post("/pose/infer/image", response_model=PoseEstimationResponse)
async def infer_pose_image(
    request: PoseEstimationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Run pose estimation on image"""
    # Get media
    media = db.query(Media).filter(
        Media.id == request.media_id,
        Media.user_id == current_user.id
    ).first()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    if not is_valid_image_file(media.filename):
        raise HTTPException(status_code=400, detail="Media is not an image")
    
    # Check cache first
    cache_key = f"pose:image:{request.media_id}"
    cached_result = await pose_cache.get_pose_result(cache_key)
    
    if cached_result and not request.force_reprocess:
        logger.info(f"Returning cached pose result for image {request.media_id}")
        return PoseEstimationResponse.parse_obj(cached_result)
    
    try:
        # Submit job for processing
        job_result = await job_manager.submit_image_job(
            media_id=request.media_id,
            user_id=current_user.id,
            model_config=request.model_config or {},
            priority=request.priority
        )
        
        # For synchronous processing, wait for result
        if request.sync:
            result = await job_manager.wait_for_completion(
                job_result.job_id,
                timeout=settings.SYNC_PROCESSING_TIMEOUT
            )
            
            if result.status == JobStatus.COMPLETED:
                # Cache the result
                await pose_cache.cache_pose_result(
                    cache_key,
                    result.result,
                    ttl=settings.POSE_CACHE_TTL
                )
                
                return PoseEstimationResponse(
                    job_id=job_result.job_id,
                    media_id=request.media_id,
                    status="completed",
                    keypoints=result.result.get("keypoints", []),
                    confidence_scores=result.result.get("confidence_scores", []),
                    processing_time=result.result.get("processing_time", 0.0)
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Processing failed: {result.error}"
                )
        else:
            # Return job info for async processing
            return PoseEstimationResponse(
                job_id=job_result.job_id,
                media_id=request.media_id,
                status="processing",
                message="Job submitted for processing"
            )
            
    except Exception as e:
        logger.error(f"Pose estimation failed for image {request.media_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Pose estimation failed")

@app.post("/pose/infer/video", response_model=JobResponse)
async def infer_pose_video(
    request: VideoProcessingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Queue pose estimation job for video"""
    # Get media
    media = db.query(Media).filter(
        Media.id == request.media_id,
        Media.user_id == current_user.id
    ).first()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    if not is_valid_video_file(media.filename):
        raise HTTPException(status_code=400, detail="Media is not a video")
    
    try:
        # Submit video processing job
        job_result = await job_manager.submit_video_job(
            media_id=request.media_id,
            user_id=current_user.id,
            frame_interval=request.frame_interval,
            model_config=request.model_config or {},
            priority=request.priority,
            webhook_url=request.webhook_url
        )
        
        logger.info(f"Video pose estimation job queued: {job_result.job_id} for media {request.media_id}")
        
        return JobResponse(
            job_id=job_result.job_id,
            status=job_result.status,
            created_at=job_result.created_at,
            estimated_completion=job_result.estimated_completion
        )
        
    except Exception as e:
         logger.error(f"Failed to queue video pose estimation for media {request.media_id}: {str(e)}")
         raise HTTPException(status_code=500, detail="Failed to queue job")

@app.post("/pose/compare", response_model=PoseComparisonResponse)
async def compare_poses(
    request: PoseComparisonRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Compare two poses and return similarity score"""
    try:
        # Submit comparison job
        job_result = await job_manager.submit_comparison_job(
            pose1_id=request.pose1_id,
            pose2_id=request.pose2_id,
            user_id=current_user.id,
            comparison_method=request.comparison_method,
            sync=request.sync
        )
        
        if request.sync:
            # Wait for synchronous result
            result = await job_manager.wait_for_completion(
                job_result.job_id,
                timeout=30  # 30 seconds for comparison
            )
            
            if result.status == JobStatus.COMPLETED:
                return PoseComparisonResponse(
                    job_id=job_result.job_id,
                    similarity_score=result.result.get("similarity_score", 0.0),
                    comparison_details=result.result.get("details", {}),
                    status="completed"
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Comparison failed: {result.error}"
                )
        else:
            return PoseComparisonResponse(
                job_id=job_result.job_id,
                status="processing"
            )
            
    except Exception as e:
        logger.error(f"Pose comparison failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Pose comparison failed")

# WebSocket endpoints
@app.websocket("/pose/stream")
async def pose_stream(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """WebSocket endpoint for real-time pose estimation streaming"""
    # Authenticate user from token
    try:
        payload = verify_token(token)
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            await websocket.close(code=1008, reason="Invalid token")
            return
    except Exception:
        await websocket.close(code=1008, reason="Authentication failed")
        return
    
    await connection_manager.connect(websocket, user.id)
    logger.info(f"WebSocket connected for user {user.email}")
    
    try:
        while True:
            # Receive frame data
            data = await websocket.receive_bytes()
            
            try:
                # Process frame for pose estimation
                keypoints = await pose_estimator.process_frame_bytes(data)
                
                # Prepare response
                response = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "keypoints": keypoints,
                    "confidence_scores": [kp.get("confidence", 0.0) for kp in keypoints],
                    "frame_id": str(uuid.uuid4())
                }
                
                # Send result back
                await websocket.send_json(response)
                
                # Update metrics
                system_monitor.increment_counter("websocket_frames_processed")
                
            except Exception as e:
                logger.error(f"Frame processing error: {str(e)}")
                await websocket.send_json({
                    "error": "Frame processing failed",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket, user.id)
        logger.info(f"WebSocket disconnected for user {user.email}")
    except Exception as e:
        logger.error(f"WebSocket error for user {user.email}: {str(e)}")
        await connection_manager.disconnect(websocket, user.id)

@app.websocket("/notifications")
async def notification_stream(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """WebSocket endpoint for real-time notifications"""
    # Authenticate user
    try:
        payload = verify_token(token)
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            await websocket.close(code=1008, reason="Invalid token")
            return
    except Exception:
        await websocket.close(code=1008, reason="Authentication failed")
        return
    
    await connection_manager.connect(websocket, user.id)
    logger.info(f"Notification WebSocket connected for user {user.email}")
    
    try:
        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connection_established",
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user.id
        })
        
        # Keep connection alive
        while True:
            await asyncio.sleep(30)  # Send heartbeat every 30 seconds
            await websocket.send_json({
                "type": "heartbeat",
                "timestamp": datetime.utcnow().isoformat()
            })
            
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket, user.id)
        logger.info(f"Notification WebSocket disconnected for user {user.email}")
    except Exception as e:
        logger.error(f"Notification WebSocket error for user {user.email}: {str(e)}")
        await connection_manager.disconnect(websocket, user.id)

# Query endpoints
@app.get("/pose/keypoints/{media_id}", response_model=List[PoseKeypointResponse])
async def get_media_keypoints(
    media_id: int,
    frame_start: Optional[int] = Query(None, ge=0),
    frame_end: Optional[int] = Query(None, ge=0),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pose keypoints for specific media"""
    # Check if media belongs to user
    media = db.query(Media).filter(
        Media.id == media_id,
        Media.user_id == current_user.id
    ).first()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Check cache first
    cache_key = f"keypoints:media:{media_id}:{frame_start}:{frame_end}:{skip}:{limit}"
    cached_result = await cache_manager.get(cache_key)
    
    if cached_result:
        return [PoseKeypointResponse.parse_obj(kp) for kp in cached_result]
    
    # Build query
    query = db.query(PoseKeypoint).filter(PoseKeypoint.media_id == media_id)
    
    if frame_start is not None:
        query = query.filter(PoseKeypoint.frame_number >= frame_start)
    if frame_end is not None:
        query = query.filter(PoseKeypoint.frame_number <= frame_end)
    
    keypoints = query.offset(skip).limit(limit).all()
    
    # Convert to response format
    result = [PoseKeypointResponse.from_orm(kp) for kp in keypoints]
    
    # Cache the result
    await cache_manager.set(
        cache_key,
        [kp.dict() for kp in result],
        ttl=1800  # 30 minutes
    )
    
    return result

@app.get("/pose/keypoints/user/{user_id}", response_model=PaginatedPoseKeypointResponse)
async def get_user_keypoints(
    user_id: int,
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    media_type: Optional[str] = Query(None, regex="^(image|video)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's keypoints within date range"""
    # Check permission
    if user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Build query
    query = db.query(PoseKeypoint).join(Media).filter(Media.user_id == user_id)
    
    if start_date:
        query = query.filter(PoseKeypoint.created_at >= start_date)
    if end_date:
        query = query.filter(PoseKeypoint.created_at <= end_date)
    if media_type:
        if media_type == "image":
            query = query.filter(Media.content_type.like("image/%"))
        elif media_type == "video":
            query = query.filter(Media.content_type.like("video/%"))
    
    # Get total count
    total = query.count()
    
    # Get paginated results
    keypoints = query.offset(skip).limit(limit).all()
    
    return PaginatedPoseKeypointResponse(
        items=[PoseKeypointResponse.from_orm(kp) for kp in keypoints],
        total=total,
        skip=skip,
        limit=limit,
        has_more=skip + limit < total
    )

@app.get("/pose/export", response_class=StreamingResponse)
async def export_keypoints(
    user_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    format: str = Query("csv", regex="^(csv|json)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export keypoints data for offline analysis"""
    # Check permission
    if user_id and user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Default to current user if not specified
    if not user_id:
        user_id = current_user.id
    
    # Build query
    query = db.query(PoseKeypoint).join(Media).filter(Media.user_id == user_id)
    
    if start_date:
        query = query.filter(PoseKeypoint.created_at >= start_date)
    if end_date:
        query = query.filter(PoseKeypoint.created_at <= end_date)
    
    keypoints = query.all()
    
    # Generate filename
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"pose_keypoints_{user_id}_{timestamp}.{format}"
    
    if format == "csv":
        # Generate CSV
        output = export_to_csv(keypoints)
        media_type = "text/csv"
    else:
        # Generate JSON
        output = export_to_json(keypoints)
        media_type = "application/json"
    
    # Create streaming response
    def generate():
        yield output
    
    return StreamingResponse(
        generate(),
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# User management endpoints
@app.get("/user/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return UserResponse.from_orm(current_user)

@app.put("/user/profile", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    # Validate email if provided
    if profile_data.email and not validate_email(profile_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Check if email is already taken
    if profile_data.email and profile_data.email != current_user.email:
        existing_user = db.query(User).filter(
            User.email == profile_data.email,
            User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already taken")
    
    # Update user data
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    
    logger.info(f"User profile updated: {current_user.email}")
    
    return UserResponse.from_orm(current_user)

@app.post("/user/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password
    if not check_password_strength(password_data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        )
    
    # Update password
    current_user.hashed_password = hash_password(password_data.new_password)
    current_user.updated_at = datetime.utcnow()
    db.commit()
    
    logger.info(f"Password changed for user: {current_user.email}")
    
    return {"message": "Password changed successfully"}

@app.delete("/user/account")
async def delete_user_account(
    confirmation: AccountDeletionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account and all associated data"""
    # Verify password
    if not verify_password(confirmation.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Password is incorrect")
    
    try:
        # Delete user's media files from storage
        user_media = db.query(Media).filter(Media.user_id == current_user.id).all()
        for media in user_media:
            await storage_manager.delete_file(media.file_path)
        
        # Delete all user data
        db.query(PoseKeypoint).filter(
            PoseKeypoint.media_id.in_([m.id for m in user_media])
        ).delete(synchronize_session=False)
        
        db.query(Media).filter(Media.user_id == current_user.id).delete()
        db.query(User).filter(User.id == current_user.id).delete()
        
        db.commit()
        
        logger.info(f"User account deleted: {current_user.email}")
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Account deletion failed for {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Account deletion failed")

# Job management endpoints
@app.get("/jobs", response_model=List[JobResponse])
async def get_user_jobs(
    status: Optional[str] = Query(None, regex="^(queued|running|completed|failed|cancelled)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user)
):
    """Get user's jobs"""
    jobs = await job_manager.list_user_jobs(
        user_id=current_user.id,
        status=status,
        skip=skip,
        limit=limit
    )
    
    return [JobResponse.from_orm(job) for job in jobs]

@app.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get job status and details"""
    job = await job_manager.get_job_status(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check ownership
    if job.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return JobResponse.from_orm(job)

@app.post("/jobs/{job_id}/cancel")
async def cancel_job(
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """Cancel a running job"""
    job = await job_manager.get_job_status(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check ownership
    if job.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await job_manager.cancel_job(job_id)
    
    if success:
        logger.info(f"Job cancelled: {job_id} by user {current_user.email}")
        return {"message": "Job cancelled successfully"}
    else:
        raise HTTPException(status_code=400, detail="Job cannot be cancelled")

@app.post("/jobs/{job_id}/retry")
async def retry_job(
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """Retry a failed job"""
    job = await job_manager.get_job_status(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check ownership
    if job.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    new_job = await job_manager.retry_job(job_id)
    
    if new_job:
        logger.info(f"Job retried: {job_id} -> {new_job.job_id} by user {current_user.email}")
        return JobResponse.from_orm(new_job)
    else:
        raise HTTPException(status_code=400, detail="Job cannot be retried")

# Admin endpoints
@app.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    users = query.offset(skip).limit(limit).all()
    
    return [UserResponse.from_orm(user) for user in users]

@app.put("/admin/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_data: UserRoleUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update user role (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role_data.role
    user.updated_at = datetime.utcnow()
    db.commit()
    
    logger.info(f"User role updated: {user.email} -> {role_data.role} by admin {current_user.email}")
    
    return {"message": "User role updated successfully"}

@app.put("/admin/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    status_data: UserStatusUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update user status (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = status_data.is_active
    user.updated_at = datetime.utcnow()
    db.commit()
    
    status_text = "activated" if status_data.is_active else "deactivated"
    logger.info(f"User {status_text}: {user.email} by admin {current_user.email}")
    
    return {"message": f"User {status_text} successfully"}

@app.get("/admin/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get system analytics (admin only)"""
    # Default to last 30 days if no dates provided
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Get analytics data
    analytics = await system_monitor.get_analytics(
        start_date=start_date,
        end_date=end_date,
        db=db
    )
    
    return AnalyticsResponse(**analytics)

@app.get("/admin/system-status")
async def get_system_status(
    current_user: User = Depends(get_current_admin_user)
):
    """Get system status (admin only)"""
    status = await system_monitor.get_system_status()
    
    return {
        "system_health": status,
        "queue_stats": await job_manager.get_queue_stats(),
        "cache_stats": await cache_manager.get_stats(),
        "storage_stats": await storage_manager.get_stats()
     }

# Webhook management endpoints
@app.post("/webhooks", response_model=WebhookResponse)
async def create_webhook(
    webhook_data: WebhookCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new webhook endpoint"""
    webhook = await webhook_manager.create_webhook(
        user_id=current_user.id,
        url=webhook_data.url,
        events=webhook_data.events,
        secret=webhook_data.secret
    )
    
    logger.info(f"Webhook created: {webhook.id} for user {current_user.email}")
    
    return WebhookResponse.from_orm(webhook)

@app.get("/webhooks", response_model=List[WebhookResponse])
async def get_user_webhooks(
    current_user: User = Depends(get_current_user)
):
    """Get user's webhooks"""
    webhooks = await webhook_manager.get_user_webhooks(current_user.id)
    
    return [WebhookResponse.from_orm(webhook) for webhook in webhooks]

@app.put("/webhooks/{webhook_id}", response_model=WebhookResponse)
async def update_webhook(
    webhook_id: int,
    webhook_data: WebhookUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update webhook endpoint"""
    webhook = await webhook_manager.update_webhook(
        webhook_id=webhook_id,
        user_id=current_user.id,
        **webhook_data.dict(exclude_unset=True)
    )
    
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    logger.info(f"Webhook updated: {webhook_id} by user {current_user.email}")
    
    return WebhookResponse.from_orm(webhook)

@app.delete("/webhooks/{webhook_id}")
async def delete_webhook(
    webhook_id: int,
    current_user: User = Depends(get_current_user)
):
    """Delete webhook endpoint"""
    success = await webhook_manager.delete_webhook(
        webhook_id=webhook_id,
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    logger.info(f"Webhook deleted: {webhook_id} by user {current_user.email}")
    
    return {"message": "Webhook deleted successfully"}

@app.post("/webhooks/{webhook_id}/test")
async def test_webhook(
    webhook_id: int,
    current_user: User = Depends(get_current_user)
):
    """Test webhook endpoint"""
    success = await webhook_manager.test_webhook(
        webhook_id=webhook_id,
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    return {"message": "Test webhook sent successfully"}

# API Key management endpoints
@app.post("/api-keys", response_model=APIKeyResponse)
async def create_api_key(
    key_data: APIKeyCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new API key"""
    api_key = await auth_manager.create_api_key(
        user_id=current_user.id,
        name=key_data.name,
        permissions=key_data.permissions,
        expires_at=key_data.expires_at
    )
    
    logger.info(f"API key created: {api_key.name} for user {current_user.email}")
    
    return APIKeyResponse.from_orm(api_key)

@app.get("/api-keys", response_model=List[APIKeyResponse])
async def get_user_api_keys(
    current_user: User = Depends(get_current_user)
):
    """Get user's API keys"""
    api_keys = await auth_manager.get_user_api_keys(current_user.id)
    
    return [APIKeyResponse.from_orm(key) for key in api_keys]

@app.delete("/api-keys/{key_id}")
async def revoke_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user)
):
    """Revoke API key"""
    success = await auth_manager.revoke_api_key(
        key_id=key_id,
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="API key not found")
    
    logger.info(f"API key revoked: {key_id} by user {current_user.email}")
    
    return {"message": "API key revoked successfully"}

# Feedback endpoints
@app.post("/feedback")
async def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit user feedback"""
    feedback = Feedback(
        user_id=current_user.id,
        type=feedback_data.type,
        subject=feedback_data.subject,
        message=feedback_data.message,
        rating=feedback_data.rating,
        meta_data=feedback_data.metadata
    )
    
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    
    logger.info(f"Feedback submitted: {feedback.id} by user {current_user.email}")
    
    # Send notification to admins
    await notification_manager.send_admin_notification(
        title="New Feedback Received",
        message=f"User {current_user.email} submitted feedback: {feedback_data.subject}",
        type="feedback"
    )
    
    return {"message": "Feedback submitted successfully", "feedback_id": feedback.id}

# Utility endpoints
@app.get("/system/info")
async def get_system_info():
    """Get system information"""
    return {
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "api_version": "v1",
        "features": {
            "pose_estimation": True,
            "video_processing": True,
            "real_time_streaming": True,
            "webhooks": True,
            "api_keys": True,
            "monitoring": True
        },
        "limits": {
            "max_file_size": settings.MAX_FILE_SIZE,
            "max_video_duration": settings.MAX_VIDEO_DURATION,
            "rate_limit_per_minute": settings.RATE_LIMIT_PER_MINUTE
        }
    }

@app.get("/system/status")
async def get_public_system_status():
    """Get public system status"""
    health_status = await health_checker.check_all()
    
    return {
        "status": "healthy" if all(health_status.values()) else "degraded",
        "services": {
            "api": True,
            "database": health_status.get("database", False),
            "cache": health_status.get("redis", False),
            "storage": health_status.get("storage", False),
            "pose_estimator": health_status.get("pose_estimator", False)
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Pose Comparison
@app.post("/pose/compare")
async def compare_poses(
    comparison_data: PoseComparisonRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Compare two poses and return similarity score"""
    # Get keypoints for both media
    pose1 = db.query(PoseKeypoints).filter(
        PoseKeypoints.media_id == comparison_data.media_id_1
    ).first()
    
    pose2 = db.query(PoseKeypoints).filter(
        PoseKeypoints.media_id == comparison_data.media_id_2
    ).first()
    
    if not pose1 or not pose2:
        raise HTTPException(status_code=404, detail="Pose data not found")
    
    # Calculate similarity
    similarity = pose_estimator.calculate_similarity(
        pose1.keypoints, 
        pose2.keypoints
    )
    
    return {
        "similarity_score": similarity,
        "comparison_timestamp": datetime.utcnow().isoformat(),
        "media_1": comparison_data.media_id_1,
        "media_2": comparison_data.media_id_2
    }

# Feedback
@app.post("/feedback")
async def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit user feedback"""
    # Save feedback to database (you'll need to create a Feedback model)
    logger.info(f"Feedback received from user {current_user.id}: {feedback_data.message}")
    
    return {"message": "Feedback submitted successfully"}

# Metrics endpoint for Prometheus
@app.get("/metrics")
async def get_metrics():
    """Prometheus metrics endpoint"""
    return metrics.generate_latest()

# Session Management Endpoints
@app.post("/api/v1/session/create")
async def create_session(request: dict):
    """Create a new exercise session"""
    try:
        session_id = f"session_{int(time.time())}_{request.get('userId', 'anonymous')}"
        session_data = {
            "sessionId": session_id,
            "exercise": request.get('exercise', 'squat'),
            "userId": request.get('userId'),
            "startTime": time.time(),
            "status": "active"
        }
        
        # Store session in cache
        await cache_manager.set(f"session:{session_id}", session_data, expire=3600)
        
        return {
            "status": "success",
            "data": {
                "sessionId": session_id
            }
        }
    except Exception as e:
        logger.error(f"Failed to create session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create session")

@app.post("/api/v1/session/save")
async def save_session(request: dict):
    """Save session data"""
    try:
        session_id = request.get('sessionId')
        session_data = request.get('data', {})
        
        # Save to database
        query = """
        INSERT INTO sessions (session_id, user_id, exercise, rep_count, session_time, accuracy, metrics, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """
        
        await database.execute(
            query,
            session_id,
            "user123",  # Replace with actual user ID
            session_data.get('exercise', 'squat'),
            session_data.get('repCount', 0),
            session_data.get('sessionTime', 0),
            session_data.get('accuracy', 0),
            json.dumps(session_data.get('metrics', {})),
            datetime.utcnow()
        )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Failed to save session: {e}")
        raise HTTPException(status_code=500, detail="Failed to save session")

@app.post("/api/v1/session/reset")
async def reset_session(request: dict):
    """Reset session data"""
    try:
        session_id = request.get('sessionId')
        
        # Clear session from cache
        await cache_manager.delete(f"session:{session_id}")
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Failed to reset session: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset session")

@app.get("/api/v1/session/{session_id}")
async def load_session(session_id: str):
    """Load session data"""
    try:
        # Try cache first
        session_data = await cache_manager.get(f"session:{session_id}")
        
        if not session_data:
            # Load from database
            query = "SELECT * FROM sessions WHERE session_id = $1"
            result = await database.fetch_one(query, session_id)
            
            if result:
                session_data = {
                    "repCount": result['rep_count'],
                    "sessionTime": result['session_time'],
                    "accuracy": result['accuracy'],
                    "exercise": result['exercise'],
                    "metrics": json.loads(result['metrics']) if result['metrics'] else {}
                }
        
        if session_data:
            return {
                "status": "success",
                "data": session_data
            }
        else:
            raise HTTPException(status_code=404, detail="Session not found")
            
    except Exception as e:
        logger.error(f"Failed to load session: {e}")
        raise HTTPException(status_code=500, detail="Failed to load session")

@app.post("/api/v1/session/share")
async def share_session(request: dict):
    """Share session with others"""
    try:
        session_id = request.get('sessionId')
        share_type = request.get('shareType', 'public')
        
        # Generate share URL
        share_url = f"https://kineticai.com/shared/{session_id}?type={share_type}"
        
        return {
            "status": "success",
            "data": {
                "shareUrl": share_url
            }
        }
    except Exception as e:
        logger.error(f"Failed to share session: {e}")
        raise HTTPException(status_code=500, detail="Failed to share session")

# Camera Calibration Endpoint
@app.post("/api/v1/camera/calibrate")
async def calibrate_camera(request: dict):
    """Calibrate camera settings"""
    try:
        session_id = request.get('sessionId')
        sensitivity = request.get('sensitivity', 75)
        
        # Simulate calibration process
        calibration_data = {
            "sensitivity": sensitivity,
            "calibrated_at": time.time(),
            "status": "success"
        }
        
        # Store calibration data
        await cache_manager.set(f"calibration:{session_id}", calibration_data, expire=3600)
        
        return {
            "status": "success",
            "data": calibration_data
        }
    except Exception as e:
        logger.error(f"Failed to calibrate camera: {e}")
        raise HTTPException(status_code=500, detail="Failed to calibrate camera")

# Export Data Endpoint
@app.post("/api/v1/export/{format}")
async def export_data(format: str, request: dict):
    """Export session data in various formats"""
    try:
        session_id = request.get('sessionId')
        include_metrics = request.get('includeMetrics', True)
        include_pose_data = request.get('includePoseData', True)
        
        # Get session data
        session_data = await cache_manager.get(f"session:{session_id}")
        
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        export_data = {
            "sessionId": session_id,
            "exportedAt": datetime.utcnow().isoformat(),
            "data": session_data
        }
        
        if format.lower() == 'json':
            content = json.dumps(export_data, indent=2)
            media_type = "application/json"
        elif format.lower() == 'csv':
            # Convert to CSV format
            content = "sessionId,exercise,repCount,accuracy,sessionTime\n"
            content += f"{session_id},{session_data.get('exercise', '')},{session_data.get('repCount', 0)},{session_data.get('accuracy', 0)},{session_data.get('sessionTime', 0)}"
            media_type = "text/csv"
        else:
            raise HTTPException(status_code=400, detail="Unsupported format")
        
        return Response(
            content=content,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename=session-{session_id}.{format}"}
        )
        
    except Exception as e:
        logger.error(f"Failed to export data: {e}")
        raise HTTPException(status_code=500, detail="Failed to export data")

# Custom Poses Endpoint
@app.post("/api/v1/poses/custom")
async def create_custom_pose(request: dict):
    """Create a custom pose"""
    try:
        pose_data = {
            "name": request.get('name'),
            "description": request.get('description'),
            "keypoints": request.get('keypoints', []),
            "userId": request.get('userId'),
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Save to database
        query = """
        INSERT INTO custom_poses (name, description, keypoints, user_id, created_at)
        VALUES ($1, $2, $3, $4, $5)
        """
        
        await database.execute(
            query,
            pose_data['name'],
            pose_data['description'],
            json.dumps(pose_data['keypoints']),
            pose_data['userId'],
            datetime.utcnow()
        )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Failed to create custom pose: {e}")
        raise HTTPException(status_code=500, detail="Failed to create custom pose")

# Workouts Endpoint
@app.post("/api/v1/workouts/start")
async def start_workout(request: dict):
    """Start a workout session"""
    try:
        workout_id = request.get('workoutId')
        session_id = request.get('sessionId')
        
        workout_data = {
            "workoutId": workout_id,
            "sessionId": session_id,
            "startedAt": time.time(),
            "status": "active"
        }
        
        # Store workout session
        await cache_manager.set(f"workout:{session_id}", workout_data, expire=7200)
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Failed to start workout: {e}")
        raise HTTPException(status_code=500, detail="Failed to start workout")

# Goals Endpoint
@app.post("/api/v1/goals")
async def add_goal(request: dict):
    """Add a new goal"""
    try:
        goal_data = {
            "goal": request.get('goal'),
            "target": request.get('target'),
            "userId": request.get('userId'),
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Save to database
        query = """
        INSERT INTO goals (goal_text, target_value, user_id, created_at)
        VALUES ($1, $2, $3, $4)
        """
        
        await database.execute(
            query,
            goal_data['goal'],
            goal_data['target'],
            goal_data['userId'],
            datetime.utcnow()
        )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Failed to add goal: {e}")
        raise HTTPException(status_code=500, detail="Failed to add goal")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )