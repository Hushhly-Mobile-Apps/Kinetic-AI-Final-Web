'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Heart, AlertTriangle, TrendingUp, Users, Zap, Target, Award } from 'lucide-react';

interface PoseKeypoint {
  x: number;
  y: number;
  confidence: number;
  name: string;
}

interface ActivityResult {
  activity: string;
  confidence: number;
  rep_count: number;
  form_score: number;
  timestamp: string;
}

interface EmotionResult {
  emotion: string;
  confidence: number;
  body_language_indicators: Record<string, number>;
  timestamp: string;
}

interface AnomalyResult {
  is_anomaly: boolean;
  anomaly_type: string;
  confidence: number;
  description: string;
  timestamp: string;
}

interface PostureResult {
  posture_score: number;
  ergonomic_issues: string[];
  recommendations: string[];
  timestamp: string;
}

interface JointAngle {
  joint_name: string;
  angle: number;
  timestamp: string;
  confidence: number;
}

interface RealTimePoseData {
  original_pose: any;
  smoothed_keypoints: PoseKeypoint[];
  activity_recognition: ActivityResult;
  emotion_estimation: EmotionResult;
  anomaly_detection: AnomalyResult;
  posture_analysis: PostureResult;
  joint_angles: JointAngle[];
  range_of_motion: Record<string, any>;
  person_tracking: any;
  form_comparison: any;
  timestamp: string;
}

interface RealTimePoseAnalysisProps {
  isActive: boolean;
  onSessionStart: () => void;
  onSessionEnd: () => void;
}

const RealTimePoseAnalysis: React.FC<RealTimePoseAnalysisProps> = ({
  isActive,
  onSessionStart,
  onSessionEnd
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPoseData, setCurrentPoseData] = useState<RealTimePoseData | null>(null);
  const [activityHistory, setActivityHistory] = useState<ActivityResult[]>([]);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [jointAngleHistory, setJointAngleHistory] = useState<Record<string, JointAngle[]>>({});
  const [alerts, setAlerts] = useState<string[]>([]);
  const [sessionStats, setSessionStats] = useState({
    totalReps: 0,
    averageFormScore: 0,
    dominantEmotion: 'neutral',
    sessionDuration: 0
  });
  const [isRecording, setIsRecording] = useState(false);
  const [selectedJoint, setSelectedJoint] = useState('left_knee');
  
  const wsRef = useRef<WebSocket | null>(null);
  const alertsWsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket connection for real-time pose streaming
  const connectWebSocket = useCallback(() => {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const wsUrl = `ws://localhost:8000/api/v1/ws/pose-stream/${clientId}`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('Connected to pose streaming WebSocket');
    };
    
    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'pose_update') {
          const poseData: RealTimePoseData = message.data;
          setCurrentPoseData(poseData);
          
          // Update activity history
          setActivityHistory(prev => {
            const newHistory = [...prev, poseData.activity_recognition];
            return newHistory.slice(-50); // Keep last 50 activities
          });
          
          // Update emotion history
          setEmotionHistory(prev => {
            const newHistory = [...prev, poseData.emotion_estimation];
            return newHistory.slice(-50);
          });
          
          // Update joint angle history
          setJointAngleHistory(prev => {
            const updated = { ...prev };
            poseData.joint_angles.forEach(angle => {
              if (!updated[angle.joint_name]) {
                updated[angle.joint_name] = [];
              }
              updated[angle.joint_name].push(angle);
              // Keep last 100 readings per joint
              updated[angle.joint_name] = updated[angle.joint_name].slice(-100);
            });
            return updated;
          });
          
          // Check for anomalies and add alerts
          if (poseData.anomaly_detection.is_anomaly) {
            setAlerts(prev => {
              const newAlert = `${new Date().toLocaleTimeString()}: ${poseData.anomaly_detection.description}`;
              return [newAlert, ...prev].slice(0, 10); // Keep last 10 alerts
            });
          }
          
          // Update session stats
          setSessionStats(prev => ({
            ...prev,
            totalReps: prev.totalReps + (poseData.activity_recognition.rep_count || 0),
            averageFormScore: (prev.averageFormScore + poseData.activity_recognition.form_score) / 2,
            dominantEmotion: poseData.emotion_estimation.emotion
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from pose streaming WebSocket');
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  }, []);

  // WebSocket connection for real-time alerts
  const connectAlertsWebSocket = useCallback(() => {
    const clientId = `alerts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const wsUrl = `ws://localhost:8000/api/v1/ws/realtime-alerts/${clientId}`;
    
    alertsWsRef.current = new WebSocket(wsUrl);
    
    alertsWsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type !== 'health_check') {
          setAlerts(prev => {
            const newAlert = `${new Date().toLocaleTimeString()}: ${message.message}`;
            return [newAlert, ...prev].slice(0, 10);
          });
        }
      } catch (error) {
        console.error('Error parsing alerts WebSocket message:', error);
      }
    };
  }, []);

  // Start camera and pose detection
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setAlerts(prev => [
        `${new Date().toLocaleTimeString()}: Failed to access camera`,
        ...prev
      ].slice(0, 10));
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  // Capture and send pose data
  const capturePoseData = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isRecording) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    if (ctx && video.readyState === 4) {
      // Draw video frame to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Get image data
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Create mock pose data (in production, use actual pose estimation)
      const mockPoseData = {
        keypoints: [
          { x: 320, y: 100, confidence: 0.9, name: 'nose' },
          { x: 300, y: 150, confidence: 0.8, name: 'left_eye' },
          { x: 340, y: 150, confidence: 0.8, name: 'right_eye' },
          // Add more keypoints as needed
        ],
        timestamp: new Date().toISOString(),
        image: imageData
      };
      
      // Send to WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(mockPoseData));
      }
    }
  }, [isRecording]);

  // Start session
  const handleStartSession = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user_123' })
      });
      
      const data = await response.json();
      setSessionId(data.session_id);
      
      // Connect WebSockets
      connectWebSocket();
      connectAlertsWebSocket();
      
      // Start camera
      await startCamera();
      
      // Start pose capture interval
      intervalRef.current = setInterval(capturePoseData, 100); // 10 FPS
      
      onSessionStart();
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }, [connectWebSocket, connectAlertsWebSocket, startCamera, capturePoseData, onSessionStart]);

  // End session
  const handleEndSession = useCallback(async () => {
    try {
      if (sessionId) {
        await fetch(`/api/v1/sessions/${sessionId}/end`, {
          method: 'POST'
        });
      }
      
      // Cleanup
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      stopCamera();
      
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (alertsWsRef.current) {
        alertsWsRef.current.close();
      }
      
      setSessionId(null);
      setIsConnected(false);
      
      onSessionEnd();
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [sessionId, stopCamera, onSessionEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopCamera();
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (alertsWsRef.current) {
        alertsWsRef.current.close();
      }
    };
  }, [stopCamera]);

  // Format emotion data for chart
  const emotionChartData = emotionHistory.slice(-20).map((emotion, index) => ({
    time: index,
    confidence: emotion.confidence,
    emotion: emotion.emotion
  }));

  // Format joint angle data for chart
  const jointAngleChartData = (jointAngleHistory[selectedJoint] || []).slice(-20).map((angle, index) => ({
    time: index,
    angle: angle.angle,
    confidence: angle.confidence
  }));

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-Time Pose Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={isActive ? handleEndSession : handleStartSession}
              variant={isActive ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isActive ? 'End Session' : 'Start Session'}
            </Button>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {sessionId && (
              <Badge variant="outline">
                Session: {sessionId.slice(0, 8)}...
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Feed and Canvas */}
      <Card>
        <CardHeader>
          <CardTitle>Live Video Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full max-w-2xl rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">LIVE</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Analysis Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="emotion">Emotion</TabsTrigger>
          <TabsTrigger value="posture">Posture</TabsTrigger>
          <TabsTrigger value="joints">Joints</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        {/* Activity Recognition Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Current Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPoseData?.activity_recognition ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold capitalize">
                        {currentPoseData.activity_recognition.activity}
                      </h3>
                      <p className="text-muted-foreground">
                        Confidence: {(currentPoseData.activity_recognition.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {currentPoseData.activity_recognition.rep_count}
                        </p>
                        <p className="text-sm text-muted-foreground">Reps</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {(currentPoseData.activity_recognition.form_score * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Form Score</p>
                      </div>
                    </div>
                    
                    <Progress 
                      value={currentPoseData.activity_recognition.form_score * 100} 
                      className="w-full"
                    />
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No activity detected</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={activityHistory.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="form_score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emotion Analysis Tab */}
        <TabsContent value="emotion" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Current Emotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPoseData?.emotion_estimation ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold capitalize">
                        {currentPoseData.emotion_estimation.emotion}
                      </h3>
                      <p className="text-muted-foreground">
                        Confidence: {(currentPoseData.emotion_estimation.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(currentPoseData.emotion_estimation.body_language_indicators).map(([indicator, value]) => (
                        <div key={indicator} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{indicator.replace('_', ' ')}</span>
                          <Progress value={value * 100} className="w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No emotion data</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotion Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={emotionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="confidence" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Posture Analysis Tab */}
        <TabsContent value="posture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Posture Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentPoseData?.posture_analysis ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold">
                      {currentPoseData.posture_analysis.posture_score.toFixed(0)}/100
                    </h3>
                    <p className="text-muted-foreground">Posture Score</p>
                  </div>
                  
                  <Progress value={currentPoseData.posture_analysis.posture_score} className="w-full" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Issues Detected</h4>
                      <ul className="space-y-1">
                        {currentPoseData.posture_analysis.ergonomic_issues.map((issue, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {currentPoseData.posture_analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-green-600 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No posture data</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Joint Analysis Tab */}
        <TabsContent value="joints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Joint Angle Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(jointAngleHistory).map(joint => (
                    <Button
                      key={joint}
                      variant={selectedJoint === joint ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedJoint(joint)}
                    >
                      {joint.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={jointAngleChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="angle" stroke="#8884d8" name="Angle (°)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Real-time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{alert}</AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No alerts</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reps</p>
                    <p className="text-2xl font-bold">{sessionStats.totalReps}</p>
                  </div>
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Form Score</p>
                    <p className="text-2xl font-bold">{(sessionStats.averageFormScore * 100).toFixed(0)}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dominant Emotion</p>
                    <p className="text-2xl font-bold capitalize">{sessionStats.dominantEmotion}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Connected Users</p>
                    <p className="text-2xl font-bold">{isConnected ? 1 : 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimePoseAnalysis;