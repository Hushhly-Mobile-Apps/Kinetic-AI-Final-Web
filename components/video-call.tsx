"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuthApi } from "@/hooks/use-auth-api"
import { useAuth } from "@/components/auth-provider"
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, ScreenShare, Maximize2, Minimize2, Bot, Activity, X, Settings, Volume2, VolumeX, Camera, CameraOff, Monitor, Users, Heart, Zap, Star, Award, Shield, Wifi, Phone, MonitorOff, BarChart3, Sparkles, Record, StopCircle, Brain } from "lucide-react"
import Image from "next/image"

// Premium CSS Animations
const premiumStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .glass-effect {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .premium-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .premium-button {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }
  
  .premium-button:hover {
    background: linear-gradient(135deg, rgba(99, 102,241, 1), rgba(139, 92, 246, 1));
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
  }
`

interface VideoCallProps {
  therapistName: string
  therapistImage: string
  onEndCall: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
  isAIAgent?: boolean
  sessionId?: string
}

interface RTCConfiguration {
  iceServers: RTCIceServer[]
  iceCandidatePoolSize?: number
}

interface RTCIceServer {
  urls: string | string[]
  username?: string
  credential?: string
}

declare global {
  interface Window {
    process?: {
      env: {
        TURN_USERNAME?: string
        TURN_PASSWORD?: string
      }
    }
  }
}

const TURN_USERNAME = process?.env?.TURN_USERNAME || ''
const TURN_PASSWORD = process?.env?.TURN_PASSWORD || ''

export function VideoCall({
  therapistName,
  therapistImage,
  onEndCall,
  isMinimized = false,
  onToggleMinimize,
  isAIAgent = false,
  sessionId,
}: VideoCallProps) {
  const { user } = useAuth()
  const {
    startVideoCall,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendICECandidate,
    endVideoCall,
    getVideoCallSession
  } = useAuthApi()
  
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isConnecting, setIsConnecting] = useState(true)
  const [aiResponse, setAiResponse] = useState("")
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  
  // Premium features state
  const [noiseCancellation, setNoiseCancellation] = useState(true)
  const [beautyFilter, setBeautyFilter] = useState(false)
  const [virtualBackground, setVirtualBackground] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [videoQuality, setVideoQuality] = useState('HD')
  const [networkQuality, setNetworkQuality] = useState(5)
  const [participantCount, setParticipantCount] = useState(2)
  const [sessionRating, setSessionRating] = useState(0)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  // WebRTC and connection refs
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const [backendSessionId, setBackendSessionId] = useState<string | null>(null)

  // Initialize connection and AI agent
  useEffect(() => {
    initializeVideoCall()
    return () => {
      cleanup()
    }
  }, [])

  // Initialize video call session with backend
  const initializeVideoCall = async () => {
    try {
      setConnectionStatus("Starting session...")
      
      // Start session with backend
      const sessionResponse = await startVideoCall(
        isAIAgent ? 'ai-therapist' : 'therapist',
        {
          therapistName,
          isAIAgent,
          sessionType: 'video-call'
        }
      )
      
      if (sessionResponse.success) {
        setBackendSessionId(sessionResponse.sessionId)
        setConnectionStatus("Session started")
        
        if (isAIAgent) {
          await initializeAIConnection(sessionResponse.sessionId)
        } else {
          await initializeWebRTC(sessionResponse.sessionId)
        }
        
        await startLocalVideo()
        setIsConnecting(false)
      } else {
        throw new Error(sessionResponse.message || 'Failed to start session')
      }
    } catch (error) {
      console.error('Failed to initialize video call:', error)
      setConnectionStatus("Connection failed")
      setIsConnecting(false)
    }
  }

  // Initialize AI connection with backend
  const initializeAIConnection = async (sessionId: string) => {
    try {
      setConnectionStatus("Connecting to AI Therapist...")
      
      // Connect to WebSocket for real-time AI communication
      const wsUrl = getWebSocketUrl(sessionId)
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws
      
      ws.onopen = () => {
        setConnectionStatus("Connected to AI Therapist")
        
        // Send initial greeting
        ws.send(JSON.stringify({
          type: 'greeting',
          message: 'Patient connected to video call',
          userId: user?.id
        }))
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleAIResponse(data)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus("Connection failed - using fallback mode")
      }
      
      ws.onclose = () => {
         console.log('WebSocket connection closed')
         setConnectionStatus("Disconnected")
       }
     } catch (error) {
       console.error('Failed to initialize AI connection:', error)
       setConnectionStatus("AI connection failed")
     }
   }
   
   // Initialize WebRTC for peer-to-peer video calls
   const initializeWebRTC = async (sessionId: string) => {
     try {
       setConnectionStatus("Setting up video connection...")
       
       // Create peer connection with TURN server configuration
       const peerConnection = new RTCPeerConnection({
         iceServers: [
           { urls: 'stun:stun.l.google.com:19302' },
           { urls: 'stun:stun1.l.google.com:19302' },
           { 
             urls: 'turn:your-turn-server.com:3478',
             username: process.env.TURN_USERNAME,
             credential: process.env.TURN_PASSWORD
           }
         ],
         iceCandidatePoolSize: 10
       })
       
       peerConnectionRef.current = peerConnection
       
       // Connect to signaling server
       const ws = new WebSocket(`ws://localhost:8000/api/v1/webrtc/ws/${sessionId}`)
       
       ws.onopen = async () => {
         setConnectionStatus("Connected to signaling server")
         
         // Create and send offer if initiator
         const offer = await peerConnection.createOffer({
           offerToReceiveAudio: true,
           offerToReceiveVideo: true
         })
         await peerConnection.setLocalDescription(offer)
         
         ws.send(JSON.stringify({
           type: 'offer',
           offer: offer
         }))
       }
       
       ws.onmessage = async (event) => {
         const data = JSON.parse(event.data)
         if (data.type === 'offer') {
           await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
           const answer = await peerConnection.createAnswer()
           await peerConnection.setLocalDescription(answer)
           ws.send(JSON.stringify({
             type: 'answer',
             answer: answer
           }))
         } else if (data.type === 'answer') {
           await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
         } else if (data.type === 'ice-candidate') {
           await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
         }
       }
       
       // Handle ICE candidates
       peerConnection.onicecandidate = (event) => {
         if (event.candidate) {
           ws.send(JSON.stringify({
             type: 'ice-candidate',
             candidate: event.candidate
           }))
         }
       }
       
       // Handle connection state changes
       peerConnection.onconnectionstatechange = () => {
         switch(peerConnection.connectionState) {
           case "connected":
             setConnectionStatus("Connected to peer")
             break
           case "disconnected":
             setConnectionStatus("Peer disconnected")
             break
           case "failed":
             setConnectionStatus("Connection failed")
             break
           case "closed":
             setConnectionStatus("Connection closed")
             break
         }
       }
       
       // Handle remote stream
       peerConnection.ontrack = (event) => {
         if (remoteVideoRef.current && event.streams[0]) {
           remoteVideoRef.current.srcObject = event.streams[0]
         }
       }
       
       setConnectionStatus("Ready for video call")
     } catch (error) {
       console.error('Failed to initialize WebRTC:', error)
       setConnectionStatus("WebRTC setup failed")
     }
   }
   
   // Cleanup function
   const cleanup = async () => {
     try {
       // Stop local stream and release camera
       if (localStreamRef.current) {
         localStreamRef.current.getTracks().forEach(track => {
           track.stop()
           track.enabled = false
         })
         localStreamRef.current = null
       }
       
       // Clean up remote stream
       if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
         const stream = remoteVideoRef.current.srcObject as MediaStream
         stream.getTracks().forEach(track => {
           track.stop()
           track.enabled = false
         })
         remoteVideoRef.current.srcObject = null
       }
       
       // Close and cleanup peer connection
       if (peerConnectionRef.current) {
         peerConnectionRef.current.ontrack = null
         peerConnectionRef.current.onicecandidate = null
         peerConnectionRef.current.onconnectionstatechange = null
         peerConnectionRef.current.close()
         peerConnectionRef.current = null
       }
       
       // Close WebSocket connections
       if (wsRef.current) {
         wsRef.current.onclose = null
         wsRef.current.onerror = null
         wsRef.current.onmessage = null
         wsRef.current.close()
         wsRef.current = null
       }
       
       // End session with backend
       if (backendSessionId) {
         await endVideoCall(backendSessionId)
       }
     } catch (error) {
       console.error('Cleanup error:', error)
     }
   }
      
    } catch (error) {
      console.error('Failed to initialize AI connection:', error)
      setConnectionStatus("Using offline mode")
      setIsConnecting(false)
      startLocalVideo()
    }
  }
  
  // Handle AI responses
  const handleAIResponse = (data: any) => {
    switch (data.type) {
      case 'speech':
        setAiResponse(data.message)
        setIsAiSpeaking(true)
        
        // Simulate AI speaking duration
        setTimeout(() => {
          setIsAiSpeaking(false)
        }, data.duration || 3000)
        
        // Use Web Speech API for text-to-speech if available
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.message)
          utterance.rate = 0.8
          utterance.pitch = 1.1
          speechSynthesis.speak(utterance)
        }
        break
        
      case 'analysis':
        setAiResponse(`Analysis: ${data.message}`)
        break
        
      case 'instruction':
        setAiResponse(`Instruction: ${data.message}`)
        break
        
      default:
        setAiResponse(data.message)
    }
  }
  
  // Send message to AI
  const sendToAI = (message: string, type: string = 'message') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type,
        message,
        timestamp: new Date().toISOString()
      }))
    }
  }

  // Update call duration and send periodic updates to AI
  useEffect(() => {
    if (!isConnecting) {
      const interval = setInterval(() => {
        setCallDuration((prev) => {
          const newDuration = prev + 1
          
          // Send periodic updates to AI every 30 seconds
          if (isAIAgent && newDuration % 30 === 0) {
            sendToAI(`Session duration: ${newDuration} seconds`, 'duration_update')
          }
          
          return newDuration
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isConnecting, isAIAgent])
  
  // Audio level monitoring simulation
  useEffect(() => {
    if (!isMuted && !isConnecting) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isMuted, isConnecting])
  
  // Network quality monitoring simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkQuality(Math.floor(Math.random() * 2) + 4) // 4-5 bars
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  
  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start local video (user's camera)
  const startLocalVideo = async () => {
    try {
      if (localVideoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }, 
          audio: {
            echoCancellation: noiseCancellation,
            noiseSuppression: noiseCancellation,
            autoGainControl: true
          }
        })
        
        localVideoRef.current.srcObject = stream
        localStreamRef.current = stream
        
        // Add stream to peer connection if it exists
        if (peerConnectionRef.current && !isAIAgent) {
          stream.getTracks().forEach(track => {
            peerConnectionRef.current?.addTrack(track, stream)
          })
        }
        
        setConnectionStatus("Video ready")
        
        // For AI agent, simulate connection
        if (isAIAgent) {
          setTimeout(() => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.poster = therapistImage
              remoteVideoRef.current.classList.add("remote-connected")
              setConnectionStatus("Connected to AI Therapist")
            }
          }, 2000)
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setIsVideoOff(true)
      setConnectionStatus("Camera access failed")
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted
      })
    }
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff
      })
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Return to camera
        startLocalVideo()
      } else {
        // Share screen
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      }
      setIsScreenSharing(!isScreenSharing)
      if (isAIAgent) {
        sendToAI(`Screen sharing ${!isScreenSharing ? 'started' : 'stopped'}`, 'screen_share')
      }
    } catch (err) {
      console.error("Error sharing screen:", err)
    }
  }
  
  // Premium feature functions
  const toggleNoiseCancellation = () => {
    setNoiseCancellation(!noiseCancellation)
  }
  
  const toggleBeautyFilter = () => {
    setBeautyFilter(!beautyFilter)
  }
  
  const toggleVirtualBackground = () => {
    setVirtualBackground(!virtualBackground)
  }
  
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (isAIAgent) {
      sendToAI(`Recording ${!isRecording ? 'started' : 'stopped'}`, 'recording')
    }
  }
  
  const changeVideoQuality = (quality: string) => {
    setVideoQuality(quality)
  }

  const getWebSocketUrl = (sessionId: string) => {
    // Check if we're using ngrok
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Replace HTTP with WS protocols
    const wsUrl = apiUrl
      .replace('http://', 'ws://')
      .replace('https://', 'wss://')
      .replace(/\/$/, '');
      
    if (apiUrl.includes('ngrok')) {
      // For ngrok, ensure we use wss:// protocol
      return `wss://${wsUrl.split('//')[1]}/ws/video-call/${sessionId}`;
    }
    // For local development
    return `${wsUrl}/ws/video-call/${sessionId}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden z-50 w-72">
        <div className="p-2 bg-[#014585] text-white flex justify-between items-center">
          <span className="text-sm font-medium">Call with {therapistName}</span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-blue-700"
              onClick={onToggleMinimize}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-red-600" onClick={onEndCall}>
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative h-40 bg-gray-900">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            poster={therapistImage}
          />
          <div className="absolute bottom-2 right-2 w-20 h-20 bg-gray-800 rounded overflow-hidden border border-gray-700">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Video className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {formatDuration(callDuration)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Inject Premium Styles */}
      <style dangerouslySetInnerHTML={{ __html: premiumStyles }} />
      <div className="bg-white h-full w-full flex flex-col">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
                {isAIAgent ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                ) : (
                  <Image
                    src={therapistImage || "/placeholder.svg"}
                    alt={therapistName}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                )}
              </div>
              {isAIAgent && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <Zap className="h-2 w-2 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg">{isAIAgent ? 'AI Therapist Pro' : therapistName}</h3>
                {isAIAgent && <Award className="h-4 w-4 text-yellow-300" />}
              </div>
              <div className="flex items-center space-x-3 text-sm opacity-90">
                <span>{isAIAgent ? 'Premium AI-Powered Session' : 'Certified Physical Therapist'}</span>
                <div className="flex items-center space-x-1">
                  <Wifi className="h-3 w-3" />
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-3 rounded-full ${
                          i < networkQuality ? 'bg-green-400' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{participantCount}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-lg font-mono font-bold">{formatDuration(callDuration)}</div>
              <div className="text-xs opacity-75">{videoQuality} • {isRecording ? 'REC' : 'LIVE'}</div>
            </div>
            {isAIAgent && (
              <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
                <span className="text-xs font-medium text-green-300">{connectionStatus}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20 transition-all duration-200"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white hover:bg-blue-700/50 transition-all duration-200"
                onClick={onToggleMinimize}
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-red-600/50 transition-all duration-200"
              onClick={onEndCall}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Premium Analytics Panel */}
        {showAnalytics && (
          <div className="absolute top-20 left-4 w-72 bg-black/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                Live Analytics
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/10"
                onClick={() => setShowAnalytics(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3 text-sm">
              {/* Session Stats */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Session Quality</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="text-white font-semibold">9.8/10</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-xs">Network</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      networkQuality >= 4 ? 'bg-green-400' :
                      networkQuality >= 3 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <span className="text-white text-xs capitalize">{
                      networkQuality >= 4 ? 'excellent' :
                      networkQuality >= 3 ? 'good' : 'poor'
                    }</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Participants</span>
                  <span className="text-white text-xs">{participantCount}</span>
                </div>
              </div>
              
              {/* Real-time Metrics */}
              <div className="bg-white/5 rounded-lg p-3">
                <h6 className="text-white font-medium mb-2 flex items-center">
                  <Heart className="h-3 w-3 mr-1 text-red-400" />
                  Wellness Metrics
                </h6>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Engagement</span>
                    <span className="text-green-400 text-xs font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Stress Level</span>
                    <span className="text-blue-400 text-xs font-medium">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Focus Score</span>
                    <span className="text-purple-400 text-xs font-medium">92%</span>
                  </div>
                </div>
              </div>
              
              {/* Technical Stats */}
              <div className="bg-white/5 rounded-lg p-3">
                <h6 className="text-white font-medium mb-2 flex items-center">
                  <Shield className="h-3 w-3 mr-1 text-blue-400" />
                  Technical
                </h6>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Latency</span>
                    <span className="text-green-400">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bitrate</span>
                    <span className="text-blue-400">2.1 Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resolution</span>
                    <span className="text-purple-400">{videoQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">FPS</span>
                    <span className="text-yellow-400">60</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Premium Settings Panel */}
        {showSettings && (
          <div className="absolute top-20 right-4 w-80 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">Premium Controls</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Audio Controls */}
              <div>
                <h5 className="font-semibold text-sm text-gray-700 mb-2">Audio Enhancement</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Noise Cancellation</span>
                    <Button
                      variant={noiseCancellation ? "default" : "outline"}
                      size="sm"
                      onClick={toggleNoiseCancellation}
                      className="h-6 text-xs"
                    >
                      {noiseCancellation ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-gray-500" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${audioLevel}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Controls */}
              <div>
                <h5 className="font-semibold text-sm text-gray-700 mb-2">Video Enhancement</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beauty Filter</span>
                    <Button
                      variant={beautyFilter ? "default" : "outline"}
                      size="sm"
                      onClick={toggleBeautyFilter}
                      className="h-6 text-xs"
                    >
                      {beautyFilter ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Virtual Background</span>
                    <Button
                      variant={virtualBackground ? "default" : "outline"}
                      size="sm"
                      onClick={toggleVirtualBackground}
                      className="h-6 text-xs"
                    >
                      {virtualBackground ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quality</span>
                    <select 
                      value={videoQuality}
                      onChange={(e) => changeVideoQuality(e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="HD">HD</option>
                      <option value="4K">4K Ultra</option>
                      <option value="Auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Recording */}
              <div>
                <h5 className="font-semibold text-sm text-gray-700 mb-2">Session Recording</h5>
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                  onClick={toggleRecording}
                  className="w-full"
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </div>
              
              {/* Analytics */}
              <div>
                <h5 className="font-semibold text-sm text-gray-700 mb-2">Session Analytics</h5>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="w-full"
                >
                  {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex-1 overflow-hidden">
          {/* Premium Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          {isConnecting ? (
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
              <div className="relative mb-8">
                {/* Premium Loading Animation */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl backdrop-blur-sm">
                    {isAIAgent ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <Bot className="h-20 w-20 text-white" />
                      </div>
                    ) : (
                      <Image
                        src={therapistImage || "/placeholder.svg"}
                        alt={therapistName}
                        width={160}
                        height={160}
                        className="object-cover"
                      />
                    )}
                  </div>
                  {/* Animated Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute -inset-4 rounded-full border border-blue-400/30 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div className="text-center backdrop-blur-sm bg-black/20 rounded-2xl p-6">
                <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {isAIAgent ? 'Connecting to Premium AI Therapist' : `Connecting to ${therapistName}`}
                </h3>
                <p className="text-gray-300 mb-4">{isAIAgent ? 'Establishing secure neural connection...' : 'Please wait while we establish a secure connection...'}</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-green-400" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1 text-purple-400" />
                    <span>Premium</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full z-10">
              {/* Remote Video / AI Avatar */}
              <div className="absolute inset-0">
                {isAIAgent ? (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
                    {/* Premium AI Avatar Display */}
                    <div className="text-center text-white relative z-10">
                      <div className="relative mb-8">
                        <div className={`w-56 h-56 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-400 shadow-2xl mx-auto backdrop-blur-sm ${
                          isAiSpeaking ? 'animate-pulse scale-110' : ''
                        } transition-all duration-300`}>
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <Bot className="h-28 w-28 text-white" />
                          </div>
                        </div>
                        {/* Status Indicator */}
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        </div>
                        {/* Floating Elements */}
                        <div className="absolute -top-4 -left-4 w-6 h-6 bg-blue-400/60 rounded-full animate-float" />
                        <div className="absolute -bottom-2 -right-8 w-4 h-4 bg-purple-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                      </div>
                      <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-6">
                        <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {therapistName}
                        </h3>
                        <p className="text-blue-200 mb-2">Premium AI Therapy Companion</p>
                        <div className="flex items-center justify-center space-x-4 text-sm">
                          <div className="flex items-center text-green-400">
                            <Star className="h-4 w-4 mr-1" />
                            <span>4.9/5 Rating</span>
                          </div>
                          <div className="flex items-center text-purple-400">
                            <Award className="h-4 w-4 mr-1" />
                            <span>Certified</span>
                          </div>
                        </div>
                        {aiResponse && (
                          <div className="mt-4 bg-black/30 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-white text-sm">{aiResponse}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Ambient Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/40 rounded-full animate-float" />
                      <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
                      <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '3s' }} />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      poster={therapistImage}
                    />
                    {/* Premium Video Overlay Effects */}
                    {beautyFilter && (
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 mix-blend-soft-light" />
                    )}
                    {virtualBackground && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Local video */}
              <div className="absolute bottom-6 right-6 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-xl">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                />
                {isVideoOff && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Video className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* AI Status Indicator */}
              {isAIAgent && (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    wsRef.current?.readyState === WebSocket.OPEN ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span>AI Connected</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Premium Control Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20" />
          
          <div className="relative glass-effect border-t border-white/10 p-8">
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-red-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Recording</span>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-8">
              {/* Audio Control */}
              <div className="relative group">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="lg"
                  className={`h-16 w-16 rounded-full premium-button animate-glow ${
                    isMuted ? 'bg-red-500/80 hover:bg-red-500' : ''
                  }`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
                </Button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
                </div>
                {/* Audio Level Indicator */}
                {!isMuted && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                )}
              </div>
              
              {/* Video Control */}
              <div className="relative group">
                <Button
                  variant={isVideoOff ? "destructive" : "secondary"}
                  size="lg"
                  className={`h-16 w-16 rounded-full premium-button animate-glow ${
                    isVideoOff ? 'bg-red-500/80 hover:bg-red-500' : ''
                  }`}
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-7 w-7" /> : <Video className="h-7 w-7" />}
                </Button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">{isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}</span>
                </div>
                {/* Video Quality Indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                  {videoQuality}
                </div>
              </div>
              
              {/* Screen Share */}
              <div className="relative group">
                <Button
                  variant={isScreenSharing ? "default" : "secondary"}
                  size="lg"
                  className={`h-16 w-16 rounded-full premium-button animate-glow ${
                    isScreenSharing ? 'bg-blue-500/80 hover:bg-blue-500' : ''
                  }`}
                  onClick={toggleScreenShare}
                >
                  <ScreenShare className="h-7 w-7" />
                </Button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
                </div>
              </div>
              
              {/* Messages */}
              <div className="relative group">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-16 w-16 rounded-full premium-button animate-glow"
                >
                  <MessageSquare className="h-7 w-7" />
                </Button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">Messages</span>
                </div>
              </div>
              
              {/* End Call - Premium Design */}
              <div className="relative group">
                <Button
                variant="destructive"
                size="lg"
                className="h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-2xl animate-glow border-2 border-red-400/50"
                onClick={async () => {
                  try {
                    if (isAIAgent) {
                      sendToAI('Patient ended the video call', 'session_end')
                    }
                    
                    // Clean up resources
                    await cleanup()
                    
                    // Call the parent's end call handler
                    onEndCall()
                  } catch (error) {
                    console.error('Error ending call:', error)
                    // Still call onEndCall even if cleanup fails
                    onEndCall()
                  }
                }}
              >
                  <PhoneOff className="h-9 w-9" />
                </Button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">End Call</span>
                </div>
              </div>
            </div>
            
            {/* Session Info Bar */}
            <div className="flex items-center justify-between mt-6 text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Wifi className={`h-4 w-4 ${
                    networkQuality >= 4 ? 'text-green-400' :
                    networkQuality >= 3 ? 'text-yellow-400' : 'text-red-400'
                  }`} />
                  <span>Network</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{participantCount}</span>
                </div>
                {noiseCancellation && (
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Volume2 className="h-4 w-4" />
                    <span>NC</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-white font-medium">{formatDuration(callDuration)}</div>
                {sessionRating > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{sessionRating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
