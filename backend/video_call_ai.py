from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
import random
from datetime import datetime
from typing import Dict, List

class AITherapistAgent:
    def __init__(self):
        self.responses = {
            "greeting": [
                "Hello! I'm Dr. AI, your virtual physical therapist. How are you feeling today?",
                "Welcome to your session! I'm here to help you with your rehabilitation journey.",
                "Good to see you! Let's work together to improve your movement and recovery."
            ],
            "exercise_instruction": [
                "Let's start with some gentle warm-up exercises. Please raise your arms slowly above your head.",
                "Now, let's work on your balance. Stand on one foot for 10 seconds.",
                "Great! Now let's do some shoulder rolls. Roll your shoulders backward 5 times.",
                "Perfect! Let's try some gentle neck stretches. Turn your head slowly to the right."
            ],
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
        
    def get_response(self, message_type: str, context: str = "") -> dict:
        """Generate AI therapist response based on message type"""
        if message_type in self.responses:
            response_text = random.choice(self.responses[message_type])
        else:
            response_text = "I understand. Let's continue with your therapy session."
            
        return {
            "type": "speech",
            "message": response_text,
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
        
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        
        # Send welcome message
        welcome_response = self.ai_agent.get_response("greeting")
        await websocket.send_text(json.dumps(welcome_response))
        
        # Start periodic AI interactions
        asyncio.create_task(self.periodic_ai_interaction(session_id))
        
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            
    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            websocket = self.active_connections[session_id]
            await websocket.send_text(json.dumps(message))
            
    async def handle_message(self, session_id: str, data: dict):
        message_type = data.get("type", "message")
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