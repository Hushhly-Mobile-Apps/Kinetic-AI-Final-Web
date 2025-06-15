"use client"

import React, { useState, useEffect } from 'react'
import { VideoCall } from '@/components/video-call'
import { PoseEstimation } from '@/components/pose-estimation'
import { useAuth } from '@/components/auth-provider'
import { useAuthApi } from '@/hooks/use-auth-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Activity,
  Video,
  Brain,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface TherapySessionProps {
  therapistName?: string
  therapistImage?: string
  sessionType?: 'ai-therapy' | 'live-therapy' | 'pose-analysis'
  onSessionEnd?: () => void
}

interface PoseAnalysis {
  timestamp: string
  accuracy: number
  feedback: string
  recommendations: string[]
  exerciseCompleted: boolean
}

export function IntegratedTherapySession({
  therapistName = "Dr. Sarah Johnson",
  therapistImage = "/caring-doctor.png",
  sessionType = 'ai-therapy',
  onSessionEnd
}: TherapySessionProps) {
  const { user } = useAuth()
  const { getPoseHistory } = useAuthApi()
  
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isPoseEstimationActive, setIsPoseEstimationActive] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [poseAnalyses, setPoseAnalyses] = useState<PoseAnalysis[]>([])
  const [currentExercise, setCurrentExercise] = useState('Shoulder Mobility')
  const [exerciseProgress, setExerciseProgress] = useState(0)
  const [sessionStats, setSessionStats] = useState({
    exercisesCompleted: 0,
    averageAccuracy: 0,
    totalMovements: 0,
    improvementScore: 0
  })
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('session')

  // Generate session ID on component mount
  useEffect(() => {
    setSessionId(`session_${Date.now()}_${user?.id || 'anonymous'}`)
  }, [])

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVideoCallActive || isPoseEstimationActive) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isVideoCallActive, isPoseEstimationActive])

  // Load pose history when session starts
  useEffect(() => {
    if (sessionId && isPoseEstimationActive) {
      loadPoseHistory()
    }
  }, [sessionId, isPoseEstimationActive])

  const loadPoseHistory = async () => {
    try {
      const history = await getPoseHistory(sessionId!)
      if (history.success && history.data) {
        // Process history data into analyses
        const analyses = history.data.map((item: any) => ({
          timestamp: item.timestamp,
          accuracy: item.analysis?.accuracy || 0,
          feedback: item.analysis?.feedback || 'Analysis in progress...',
          recommendations: item.analysis?.recommendations || [],
          exerciseCompleted: item.analysis?.exerciseCompleted || false
        }))
        setPoseAnalyses(analyses)
      }
    } catch (error) {
      console.error('Failed to load pose history:', error)
    }
  }

  const handleStartVideoCall = () => {
    setIsVideoCallActive(true)
    setActiveTab('video')
  }

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false)
    if (onSessionEnd) {
      onSessionEnd()
    }
  }

  const handleStartPoseEstimation = () => {
    setIsPoseEstimationActive(true)
    setActiveTab('pose')
  }

  const handleStopPoseEstimation = () => {
    setIsPoseEstimationActive(false)
  }

  const handlePoseDetected = (pose: any) => {
    // Update real-time pose data
    setSessionStats(prev => ({
      ...prev,
      totalMovements: prev.totalMovements + 1
    }))
  }

  const handleAnalysisReceived = (analysis: any) => {
    if (analysis.success && analysis.data) {
      const newAnalysis: PoseAnalysis = {
        timestamp: new Date().toISOString(),
        accuracy: analysis.data.accuracy || 0,
        feedback: analysis.data.feedback || 'Good form!',
        recommendations: analysis.data.recommendations || [],
        exerciseCompleted: analysis.data.exerciseCompleted || false
      }
      
      setPoseAnalyses(prev => [...prev, newAnalysis])
      
      // Update session stats
      setSessionStats(prev => {
        const newStats = {
          ...prev,
          averageAccuracy: (prev.averageAccuracy + newAnalysis.accuracy) / 2
        }
        
        if (newAnalysis.exerciseCompleted) {
          newStats.exercisesCompleted += 1
          setExerciseProgress(prev => Math.min(prev + 20, 100))
        }
        
        return newStats
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionTypeIcon = () => {
    switch (sessionType) {
      case 'ai-therapy': return <Brain className="h-5 w-5" />
      case 'live-therapy': return <Video className="h-5 w-5" />
      case 'pose-analysis': return <Activity className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const getSessionTypeLabel = () => {
    switch (sessionType) {
      case 'ai-therapy': return 'AI Therapy Session'
      case 'live-therapy': return 'Live Therapy Session'
      case 'pose-analysis': return 'Pose Analysis Session'
      default: return 'Therapy Session'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Session Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getSessionTypeIcon()}
                <div>
                  <CardTitle className="text-2xl">{getSessionTypeLabel()}</CardTitle>
                  <p className="text-muted-foreground">Session ID: {sessionId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(sessionDuration)}</span>
                </Badge>
                {user && (
                  <Badge variant="secondary">
                    {user.name || user.email}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="session">Session Control</TabsTrigger>
            <TabsTrigger value="video">Video Call</TabsTrigger>
            <TabsTrigger value="pose">Pose Analysis</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Session Control Tab */}
          <TabsContent value="session" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Call Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="h-5 w-5" />
                    <span>Video Call</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Start a video call with {sessionType === 'ai-therapy' ? 'AI therapist' : 'live therapist'}
                  </p>
                  <Button 
                    onClick={handleStartVideoCall}
                    disabled={isVideoCallActive}
                    className="w-full"
                  >
                    {isVideoCallActive ? 'Video Call Active' : 'Start Video Call'}
                  </Button>
                </CardContent>
              </Card>

              {/* Pose Estimation Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Pose Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enable real-time pose analysis and movement tracking
                  </p>
                  <Button 
                    onClick={isPoseEstimationActive ? handleStopPoseEstimation : handleStartPoseEstimation}
                    variant={isPoseEstimationActive ? 'destructive' : 'default'}
                    className="w-full"
                  >
                    {isPoseEstimationActive ? 'Stop Pose Analysis' : 'Start Pose Analysis'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Current Exercise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Current Exercise: {currentExercise}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{exerciseProgress}%</span>
                  </div>
                  <Progress value={exerciseProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Call Tab */}
          <TabsContent value="video">
            {isVideoCallActive ? (
              <VideoCall
                therapistName={therapistName}
                therapistImage={therapistImage}
                onEndCall={handleEndVideoCall}
                isMinimized={isMinimized}
                onToggleMinimize={() => setIsMinimized(!isMinimized)}
                isAIAgent={sessionType === 'ai-therapy'}
                sessionId={sessionId || undefined}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Video call not active</p>
                    <Button onClick={handleStartVideoCall} className="mt-4">
                      Start Video Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pose Analysis Tab */}
          <TabsContent value="pose" className="space-y-6">
            {isPoseEstimationActive ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pose Estimation Component */}
                <Card>
                  <CardHeader>
                    <CardTitle>Live Pose Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PoseEstimation
                      onPoseDetected={handlePoseDetected}
                      onAnalysisReceived={handleAnalysisReceived}
                      sessionId={sessionId || undefined}
                      enableBackendAnalysis={true}
                      width={640}
                      height={480}
                    />
                  </CardContent>
                </Card>

                {/* Real-time Feedback */}
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {poseAnalyses.length > 0 ? (
                      <div className="space-y-3">
                        {poseAnalyses.slice(-3).map((analysis, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Accuracy: {analysis.accuracy}%
                              </span>
                              {analysis.exerciseCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {analysis.feedback}
                            </p>
                            {analysis.recommendations.length > 0 && (
                              <ul className="text-xs text-muted-foreground mt-2 list-disc list-inside">
                                {analysis.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Start moving to see real-time feedback
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Pose analysis not active</p>
                    <Button onClick={handleStartPoseEstimation} className="mt-4">
                      Start Pose Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Exercises Completed</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{sessionStats.exercisesCompleted}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Average Accuracy</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{sessionStats.averageAccuracy.toFixed(1)}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Total Movements</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{sessionStats.totalMovements}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">Session Duration</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{formatTime(sessionDuration)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Analysis History */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
              </CardHeader>
              <CardContent>
                {poseAnalyses.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {poseAnalyses.map((analysis, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">
                              {new Date(analysis.timestamp).toLocaleTimeString()}
                            </span>
                            <Badge variant={analysis.exerciseCompleted ? 'default' : 'secondary'}>
                              {analysis.accuracy}% accuracy
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
                        </div>
                        {analysis.exerciseCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No analysis data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}