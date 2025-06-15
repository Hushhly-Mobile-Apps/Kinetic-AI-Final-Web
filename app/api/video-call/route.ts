import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { userId, targetId, type, sessionData, offer, answer, candidate } = await request.json()

    if (type === "start-session") {
      // Start a new video call session
      const response = await fetch(`${BACKEND_URL}/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          user_id: userId,
          target_id: targetId,
          session_type: 'video_call',
          metadata: sessionData
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Video call session started",
          sessionId: data.session_id,
          websocketUrl: data.websocket_url,
          iceServers: data.ice_servers
        })
      } else {
        return NextResponse.json(
          { success: false, message: data.detail || "Failed to start session" },
          { status: response.status }
        )
      }
    } else if (type === "offer") {
      // Handle WebRTC offer
      const response = await fetch(`${BACKEND_URL}/session/webrtc/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          session_id: sessionData?.sessionId,
          offer: offer,
          target_id: targetId
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Offer sent successfully",
          sessionId: data.session_id
        })
      } else {
        return NextResponse.json(
          { success: false, message: data.detail || "Failed to send offer" },
          { status: response.status }
        )
      }
    } else if (type === "answer") {
      // Handle WebRTC answer
      const response = await fetch(`${BACKEND_URL}/session/webrtc/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          session_id: sessionData?.sessionId,
          answer: answer
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Answer sent successfully"
        })
      } else {
        return NextResponse.json(
          { success: false, message: data.detail || "Failed to send answer" },
          { status: response.status }
        )
      }
    } else if (type === "ice-candidate") {
      // Handle ICE candidates
      const response = await fetch(`${BACKEND_URL}/session/webrtc/ice-candidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          session_id: sessionData?.sessionId,
          candidate: candidate
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "ICE candidate sent successfully"
        })
      } else {
        return NextResponse.json(
          { success: false, message: data.detail || "Failed to send ICE candidate" },
          { status: response.status }
        )
      }
    } else if (type === "end-session") {
      // End video call session
      const response = await fetch(`${BACKEND_URL}/session/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          session_id: sessionData?.sessionId
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Session ended successfully",
          summary: data.summary
        })
      } else {
        return NextResponse.json(
          { success: false, message: data.detail || "Failed to end session" },
          { status: response.status }
        )
      }
    } else {
      return NextResponse.json({ success: false, message: "Invalid request type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in video call API:", error)
    return NextResponse.json({ success: false, message: "Video call service unavailable" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (sessionId) {
      // Get specific session details
      const response = await fetch(`${BACKEND_URL}/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          session: data
        })
      } else {
        return NextResponse.json(
          { success: false, message: data.detail || 'Session not found' },
          { status: response.status }
        )
      }
    } else {
      // Get user's active sessions
      const response = await fetch(`${BACKEND_URL}/session/active`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          sessions: data
        })
      } else {
        return NextResponse.json(
          { success: false, message: data.detail || 'Failed to get sessions' },
          { status: response.status }
        )
      }
    }
  } catch (error) {
    console.error('Video call session error:', error)
    return NextResponse.json(
      { success: false, message: 'Video call service unavailable' },
      { status: 500 }
    )
  }
}
