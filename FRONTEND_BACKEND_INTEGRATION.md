# Frontend-Backend Integration Guide

This guide explains how the Kinetic AI frontend components are now integrated with the backend API system, providing real-time video calling, pose estimation, and AI therapy features.

## Overview

The integration connects the Next.js frontend with the FastAPI backend through:
- JWT-based authentication
- RESTful API endpoints
- WebSocket connections for real-time communication
- WebRTC for video calling
- Real-time pose analysis with OpenPose

## Architecture

```
Frontend (Next.js)     Backend (FastAPI)
├── Auth Provider      ├── JWT Authentication
├── API Routes         ├── REST Endpoints
├── Video Call         ├── WebRTC Signaling
├── Pose Estimation    ├── OpenPose Integration
└── WebSocket Client   └── WebSocket Server
```

## Key Components

### 1. Authentication System

#### Frontend (`components/auth-provider.tsx`)
- Manages user authentication state
- Stores JWT tokens in localStorage
- Provides login/logout functionality
- Automatically verifies tokens on app load

#### Backend Integration
- Connects to `/api/auth` endpoint
- Handles JWT token validation
- Supports role-based access (patient, therapist, admin)

```typescript
// Example usage
const { user, login, logout } = useAuth()

// Login
await login('user@example.com', 'password')

// Check if user is authenticated
if (user) {
  // User is logged in
}
```

### 2. Authenticated API Hook

#### `hooks/use-auth-api.ts`
Provides authenticated API calls with automatic token handling:

```typescript
const {
  startVideoCall,
  sendWebRTCOffer,
  analyzePoseData,
  getPoseHistory
} = useAuthApi()

// Start a video call session
const session = await startVideoCall('ai-therapist', {
  therapistName: 'Dr. AI',
  sessionType: 'therapy'
})

// Analyze pose data
const analysis = await analyzePoseData(poseData, videoFrame, sessionId)
```

### 3. Video Call Integration

#### Frontend (`components/video-call.tsx`)
- WebRTC peer-to-peer connections
- AI therapist WebSocket communication
- Real-time session management
- Premium features (noise cancellation, beauty filters)

#### Backend Integration
- Session management via `/api/video-call`
- WebSocket endpoint: `ws://localhost:8000/ws/video-call/{sessionId}`
- WebRTC signaling through REST API
- AI therapist responses

```typescript
// Example usage
<VideoCall
  therapistName="Dr. Sarah Johnson"
  therapistImage="/therapist.jpg"
  onEndCall={handleEndCall}
  isAIAgent={true}
  sessionId={sessionId}
/>
```

### 4. Pose Estimation Integration

#### Frontend (`components/pose-estimation.tsx`)
- TensorFlow.js pose detection
- Real-time video analysis
- Backend integration for advanced analysis
- Throttled API calls (every 2 seconds)

#### Backend Integration
- Pose analysis via `/api/pose-estimation`
- OpenPose integration for detailed analysis
- Exercise form validation
- Progress tracking

```typescript
// Example usage
<PoseEstimation
  onPoseDetected={handlePoseDetected}
  onAnalysisReceived={handleAnalysisReceived}
  sessionId={sessionId}
  enableBackendAnalysis={true}
  width={640}
  height={480}
/>
```

### 5. Integrated Therapy Session

#### `components/integrated-therapy-session.tsx`
A comprehensive component that combines all features:

```typescript
<IntegratedTherapySession
  therapistName="Dr. Sarah Johnson"
  therapistImage="/caring-doctor.png"
  sessionType="ai-therapy"
  onSessionEnd={handleSessionEnd}
/>
```

Features:
- Session management with unique IDs
- Real-time video calling
- Pose analysis with backend integration
- Analytics and progress tracking
- Tabbed interface for different views

## API Endpoints

### Authentication
- `POST /api/auth` - Login with email/password
- `GET /api/auth` - Verify JWT token

### Video Call
- `POST /api/video-call` - Start/manage video sessions
- `GET /api/video-call` - Get session details
- WebSocket: `ws://localhost:8000/ws/video-call/{sessionId}`

### Pose Estimation
- `POST /api/pose-estimation` - Analyze pose data
- `GET /api/pose-estimation` - Get pose history

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```

### 3. Integrated Setup
```bash
# Use the integration script
node start-integration.js

# Or run manually
npm run dev & python backend/main.py
```

## Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./kineticai.db
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

## Usage Examples

### 1. Basic Authentication Flow
```typescript
import { useAuth } from '@/components/auth-provider'

function LoginComponent() {
  const { login, user, isLoading } = useAuth()
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      // User is now authenticated
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  if (isLoading) return <div>Loading...</div>
  if (user) return <div>Welcome, {user.name}!</div>
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      handleLogin(
        formData.get('email') as string,
        formData.get('password') as string
      )
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

### 2. Video Call with AI Therapist
```typescript
import { useState } from 'react'
import { VideoCall } from '@/components/video-call'

function TherapySession() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)
  
  return (
    <div>
      {isCallActive ? (
        <VideoCall
          therapistName="AI Therapist"
          therapistImage="/ai-therapist.png"
          onEndCall={() => setIsCallActive(false)}
          isAIAgent={true}
          sessionId={sessionId}
        />
      ) : (
        <button onClick={() => setIsCallActive(true)}>
          Start AI Therapy Session
        </button>
      )}
    </div>
  )
}
```

### 3. Pose Analysis with Backend Integration
```typescript
import { PoseEstimation } from '@/components/pose-estimation'

function ExerciseSession() {
  const [sessionId] = useState(`exercise_${Date.now()}`)
  const [analyses, setAnalyses] = useState([])
  
  const handlePoseDetected = (pose) => {
    console.log('Pose detected:', pose)
  }
  
  const handleAnalysisReceived = (analysis) => {
    if (analysis.success) {
      setAnalyses(prev => [...prev, analysis.data])
      console.log('Backend analysis:', analysis.data)
    }
  }
  
  return (
    <div>
      <PoseEstimation
        onPoseDetected={handlePoseDetected}
        onAnalysisReceived={handleAnalysisReceived}
        sessionId={sessionId}
        enableBackendAnalysis={true}
      />
      
      <div>
        <h3>Analysis Results:</h3>
        {analyses.map((analysis, index) => (
          <div key={index}>
            <p>Accuracy: {analysis.accuracy}%</p>
            <p>Feedback: {analysis.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Security Considerations

1. **JWT Tokens**: Stored in localStorage, automatically included in API requests
2. **HTTPS**: Use HTTPS in production for secure token transmission
3. **Token Expiration**: Tokens expire after 24 hours by default
4. **CORS**: Backend configured to accept requests from frontend domain
5. **Input Validation**: All API inputs are validated on the backend

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check if backend is running on correct port
   - Verify JWT token is being sent in Authorization header
   - Check token expiration

2. **WebSocket Connection Issues**
   - Ensure WebSocket endpoint is accessible
   - Check firewall settings
   - Verify session ID format

3. **Video Call Problems**
   - Check camera/microphone permissions
   - Verify STUN server connectivity
   - Check WebRTC browser support

4. **Pose Estimation Issues**
   - Ensure TensorFlow.js models are loaded
   - Check camera access permissions
   - Verify backend OpenPose installation

### Debug Mode

Enable debug logging:
```typescript
// In your component
console.log('Session ID:', sessionId)
console.log('User:', user)
console.log('API Response:', response)
```

## Performance Optimization

1. **Pose Analysis Throttling**: Limited to every 2 seconds to avoid overwhelming the server
2. **Video Quality**: Adaptive based on network conditions
3. **Caching**: API responses cached where appropriate
4. **Lazy Loading**: Components loaded on demand
5. **WebSocket Reconnection**: Automatic reconnection on connection loss

## Future Enhancements

1. **Real-time Collaboration**: Multiple users in same session
2. **Advanced Analytics**: Machine learning insights
3. **Mobile App**: React Native integration
4. **Offline Mode**: Local pose analysis when backend unavailable
5. **Multi-language Support**: Internationalization

## Support

For technical support or questions about the integration:
1. Check the console for error messages
2. Review the API documentation
3. Test individual components separately
4. Verify backend endpoints are responding
5. Check network connectivity and CORS settings