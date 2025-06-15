"use client"

import { useState } from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title: string
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (!isOpen) return null

  const isYouTubeUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isLocalVideo = videoUrl.startsWith('/') || videoUrl.startsWith('./') || videoUrl.includes('.mp4')

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
    setHasError(false)
  }

  const handleVideoError = () => {
    setHasError(true)
    setIsVideoLoaded(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title} - Video Demo</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="aspect-video w-full bg-gray-100 rounded-md overflow-hidden relative">
            {hasError ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Play className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium mb-2">Video Demo Coming Soon</p>
                <p className="text-sm text-center max-w-md">
                  This exercise video is currently being prepared. Please check back later or contact your therapist for a live demonstration.
                </p>
              </div>
            ) : isYouTubeUrl ? (
              <iframe
                src={videoUrl}
                title={`${title} Exercise Demo`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            ) : isLocalVideo ? (
              <video
                className="w-full h-full object-cover"
                controls
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Play className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium mb-2">Video Demo Available</p>
                <p className="text-sm text-center max-w-md">
                  Follow the written instructions below to perform this exercise correctly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}