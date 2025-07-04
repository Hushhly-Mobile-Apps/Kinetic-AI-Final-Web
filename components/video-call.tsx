"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, ScreenShare, Maximize2, Minimize2 } from "lucide-react"
import Image from "next/image"

interface VideoCallProps {
  therapistName: string
  therapistImage: string
  onEndCall: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function VideoCall({
  therapistName,
  therapistImage,
  onEndCall,
  isMinimized = false,
  onToggleMinimize,
}: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isConnecting, setIsConnecting] = useState(true)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Simulate connecting and then showing the video
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false)
      startLocalVideo()
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Update call duration
  useEffect(() => {
    if (!isConnecting) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isConnecting])

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
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localVideoRef.current.srcObject = stream

        // Simulate remote video (therapist) with a delayed connection
        setTimeout(() => {
          if (remoteVideoRef.current) {
            // In a real app, this would be the remote peer's stream
            // For demo, we'll use a static image with a video overlay effect
            remoteVideoRef.current.poster = therapistImage
            remoteVideoRef.current.classList.add("remote-connected")
          }
        }, 3000)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setIsVideoOff(true)
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
    } catch (err) {
      console.error("Error sharing screen:", err)
    }
  }

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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl">
        <div className="p-4 bg-[#014585] text-white flex justify-between items-center">
          <h3 className="font-semibold">Video Call with {therapistName}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{formatDuration(callDuration)}</span>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-700"
                onClick={onToggleMinimize}
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="relative bg-gray-900 aspect-video">
          {isConnecting ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                <Image
                  src={therapistImage || "/placeholder.svg"}
                  alt={therapistName}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <p className="text-white text-lg mb-2">Connecting to {therapistName}...</p>
              <div className="flex space-x-2">
                <div
                  className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster={therapistImage}
              />
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded overflow-hidden border-2 border-white shadow-lg">
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
            </>
          )}
        </div>

        <div className="p-4 bg-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${isMuted ? "bg-red-100 text-red-600 border-red-300" : ""}`}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${isVideoOff ? "bg-red-100 text-red-600 border-red-300" : ""}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${isScreenSharing ? "bg-blue-100 text-blue-600 border-blue-300" : ""}`}
              onClick={toggleScreenShare}
            >
              <ScreenShare className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="destructive"
            className="rounded-full h-12 w-12 bg-red-600 hover:bg-red-700"
            onClick={onEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
