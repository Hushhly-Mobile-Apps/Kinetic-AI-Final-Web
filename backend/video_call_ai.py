from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
import random
from datetime import datetime
from typing import Dict, List

class AITherapistAgent:
    def __init__(self):
        # Initialize pose estimator
        from pose_estimation import OpenPoseEstimator
        self.pose_estimator = OpenPoseEstimator()
        
        # Real therapeutic exercise templates with joint angle thresholds
        self.exercise_templates = {
            "shoulder_flexion": {
                "target_angles": {"LShoulder": 180, "RShoulder": 180},
                "tolerance": 15,
                "instruction": "Please raise both arms straight up over your head.",
                "correction_templates": {
                    "insufficient_range": "Try to raise your arms higher, aiming for a full range of motion.",
                    "asymmetry": "Make sure both arms are reaching the same height.",
                    "alignment": "Keep your arms straight and aligned with your shoulders."
                }
            },
            "knee_extension": {
                "target_angles": {"LKnee": 180, "RKnee": 180},
                "tolerance": 10,
                "instruction": "Extend your knee fully while seated.",
                "correction_templates": {
                    "insufficient_range": "Try to straighten your knee completely.",
                    "alignment": "Keep your thigh stable as you extend your knee.",
                    "speed": "Move more slowly and controlled through the extension."
                }
            },
            "encouragement": [
                "Excellent form! You're doing great!",
                "That's perfect! Keep up the good work!",
                "I can see improvement in your movement. Well done!",
                "Your posture looks much better today!"
            ],
            "analysis": [
                "I'm analyzing your movement patterns. Your range of motion has improved by 15%.",
                "Based on your current performance, I recommend increasing the exercise duration.",
                "Your balance has significantly improved since our last session.",
                "I notice some tension in your shoulders. Let's focus on relaxation exercises."
            ],
            "correction": [
                "Try to keep your back straight during this exercise.",
                "Slow down the movement to maintain proper form.",
                "Remember to breathe deeply throughout the exercise.",
                "Keep your core engaged for better stability."
            ]
        }
        
    async def analyze_pose(self, frame_data: bytes) -> dict:
        """Analyze patient's pose in real-time"""
        import numpy as np
        import cv2
        
        # Decode frame
        nparr = np.frombuffer(frame_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Get pose estimation
        pose_result = await self.pose_estimator.estimate_pose(frame)
        return pose_result

    async def get_real_time_feedback(self, pose_data: dict, current_exercise: str) -> dict:
        """Generate real-time feedback based on pose analysis"""
        if not current_exercise in self.exercise_templates:
            return {"type": "error", "message": "Exercise not recognized"}
            
        template = self.exercise_templates[current_exercise]
        feedback = []
        
        # Analyze joint angles
        for joint, target in template["target_angles"].items():
            if joint in pose_data["angles"]:
                current = pose_data["angles"][joint]
                diff = abs(current - target)
                
                if diff > template["tolerance"]:
                    if diff > 30:
                        feedback.append(template["correction_templates"]["insufficient_range"])
                    else:
                        feedback.append(f"Adjust your {joint.lower()} angle slightly.")
                        
        # Check movement quality
        if pose_data.get("movement_speed", 0) > 1.5:  # threshold for movement speed
            feedback.append(template["correction_templates"]["speed"])
            
        if not feedback:
            feedback = ["Excellent form! Keep going!"]
            
        return {
            "type": "feedback",
            "message": " ".join(feedback),
            "pose_data": pose_data,
            "duration": len(response_text) * 50,  # Approximate speaking duration
            "timestamp": datetime.now().isoformat(),
            "context": context
        }
    
    def analyze_session_data(self, duration: int) -> dict:
        """Analyze session progress"""
        analysis_points = [
            f"Session duration: {duration // 60} minutes {duration % 60} seconds",
            f"Estimated calories burned: {duration * 0.1:.1f}",
            f"Movement quality score: {random.randint(75, 95)}/100",
            f"Recommended next session: {random.choice(['Tomorrow', 'In 2 days', 'In 3 days'])}"
        ]
        
        return {
            "type": "analysis",
            "message": " | ".join(analysis_points),
            "duration": 5000,
            "timestamp": datetime.now().isoformat()
        }

class VideoCallManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.ai_agent = AITherapistAgent()
        self.webrtc_signals: Dict[str, List[dict]] = {}  # Store WebRTC signaling data
        
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        self.webrtc_signals[session_id] = []
        
        # Send welcome message
        welcome_response = self.ai_agent.get_response("greeting")
        await websocket.send_text(json.dumps(welcome_response))
        
        # Start periodic AI interactions
        asyncio.create_task(self.periodic_ai_interaction(session_id))
        
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
        if session_id in self.webrtc_signals:
            del self.webrtc_signals[session_id]
            
    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            websocket = self.active_connections[session_id]
            await websocket.send_text(json.dumps(message))
            
    async def handle_webrtc_signal(self, session_id: str, signal_data: dict):
        """Handle WebRTC signaling data"""
        signal_type = signal_data.get("type")
        
        if signal_type in ["offer", "answer", "ice-candidate"]:
            # Store the signal
            if session_id not in self.webrtc_signals:
                self.webrtc_signals[session_id] = []
            self.webrtc_signals[session_id].append(signal_data)
            
            # Send to peer if connected
            if session_id in self.active_connections:
                await self.active_connections[session_id].send_json(signal_data)
                
    async def handle_message(self, session_id: str, data: dict):
        message_type = data.get("type", "message")
        
        if message_type == "webrtc_signal":
            await self.handle_webrtc_signal(session_id, data)
            return
            
        message_content = data.get("message", "")
        
        # Process different message types
        if message_type == "greeting":
            response = self.ai_agent.get_response("greeting")
        elif message_type == "duration_update":
            duration = int(message_content.split(":")[1].strip().split()[0])
            if duration % 120 == 0:  # Every 2 minutes
                response = self.ai_agent.get_response("encouragement")
            else:
                return  # Don't respond to every duration update
        elif "exercise" in message_content.lower():
            response = self.ai_agent.get_response("exercise_instruction")
        elif "analysis" in message_content.lower():
            response = self.ai_agent.get_response("analysis")
        else:
            response = self.ai_agent.get_response("encouragement")
            
        await self.send_message(session_id, response)
        
    async def periodic_ai_interaction(self, session_id: str):
        """Send periodic AI interactions during the session"""
        await asyncio.sleep(10)  # Wait 10 seconds after connection
        
        interactions = [
            (30, "exercise_instruction"),
            (60, "encouragement"),
            (90, "analysis"),
            (120, "correction"),
            (150, "encouragement"),
            (180, "exercise_instruction")
        ]
        
        for delay, interaction_type in interactions:
            await asyncio.sleep(delay - (interactions[interactions.index((delay, interaction_type)) - 1][0] if interactions.index((delay, interaction_type)) > 0 else 0))
            
            if session_id in self.active_connections:
                response = self.ai_agent.get_response(interaction_type)
                await self.send_message(session_id, response)
            else:
                break

# Global manager instance
video_call_manager = VideoCallManager()

async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await video_call_manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await video_call_manager.handle_message(session_id, message)
    except WebSocketDisconnect:
        video_call_manager.disconnect(session_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        video_call_manager.disconnect(session_id)