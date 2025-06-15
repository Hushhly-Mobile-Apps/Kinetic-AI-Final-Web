from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from typing import Dict, List, Optional
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webrtc", tags=["WebRTC Signaling"])

class WebRTCSignalingManager:
    def __init__(self):
        self.active_sessions: Dict[str, Dict[str, WebSocket]] = {}
        self.pending_ice_candidates: Dict[str, List[dict]] = {}
        
    async def connect(self, websocket: WebSocket, session_id: str):
        """Connect a new WebSocket client to a session"""
        try:
            await websocket.accept()
            
            if session_id not in self.active_sessions:
                self.active_sessions[session_id] = {}
                self.pending_ice_candidates[session_id] = []
                
            # Generate unique peer ID
            peer_id = f"peer_{len(self.active_sessions[session_id])}"
            self.active_sessions[session_id][peer_id] = websocket
            
            # Send connection confirmation
            await websocket.send_json({
                "type": "connection_established",
                "peer_id": peer_id,
                "session_id": session_id
            })
            
            logger.info(f"WebRTC peer {peer_id} connected to session {session_id}")
            
            # Send any pending ICE candidates
            if session_id in self.pending_ice_candidates:
                for candidate in self.pending_ice_candidates[session_id]:
                    await websocket.send_json(candidate)
                self.pending_ice_candidates[session_id] = []
                
        except Exception as e:
            logger.error(f"Error connecting WebRTC peer to session {session_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to establish WebRTC connection")
            
    def disconnect(self, session_id: str, peer_id: str):
        """Disconnect a peer from a session"""
        if session_id in self.active_sessions:
            if peer_id in self.active_sessions[session_id]:
                del self.active_sessions[session_id][peer_id]
                logger.info(f"WebRTC peer {peer_id} disconnected from session {session_id}")
                
            # Clean up empty sessions
            if not self.active_sessions[session_id]:
                del self.active_sessions[session_id]
                if session_id in self.pending_ice_candidates:
                    del self.pending_ice_candidates[session_id]
                    
    async def broadcast_to_session(self, session_id: str, message: dict, exclude_peer: Optional[str] = None):
        """Broadcast a message to all peers in a session except the sender"""
        if session_id in self.active_sessions:
            for peer_id, websocket in self.active_sessions[session_id].items():
                if peer_id != exclude_peer:
                    try:
                        await websocket.send_json(message)
                    except Exception as e:
                        logger.error(f"Error sending message to peer {peer_id} in session {session_id}: {str(e)}")
                        
    async def handle_signal(self, session_id: str, peer_id: str, signal: dict):
        """Handle WebRTC signaling messages"""
        try:
            signal_type = signal.get("type")
            
            if signal_type in ["offer", "answer"]:
                # Add sender information
                signal["from_peer"] = peer_id
                await self.broadcast_to_session(session_id, signal, exclude_peer=peer_id)
                
            elif signal_type == "ice-candidate":
                # Store ICE candidate if no peers are connected yet
                if session_id not in self.active_sessions or len(self.active_sessions[session_id]) < 2:
                    if session_id not in self.pending_ice_candidates:
                        self.pending_ice_candidates[session_id] = []
                    self.pending_ice_candidates[session_id].append(signal)
                else:
                    # Forward ICE candidate to other peers
                    signal["from_peer"] = peer_id
                    await self.broadcast_to_session(session_id, signal, exclude_peer=peer_id)
                    
        except Exception as e:
            logger.error(f"Error handling WebRTC signal in session {session_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to process WebRTC signal")

# Global signaling manager
signaling_manager = WebRTCSignalingManager()

@router.websocket("/ws/{session_id}")
async def webrtc_signaling(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for WebRTC signaling"""
    peer_id = None
    try:
        # Connect the peer
        peer_id = f"peer_{len(signaling_manager.active_sessions.get(session_id, {}))}"
        await signaling_manager.connect(websocket, session_id)
        
        while True:
            try:
                data = await websocket.receive_json()
                await signaling_manager.handle_signal(session_id, peer_id, data)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received from peer {peer_id} in session {session_id}")
                continue
                
    except WebSocketDisconnect:
        if peer_id:
            signaling_manager.disconnect(session_id, peer_id)
        logger.info(f"WebRTC signaling connection closed for peer {peer_id} in session {session_id}")
    except Exception as e:
        logger.error(f"Error in WebRTC signaling for session {session_id}: {str(e)}")
        if peer_id:
            signaling_manager.disconnect(session_id, peer_id)

@router.post("/offer/{session_id}")
async def send_offer(session_id: str, offer: dict):
    """Send WebRTC offer through signaling server"""
    try:
        await signaling_manager.broadcast_to_session(session_id, {
            "type": "offer",
            "offer": offer
        })
        return {"success": True, "message": "Offer sent"}
    except Exception as e:
        logger.error(f"Error sending offer in session {session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send offer")

@router.post("/answer/{session_id}")
async def send_answer(session_id: str, answer: dict):
    """Send WebRTC answer through signaling server"""
    try:
        await signaling_manager.broadcast_to_session(session_id, {
            "type": "answer",
            "answer": answer
        })
        return {"success": True, "message": "Answer sent"}
    except Exception as e:
        logger.error(f"Error sending answer in session {session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send answer")

@router.post("/ice-candidate/{session_id}")
async def send_ice_candidate(session_id: str, candidate: dict):
    """Send ICE candidate through signaling server"""
    try:
        await signaling_manager.broadcast_to_session(session_id, {
            "type": "ice-candidate",
            "candidate": candidate
        })
        return {"success": True, "message": "ICE candidate sent"}
    except Exception as e:
        logger.error(f"Error sending ICE candidate in session {session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send ICE candidate")
