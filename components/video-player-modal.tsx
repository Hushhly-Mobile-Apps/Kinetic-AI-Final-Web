"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react"

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
  title?: string
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl, title }: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Default video URL if none provided
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" // Sample video
  const videoSrc = videoUrl || defaultVideoUrl

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    setCurrentTime(video.currentTime)
    setDuration(video.duration)
  }

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    setDuration(video.duration)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black">
        <DialogHeader className="p-4 bg-gray-900 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {title || "Rehabilitation Session Review"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative">
          {/* Video Player */}
          <div className="relative bg-black">
            {videoSrc.includes('youtube.com') ? (
              // YouTube embed
              <iframe
                src={videoSrc}
                className="w-full h-96"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // HTML5 video player
              <video
                src={videoSrc}
                className="w-full h-96 object-contain"
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                muted={isMuted}
              />
            )}
          </div>

          {/* Custom Controls (for HTML5 video) */}
          {!videoSrc.includes('youtube.com') && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMuteToggle}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Video Information */}
        <div className="p-4 bg-gray-900 text-white">
          <div className="space-y-2">
            <h3 className="font-semibold">Session Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Patient:</span>
                <span className="ml-2">Ayu Pranata</span>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="ml-2">July 3, 2025</span>
              </div>
              <div>
                <span className="text-gray-400">Exercise:</span>
                <span className="ml-2">Shoulder Mobility Test</span>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span>
                <span className="ml-2">15:30</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 