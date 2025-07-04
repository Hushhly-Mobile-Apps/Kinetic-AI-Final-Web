"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useCustomToast } from "@/components/ui/custom-toast"
import { Camera, Play, Download, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import { VideoPlayerModal } from "./video-player-modal"

interface PoseAnalysisResult {
  model: string
  camera: string
  pose_symmetry: string
  risk_level: string
  keypoints_detected: string[]
  analysis_time: string
}

export function PoseEstimation() {
  const [selectedModel, setSelectedModel] = useState("MediaPipe")
  const [cameraActive, setCameraActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { showToast } = useCustomToast()

  // Load selected model from localStorage
  useEffect(() => {
    const savedModel = localStorage.getItem("poseModel")
    if (savedModel) {
      setSelectedModel(savedModel)
    }
  }, [])

  // Save selected model to localStorage
  useEffect(() => {
    localStorage.setItem("poseModel", selectedModel)
  }, [selectedModel])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: "user"
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
        showToast("Camera activated successfully", "success")
      }
    } catch (error) {
      console.error("Camera access error:", error)
      showToast("Camera access denied. Please allow webcam.", "error")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    showToast("Camera stopped", "info")
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          showToast("Video uploaded successfully", "success")
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const runAnalysis = async () => {
    if (!cameraActive) {
      showToast("Please activate your camera first", "error")
      return
    }

    setIsAnalyzing(true)
    showToast("Starting pose analysis...", "loading")

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 1000))

    // Generate fake analysis result
    const symmetry = Math.floor(80 + Math.random() * 15) // 80-95%
    const riskLevel = symmetry > 90 ? "Low" : symmetry > 85 ? "Moderate" : "High"
    const keypoints = ["Left Shoulder", "Right Shoulder", "Left Elbow", "Right Elbow", "Left Knee", "Right Knee"]
    const analysisTime = (3 + Math.random() * 2).toFixed(1)

    const result: PoseAnalysisResult = {
      model: selectedModel,
      camera: "ON",
      pose_symmetry: `${symmetry}%`,
      risk_level: riskLevel,
      keypoints_detected: keypoints,
      analysis_time: `${analysisTime}s`
    }

    setAnalysisResult(result)
    setIsAnalyzing(false)
    showToast(`Analysis completed using ${selectedModel}`, "success")
  }

  const downloadReport = () => {
    if (!analysisResult) return

    const reportData = {
      timestamp: new Date().toISOString(),
      patient: "Ayu Pranata",
      session: "Shoulder Mobility Test – 3 July 2025",
      ...analysisResult
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `AI_Posture_Review_Ayu_Pranata_July2025.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast("Report downloaded successfully", "success")
  }

  const playVideo = () => {
    setIsVideoModalOpen(true)
    showToast("Opening video player...", "info")
  }

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Choose Pose Estimation Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MediaPipe">MediaPipe (v0.9)</SelectItem>
              <SelectItem value="OpenPose">OpenPose (v1.7)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">
            {selectedModel === "MediaPipe" 
              ? "Real-time pose detection optimized for mobile devices"
              : "High-accuracy pose estimation for detailed analysis"
            }
          </p>
        </CardContent>
      </Card>

      {/* Camera Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={cameraActive ? stopCamera : startCamera}
              variant={cameraActive ? "destructive" : "default"}
              className="flex-1"
            >
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </Button>
            <Button 
              onClick={simulateUpload}
              disabled={isUploading}
              variant="outline"
              className="flex-1"
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading physiotherapy session...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {cameraActive && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border"
                style={{ maxHeight: "300px" }}
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Analyzing posture...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runAnalysis}
              disabled={!cameraActive || isAnalyzing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Analysis...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
            <Button 
              onClick={playVideo}
              variant="outline"
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Video Session Review
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Upload your physiotherapy session to receive a full AI-generated posture and gait analysis.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Download movement breakdown reports for each patient session.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Run AI-powered muscle symmetry and joint tracking in seconds.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              AI Diagnostic Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{analysisResult.pose_symmetry}</p>
                <p className="text-sm text-gray-600">Pose Symmetry</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{analysisResult.risk_level}</p>
                <p className="text-sm text-gray-600">Risk Level</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{analysisResult.keypoints_detected.length}</p>
                <p className="text-sm text-gray-600">Keypoints Detected</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{analysisResult.analysis_time}</p>
                <p className="text-sm text-gray-600">Analysis Time</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Model Used: {analysisResult.model}</p>
              <p className="font-medium">Keypoints Detected:</p>
              <div className="flex flex-wrap gap-2">
                {analysisResult.keypoints_detected.map((keypoint, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {keypoint}
                  </span>
                ))}
              </div>
            </div>

            <Button 
              onClick={downloadReport}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Movement Report
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="Shoulder Mobility Test - Ayu Pranata"
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      />
    </div>
  )
} 