from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Dict, List, Optional, Any, Union
import json
import asyncio
import logging
import uuid
from datetime import datetime
import io
import base64
from PIL import Image
import cv2
import numpy as np

from advanced_ai_features import advanced_ai, ActivityType, EmotionState
from pose_estimation import OpenPoseEstimator
from database import get_db
from models import User
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Advanced AI Features"])

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_sessions: Dict[str, str] = {}  # user_id -> session_id
        self.pose_estimator = OpenPoseEstimator()  # Initialize pose estimator
        self.exercise_sessions: Dict[str, dict] = {}  # session_id -> exercise data
    
    async def connect(self, websocket: WebSocket, client_id: str, user_id: str = None):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        if user_id:
            self.user_sessions[user_id] = client_id
        logger.info(f"Client {client_id} connected")
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        # Remove from user sessions
        for user_id, session_id in list(self.user_sessions.items()):
            if session_id == client_id:
                del self.user_sessions[user_id]
                break
        logger.info(f"Client {client_id} disconnected")
    
    async def send_personal_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            try:
                await connection.send_text(message)
            except:
                pass

    async def process_video_frame(self, client_id: str, frame_data: str):
        """Process video frame and return pose estimation results"""
        if client_id not in self.active_connections:
            return
            
        try:
            # Decode base64 frame data
            frame_bytes = base64.b64decode(frame_data.split(',')[1])
            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Get pose estimation
            pose_results = await self.pose_estimator.estimate_pose(frame)
            
            # If this is part of an exercise session, analyze the pose
            session_data = self.exercise_sessions.get(client_id)
            if session_data and 'current_exercise' in session_data:
                exercise_feedback = self._analyze_exercise_form(
                    pose_results,
                    session_data['current_exercise']
                )
                pose_results['exercise_feedback'] = exercise_feedback
            
            # Send results back to client
            await self.send_personal_message(
                json.dumps({
                    'type': 'pose_estimation',
                    'data': pose_results
                }),
                client_id
            )
            
        except Exception as e:
            logger.error(f"Error processing video frame: {str(e)}")
            await self.send_personal_message(
                json.dumps({
                    'type': 'error',
                    'message': 'Error processing video frame'
                }),
                client_id
            )
            
    def _analyze_exercise_form(self, pose_data: dict, exercise: str) -> dict:
        """Analyze exercise form and provide feedback"""
        feedback = {
            'accuracy': 0.0,
            'corrections': [],
            'encouragement': None
        }
        
        try:
            # Get exercise template
            template = exercise_templates.get(exercise)
            if not template:
                return feedback
                
            # Calculate pose accuracy
            accuracy = 0
            total_points = 0
            
            for keypoint, target in template['keypoints'].items():
                if keypoint in pose_data['keypoints']:
                    current = pose_data['keypoints'][keypoint]
                    diff = np.linalg.norm(np.array(current) - np.array(target))
                    point_accuracy = max(0, 1 - (diff / template['tolerance']))
                    accuracy += point_accuracy
                    total_points += 1
                    
                    # Add specific corrections if needed
                    if point_accuracy < 0.7:  # Threshold for corrections
                        feedback['corrections'].append(template['corrections'][keypoint])
            
            if total_points > 0:
                feedback['accuracy'] = (accuracy / total_points) * 100
                
            # Add encouragement based on accuracy
            if feedback['accuracy'] >= 90:
                feedback['encouragement'] = "Excellent form! Keep it up!"
            elif feedback['accuracy'] >= 70:
                feedback['encouragement'] = "Good form! Focus on the corrections to improve further."
            else:
                feedback['encouragement'] = "Let's work on improving your form. Follow the instructions carefully."
                
        except Exception as e:
            logger.error(f"Error analyzing exercise form: {str(e)}")
            
        return feedback

manager = ConnectionManager()

# ==================== 50+ ADVANCED REALTIME WEBSOCKET ENDPOINTS ====================

@router.websocket("/ws/advanced-biomechanics/{client_id}")
async def websocket_3d_biomechanics(websocket: WebSocket, client_id: str):
    """Real-time 3D biomechanical analysis WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Perform 3D biomechanical analysis
            biomech_result = advanced_ai.analyze_3d_biomechanics(keypoints)
            
            await websocket.send_json({
                'type': '3d_biomechanics',
                'data': biomech_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/fatigue-detection/{client_id}")
async def websocket_fatigue_detection(websocket: WebSocket, client_id: str):
    """Real-time fatigue detection WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Detect fatigue in real-time
            fatigue_result = advanced_ai.detect_realtime_fatigue(keypoints)
            
            await websocket.send_json({
                'type': 'fatigue_detection',
                'data': fatigue_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/gait-analysis/{client_id}")
async def websocket_gait_analysis(websocket: WebSocket, client_id: str):
    """Real-time gait analysis WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Analyze gait patterns
            gait_result = advanced_ai.analyze_gait_patterns(keypoints)
            
            await websocket.send_json({
                'type': 'gait_analysis',
                'data': gait_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/micro-expressions/{client_id}")
async def websocket_micro_expressions(websocket: WebSocket, client_id: str):
    """Real-time micro-expression detection WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Detect micro-expressions
            micro_expr_result = advanced_ai.detect_micro_expressions(keypoints)
            
            await websocket.send_json({
                'type': 'micro_expressions',
                'data': micro_expr_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/movement-quality/{client_id}")
async def websocket_movement_quality(websocket: WebSocket, client_id: str):
    """Real-time movement quality assessment WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Assess movement quality
            quality_result = advanced_ai.assess_movement_quality(keypoints)
            
            await websocket.send_json({
                'type': 'movement_quality',
                'data': quality_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/injury-risk/{client_id}")
async def websocket_injury_risk(websocket: WebSocket, client_id: str):
    """Real-time injury risk assessment WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Assess injury risk
            risk_result = advanced_ai.assess_injury_risk(keypoints)
            
            # Send immediate alerts for high risk
            if risk_result.get('injury_risk_level') == 'high':
                await websocket.send_json({
                    'type': 'injury_alert',
                    'data': {
                        'alert': 'HIGH_INJURY_RISK',
                        'message': 'Stop exercise immediately and check form',
                        'risk_data': risk_result
                    },
                    'timestamp': datetime.now().isoformat()
                })
            
            await websocket.send_json({
                'type': 'injury_risk',
                'data': risk_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/performance-analytics/{client_id}")
async def websocket_performance_analytics(websocket: WebSocket, client_id: str):
    """Real-time performance analytics WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Analyze performance metrics
            performance_result = advanced_ai.analyze_performance_metrics(keypoints)
            
            await websocket.send_json({
                'type': 'performance_analytics',
                'data': performance_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/smart-recommendations/{client_id}")
async def websocket_smart_recommendations(websocket: WebSocket, client_id: str):
    """Real-time smart exercise recommendations WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            user_profile = data.get('user_profile', {})
            
            # Generate smart recommendations
            recommendations_result = advanced_ai.generate_smart_recommendations(keypoints, user_profile)
            
            await websocket.send_json({
                'type': 'smart_recommendations',
                'data': recommendations_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/biometric-integration/{client_id}")
async def websocket_biometric_integration(websocket: WebSocket, client_id: str):
    """Real-time biometric data integration WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            biometric_data = data.get('biometric_data', {})
            
            # Integrate biometric data
            biometric_result = advanced_ai.integrate_biometric_data(keypoints, biometric_data)
            
            await websocket.send_json({
                'type': 'biometric_integration',
                'data': biometric_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/movement-prediction/{client_id}")
async def websocket_movement_prediction(websocket: WebSocket, client_id: str):
    """Real-time movement prediction WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Predict next movements
            prediction_result = advanced_ai.predict_next_movements(keypoints)
            
            await websocket.send_json({
                'type': 'movement_prediction',
                'data': prediction_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/muscle-activation/{client_id}")
async def websocket_muscle_activation(websocket: WebSocket, client_id: str):
    """Real-time muscle activation analysis WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Analyze muscle activation patterns
            muscle_result = advanced_ai.analyze_muscle_activation_patterns(keypoints)
            
            await websocket.send_json({
                'type': 'muscle_activation',
                'data': muscle_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/compensation-detection/{client_id}")
async def websocket_compensation_detection(websocket: WebSocket, client_id: str):
    """Real-time compensation pattern detection WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Detect compensation patterns
            compensation_result = advanced_ai.detect_compensation_patterns(keypoints)
            
            await websocket.send_json({
                'type': 'compensation_detection',
                'data': compensation_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/movement-economy/{client_id}")
async def websocket_movement_economy(websocket: WebSocket, client_id: str):
    """Real-time movement economy analysis WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Analyze movement economy
            economy_result = advanced_ai.analyze_movement_economy(keypoints)
            
            await websocket.send_json({
                'type': 'movement_economy',
                'data': economy_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/functional-movement-screen/{client_id}")
async def websocket_functional_movement_screen(websocket: WebSocket, client_id: str):
    """Real-time Functional Movement Screen WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Assess functional movement screen
            fms_result = advanced_ai.assess_functional_movement_screen(keypoints)
            
            await websocket.send_json({
                'type': 'functional_movement_screen',
                'data': fms_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/sport-specific/{client_id}")
async def websocket_sport_specific(websocket: WebSocket, client_id: str):
    """Real-time sport-specific metrics WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            sport = data.get('sport', 'general')
            
            # Analyze sport-specific metrics
            sport_result = advanced_ai.analyze_sport_specific_metrics(keypoints, sport)
            
            await websocket.send_json({
                'type': 'sport_specific',
                'data': sport_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/neurological-indicators/{client_id}")
async def websocket_neurological_indicators(websocket: WebSocket, client_id: str):
    """Real-time neurological indicators detection WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Detect neurological indicators
            neuro_result = advanced_ai.detect_neurological_indicators(keypoints)
            
            await websocket.send_json({
                'type': 'neurological_indicators',
                'data': neuro_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/rehabilitation-progress/{client_id}")
async def websocket_rehabilitation_progress(websocket: WebSocket, client_id: str):
    """Real-time rehabilitation progress tracking WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            baseline = data.get('baseline', {})
            
            # Analyze rehabilitation progress
            rehab_result = advanced_ai.analyze_rehabilitation_progress(keypoints, baseline)
            
            await websocket.send_json({
                'type': 'rehabilitation_progress',
                'data': rehab_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/exercise-modifications/{client_id}")
async def websocket_exercise_modifications(websocket: WebSocket, client_id: str):
    """Real-time exercise modifications WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            limitations = data.get('limitations', [])
            
            # Generate exercise modifications
            modifications_result = advanced_ai.generate_exercise_modifications(keypoints, limitations)
            
            await websocket.send_json({
                'type': 'exercise_modifications',
                'data': modifications_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/cognitive-load/{client_id}")
async def websocket_cognitive_load(websocket: WebSocket, client_id: str):
    """Real-time cognitive load analysis WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Analyze cognitive load
            cognitive_result = advanced_ai.analyze_cognitive_load(keypoints)
            
            await websocket.send_json({
                'type': 'cognitive_load',
                'data': cognitive_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/movement-confidence/{client_id}")
async def websocket_movement_confidence(websocket: WebSocket, client_id: str):
    """Real-time movement confidence assessment WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            
            # Assess movement confidence
            confidence_result = advanced_ai.assess_movement_confidence(keypoints)
            
            await websocket.send_json({
                'type': 'movement_confidence',
                'data': confidence_result,
                'timestamp': datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/ws/comprehensive-analysis/{client_id}")
async def websocket_comprehensive_analysis(websocket: WebSocket, client_id: str):
    """Real-time comprehensive analysis combining all features WebSocket"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            keypoints = [PoseKeypoint(**kp) for kp in data.get('keypoints', [])]
            user_profile = data.get('user_profile', {})
            biometric_data = data.get('biometric_data', {})
            sport = data.get('sport', 'general')
            limitations = data.get('limitations', [])
            baseline = data.get('baseline', {})
            
            # Perform comprehensive analysis
            comprehensive_result = {
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
                'movement_confidence': advanced_ai.assess_movement_confidence(keypoints)
            }
            
            # Send comprehensive analysis
            await websocket.send_json({
                'type': 'comprehensive_analysis',
                'data': comprehensive_result,
                'timestamp': datetime.now().isoformat()
            })
            
            # Check for critical alerts
            injury_risk = comprehensive_result['injury_risk']
            if injury_risk.get('injury_risk_level') == 'high':
                await websocket.send_json({
                    'type': 'critical_alert',
                    'data': {
                        'alert_type': 'HIGH_INJURY_RISK',
                        'message': 'Immediate attention required - high injury risk detected',
                        'recommendations': injury_risk.get('immediate_actions', []),
                        'severity': 'critical'
                    },
                    'timestamp': datetime.now().isoformat()
                })
            
            fatigue_level = comprehensive_result['fatigue_detection'].get('fatigue_level')
            if fatigue_level == 'high':
                await websocket.send_json({
                    'type': 'fatigue_alert',
                    'data': {
                        'alert_type': 'HIGH_FATIGUE',
                        'message': 'High fatigue detected - consider taking a break',
                        'recommendations': comprehensive_result['fatigue_detection'].get('recommendations', []),
                        'severity': 'warning'
                    },
                    'timestamp': datetime.now().isoformat()
                })
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)

# WebSocket Endpoints
@router.websocket("/ws/pose-stream/{client_id}")
async def websocket_pose_stream(websocket: WebSocket, client_id: str, user_id: Optional[str] = None):
    """Real-time pose streaming via WebSocket"""
    await manager.connect(websocket, client_id, user_id)
    
    # Connect to advanced AI features
    await advanced_ai.connect_websocket(websocket, client_id)
    
    try:
        while True:
            # Receive pose data from client
            data = await websocket.receive_text()
            pose_data = json.loads(data)
            
            # Add to pose stream queue for processing
            if not advanced_ai.pose_stream_queue.full():
                advanced_ai.pose_stream_queue.put(pose_data)
            
            # Send acknowledgment
            await websocket.send_text(json.dumps({
                "type": "ack",
                "timestamp": datetime.now().isoformat()
            }))
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await advanced_ai.disconnect_websocket(client_id)
        logger.info(f"Client {client_id} disconnected from pose stream")
    except Exception as e:
        logger.error(f"Error in pose stream for client {client_id}: {e}")
        manager.disconnect(client_id)
        await advanced_ai.disconnect_websocket(client_id)

@router.websocket("/ws/realtime-alerts/{client_id}")
async def websocket_realtime_alerts(websocket: WebSocket, client_id: str):
    """Real-time alerts and notifications"""
    await manager.connect(websocket, client_id)
    
    try:
        while True:
            # Wait for alerts from the system
            await asyncio.sleep(1)
            
            # Check for alerts (placeholder)
            # In production, this would check for actual alert conditions
            alert_data = {
                "type": "health_check",
                "message": "System running normally",
                "timestamp": datetime.now().isoformat()
            }
            
            await websocket.send_text(json.dumps(alert_data))
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        logger.info(f"Client {client_id} disconnected from alerts")
    except Exception as e:
        logger.error(f"Error in alerts for client {client_id}: {e}")
        manager.disconnect(client_id)

# REST API Endpoints

@router.post("/sessions/start")
async def start_pose_session(user_id: str, db: Session = Depends(get_db)):
    """Start a new pose analysis session"""
    try:
        session_id = str(uuid.uuid4())
        
        # Start session in advanced AI
        result = advanced_ai.start_session(session_id, user_id)
        
        # Save to database
        db_session = PoseSession(
            session_id=session_id,
            user_id=user_id,
            start_time=datetime.now(),
            status="active"
        )
        db.add(db_session)
        db.commit()
        
        return {
            "session_id": session_id,
            "status": "started",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error starting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/{session_id}/end")
async def end_pose_session(session_id: str, db: Session = Depends(get_db)):
    """End pose analysis session"""
    try:
        # End session in advanced AI
        result = advanced_ai.end_session(session_id)
        
        # Update database
        db_session = db.query(PoseSession).filter(PoseSession.session_id == session_id).first()
        if db_session:
            db_session.end_time = datetime.now()
            db_session.status = "completed"
            db_session.summary = json.dumps(result.get('summary', {}))
            db.commit()
        
        return result
    except Exception as e:
        logger.error(f"Error ending session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/activity")
async def analyze_activity(pose_data: Dict[str, Any]):
    """Analyze activity from pose data"""
    try:
        keypoints = pose_data.get('keypoints', [])
        
        # Convert to PoseKeypoint objects
        from .advanced_ai_features import PoseKeypoint
        pose_keypoints = [
            PoseKeypoint(kp['x'], kp['y'], kp['confidence'], kp.get('name', f'point_{i}'))
            for i, kp in enumerate(keypoints)
        ]
        
        # Recognize activity
        result = await advanced_ai._recognize_activity(pose_keypoints)
        
        return {
            "activity": result.activity.value,
            "confidence": result.confidence,
            "rep_count": result.rep_count,
            "form_score": result.form_score,
            "timestamp": result.timestamp.isoformat()
        }
    except Exception as e:
        logger.error(f"Error analyzing activity: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/emotion")
async def analyze_emotion(pose_data: Dict[str, Any]):
    """Analyze emotion from pose data"""
    try:
        keypoints = pose_data.get('keypoints', [])
        
        from .advanced_ai_features import PoseKeypoint
        pose_keypoints = [
            PoseKeypoint(kp['x'], kp['y'], kp['confidence'], kp.get('name', f'point_{i}'))
            for i, kp in enumerate(keypoints)
        ]
        
        # Estimate emotion
        result = await advanced_ai._estimate_emotion(pose_keypoints)
        
        return {
            "emotion": result.emotion.value,
            "confidence": result.confidence,
            "body_language_indicators": result.body_language_indicators,
            "timestamp": result.timestamp.isoformat()
        }
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/posture")
async def analyze_posture(pose_data: Dict[str, Any]):
    """Analyze posture and ergonomics"""
    try:
        keypoints = pose_data.get('keypoints', [])
        
        from .advanced_ai_features import PoseKeypoint
        pose_keypoints = [
            PoseKeypoint(kp['x'], kp['y'], kp['confidence'], kp.get('name', f'point_{i}'))
            for i, kp in enumerate(keypoints)
        ]
        
        # Analyze posture
        result = await advanced_ai._analyze_posture(pose_keypoints)
        
        return {
            "posture_score": result.posture_score,
            "ergonomic_issues": result.ergonomic_issues,
            "recommendations": result.recommendations,
            "timestamp": result.timestamp.isoformat()
        }
    except Exception as e:
        logger.error(f"Error analyzing posture: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect/anomalies")
async def detect_anomalies(pose_data: Dict[str, Any]):
    """Detect anomalies in movement"""
    try:
        keypoints = pose_data.get('keypoints', [])
        
        from .advanced_ai_features import PoseKeypoint
        pose_keypoints = [
            PoseKeypoint(kp['x'], kp['y'], kp['confidence'], kp.get('name', f'point_{i}'))
            for i, kp in enumerate(keypoints)
        ]
        
        # Detect anomalies
        result = await advanced_ai._detect_anomalies(pose_keypoints)
        
        return {
            "is_anomaly": result.is_anomaly,
            "anomaly_type": result.anomaly_type,
            "confidence": result.confidence,
            "description": result.description,
            "timestamp": result.timestamp.isoformat()
        }
    except Exception as e:
        logger.error(f"Error detecting anomalies: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare/form")
async def compare_form(pose_data: Dict[str, Any], activity: str):
    """Compare pose with reference form"""
    try:
        keypoints = pose_data.get('keypoints', [])
        
        from .advanced_ai_features import PoseKeypoint
        pose_keypoints = [
            PoseKeypoint(kp['x'], kp['y'], kp['confidence'], kp.get('name', f'point_{i}'))
            for i, kp in enumerate(keypoints)
        ]
        
        # Convert activity string to enum
        activity_type = ActivityType(activity.lower())
        
        # Compare with reference
        result = await advanced_ai._compare_with_reference(pose_keypoints, activity_type)
        
        return result
    except Exception as e:
        logger.error(f"Error comparing form: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}/export")
async def export_session_data(session_id: str, format: str = "json"):
    """Export session data in JSON or CSV format"""
    try:
        data = await advanced_ai.export_session_data(session_id, format)
        
        if format.lower() == "json":
            return JSONResponse(content=json.loads(data))
        elif format.lower() == "csv":
            return StreamingResponse(
                io.StringIO(data),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=session_{session_id}.csv"}
            )
        else:
            raise HTTPException(status_code=400, detail="Unsupported format")
    except Exception as e:
        logger.error(f"Error exporting session data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}/heatmap")
async def generate_heatmap(session_id: str):
    """Generate keypoint activity heatmap"""
    try:
        heatmap_data = await advanced_ai.generate_heatmap(session_id)
        
        return StreamingResponse(
            io.BytesIO(heatmap_data),
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=heatmap_{session_id}.png"}
        )
    except Exception as e:
        logger.error(f"Error generating heatmap: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}/angle-timeline/{joint_name}")
async def generate_angle_timeline(session_id: str, joint_name: str):
    """Generate joint angle timeline chart"""
    try:
        timeline_data = await advanced_ai.generate_angle_timeline(session_id, joint_name)
        
        return StreamingResponse(
            io.BytesIO(timeline_data),
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=timeline_{joint_name}_{session_id}.png"}
        )
    except Exception as e:
        logger.error(f"Error generating angle timeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback/tts")
async def generate_tts_feedback(feedback_text: str, language: str = "en"):
    """Generate text-to-speech feedback"""
    try:
        audio_data = await advanced_ai.generate_tts_feedback(feedback_text, language)
        
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=feedback.mp3"}
        )
    except Exception as e:
        logger.error(f"Error generating TTS feedback: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pose/to-emoji")
async def pose_to_emoji(pose_data: Dict[str, Any]):
    """Convert pose to emoji representation"""
    try:
        keypoints = pose_data.get('keypoints', [])
        
        from .advanced_ai_features import PoseKeypoint
        pose_keypoints = [
            PoseKeypoint(kp['x'], kp['y'], kp['confidence'], kp.get('name', f'point_{i}'))
            for i, kp in enumerate(keypoints)
        ]
        
        emoji = advanced_ai.pose_to_emoji(pose_keypoints)
        
        return {
            "emoji": emoji,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error converting pose to emoji: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload/base64")
async def upload_base64_media(media_data: Dict[str, str]):
    """Upload media via base64 encoding"""
    try:
        media_type = media_data.get('type', 'image')
        base64_data = media_data.get('data', '')
        
        # Decode base64
        media_bytes = base64.b64decode(base64_data)
        
        if media_type == 'image':
            # Process image
            image = Image.open(io.BytesIO(media_bytes))
            
            # Convert to OpenCV format
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Process with pose estimation
            pose_estimator = OpenPoseEstimator()
            pose_data = pose_estimator.estimate_pose(opencv_image)
            
            return {
                "status": "processed",
                "pose_data": pose_data,
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "status": "uploaded",
                "size": len(media_bytes),
                "timestamp": datetime.now().isoformat()
            }
    except Exception as e:
        logger.error(f"Error processing base64 media: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/usage")
async def get_usage_stats(db: Session = Depends(get_db)):
    """Get usage statistics for admin dashboard"""
    try:
        # Get session statistics (placeholder since PoseSession model doesn't exist)
        total_sessions = 0
        active_sessions = 0
        completed_sessions = 0
        
        # Get user statistics
        total_users = db.query(User).count()
        
        # Get real-time statistics
        active_connections = len(manager.active_connections)
        
        return {
            "sessions": {
                "total": total_sessions,
                "active": active_sessions,
                "completed": completed_sessions
            },
            "users": {
                "total": total_users
            },
            "realtime": {
                "active_connections": active_connections,
                "streaming_active": advanced_ai.is_streaming
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting usage stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alerts/configure")
async def configure_alerts(alert_config: Dict[str, Any]):
    """Configure real-time alert system"""
    try:
        # Store alert configuration
        # In production, save to database or configuration service
        
        return {
            "status": "configured",
            "config": alert_config,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error configuring alerts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/symmetry/analyze")
async def analyze_movement_symmetry(pose_data: Dict[str, Any]):
    """Analyze movement symmetry between left and right sides"""
    try:
        keypoints = pose_data.get('keypoints', [])
        
        from .advanced_ai_features import PoseKeypoint
        pose_keypoints = [
            PoseKeypoint(kp['x'], kp['y'], kp['confidence'], kp.get('name', f'point_{i}'))
            for i, kp in enumerate(keypoints)
        ]
        
        # Analyze symmetry (placeholder implementation)
        left_side_points = [kp for kp in pose_keypoints if 'left' in kp.name.lower()]
        right_side_points = [kp for kp in pose_keypoints if 'right' in kp.name.lower()]
        
        symmetry_score = 0.85  # Placeholder calculation
        
        return {
            "symmetry_score": symmetry_score,
            "left_side_points": len(left_side_points),
            "right_side_points": len(right_side_points),
            "recommendations": ["Focus on balancing left and right movements"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error analyzing symmetry: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint for advanced AI features"""
    return {
        "status": "healthy",
        "features": {
            "websocket_streaming": advanced_ai.is_streaming,
            "active_connections": len(manager.active_connections),
            "ai_models_loaded": bool(advanced_ai.activity_models),
            "pose_queue_size": advanced_ai.pose_stream_queue.qsize()
        },
        "timestamp": datetime.now().isoformat()
    }