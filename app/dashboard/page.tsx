"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  LogOut,
  Camera,
  Bot,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Zap,
  Award,
  Target,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Settings as SettingsIcon,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { NotificationSystem } from "@/components/notification-system"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  // Generate more varied and dynamic data
  const generateAppointments = () => {
    const therapists = [
      { name: "Dr. Budi Santoso", image: "/caring-doctor.png" },
      { name: "Dr. Lisa Tan", image: "/friendly-receptionist.png" },
      { name: "Dr. Wijaya Saputra", image: "/smiling-brown-haired-woman.png" },
      { name: "Dr. Agus Pratama", image: "/athletic-man-short-hair.png" },
      { name: "Dr. Melati Sari", image: "/older-man-glasses.png" }
    ];

    const appointmentTypes = [
      "Video Consultation",
      "In-Person Session",
      "Follow-up Evaluation",
      "Initial Assessment",
      "Progress Review",
      "Therapy Session",
      "Movement Analysis"
    ];

    const dates = ["Today", "Tomorrow", "May 25", "May 28", "June 2"];
    const times = ["9:00 AM", "10:30 AM", "1:15 PM", "2:30 PM", "4:00 PM", "5:15 PM"];
    const statuses = ["confirmed", "pending"];

    // Generate 2-4 random appointments
    const count = Math.floor(Math.random() * 3) + 2;
    const appointments = [];

    for (let i = 0; i < count; i++) {
      appointments.push({
        id: i + 1,
        therapistName: therapists[Math.floor(Math.random() * therapists.length)].name,
        therapistImage: therapists[Math.floor(Math.random() * therapists.length)].image,
        date: dates[Math.floor(Math.random() * dates.length)],
        time: times[Math.floor(Math.random() * times.length)],
        type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }

    return appointments;
  };

  const generateExercises = () => {
    const exerciseNames = [
      "Shoulder Mobility",
      "Knee Stability",
      "Core Strengthening",
      "Hip Flexor Stretch",
      "Balance Training",
      "Rotator Cuff Exercise",
      "Ankle Mobility",
      "Posture Correction",
      "Neck Stretches",
      "Lower Back Routine"
    ];

    const timeframes = ["Today", "Yesterday", "2 days ago", "3 days ago", "This morning"];
    const durations = ["10 min", "15 min", "20 min", "25 min", "30 min"];

    // Generate 3-5 random exercises
    const count = Math.floor(Math.random() * 3) + 3;
    const exercises = [];

    for (let i = 0; i < count; i++) {
      const sets = Math.floor(Math.random() * 3) + 2;
      const reps = Math.floor(Math.random() * 10) + 8;
      const progress = Math.floor(Math.random() * 60) + 40; // 40-100%

      exercises.push({
        id: i + 1,
        name: exerciseNames[Math.floor(Math.random() * exerciseNames.length)],
        lastPerformed: timeframes[Math.floor(Math.random() * timeframes.length)],
        duration: durations[Math.floor(Math.random() * durations.length)],
        sets,
        reps,
        progress,
      });
    }

    return exercises;
  };

  const generateMessages = () => {
    const senders = [
      { name: "Dr. Budi Santoso", image: "/caring-doctor.png" },
      { name: "Resepsionis Klinik", image: "/friendly-receptionist.png" },
      { name: "Dr. Lisa Tan", image: "/athletic-man-short-hair.png" },
      { name: "Sistem Janji Temu", image: "/placeholder-logo.png" }
    ];

    const messageTemplates = [
      "Bagaimana perasaan Anda setelah sesi kemarin? Apakah ada nyeri atau ketidaknyamanan?",
      "Klaim asuransi Anda telah berhasil diproses. Tidak ada tindakan lanjutan yang diperlukan.",
      "Saya telah meninjau data kemajuan Anda. Peningkatan luar biasa pada latihan {exercise}!",
      "Pengingat: Janji temu Anda berikutnya dijadwalkan pada {date} pukul {time}.",
      "Rencana latihan baru telah ditambahkan ke program Anda. Silakan tinjau saat Anda sempat.",
      "Penilaian terbaru Anda menunjukkan peningkatan signifikan dalam mobilitas. Terus pertahankan!",
      "Mohon lengkapi formulir umpan balik untuk sesi terakhir Anda jika berkenan."
    ];

    const timeframes = ["Just now", "5 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago", "Yesterday"];

    // Generate 2-4 random messages
    const count = Math.floor(Math.random() * 3) + 2;
    const messages = [];

    for (let i = 0; i < count; i++) {
      const sender = senders[Math.floor(Math.random() * senders.length)];
      let message = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];

      // Replace placeholders
      message = message.replace("{exercise}", ["shoulder", "knee", "core", "balance"][Math.floor(Math.random() * 4)]);
      message = message.replace("{date}", ["May 25", "May 28", "June 2"][Math.floor(Math.random() * 3)]);
      message = message.replace("{time}", ["9:00 AM", "2:30 PM", "4:15 PM"][Math.floor(Math.random() * 3)]);

      messages.push({
        id: i + 1,
        sender: sender.name,
        senderImage: sender.image,
        message,
        time: timeframes[Math.floor(Math.random() * timeframes.length)],
        unread: Math.random() > 0.5, // 50% chance of being unread
      });
    }

    return messages;
  };

  const generateProgressMetrics = () => {
    return [
      {
        id: 1,
        name: "Range of Motion",
        current: Math.floor(Math.random() * 40) + 80, // 80-120
        target: 120,
        unit: "degrees",
        change: `+${Math.floor(Math.random() * 8) + 2}`, // +2 to +10
        trend: "up",
      },
      {
        id: 2,
        name: "Pain Level",
        current: Math.floor(Math.random() * 4) + 1, // 1-5
        target: 0,
        unit: "/10",
        change: `-${Math.floor(Math.random() * 2) + 1}`, // -1 or -2
        trend: "down",
      },
      {
        id: 3,
        name: "Strength",
        current: Math.floor(Math.random() * 25) + 60, // 60-85
        target: 85,
        unit: "%",
        change: `+${Math.floor(Math.random() * 10) + 5}`, // +5 to +15
        trend: "up",
      },
    ];
  };

  // State with dynamic data
  const [upcomingAppointments, setUpcomingAppointments] = useState(generateAppointments());
  const [recentExercises, setRecentExercises] = useState(generateExercises());
  const [messages, setMessages] = useState(generateMessages());
  const [progressMetrics, setProgressMetrics] = useState(generateProgressMetrics());

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Hello! I\'m your AI rehabilitation assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // OpenPose simulation state
  const [poseActive, setPoseActive] = useState(false);
  const [poseData, setPoseData] = useState(null);
  const [exerciseMode, setExerciseMode] = useState('assessment');
  const [poseMetrics, setPoseMetrics] = useState({
    accuracy: 0,
    reps: 0,
    form: 'Good',
    calories: 0,
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Video upload state
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Video call state
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    // Update data every 30 seconds to simulate real-time changes
    const interval = setInterval(() => {
      // 20% chance to update appointments
      if (Math.random() < 0.2) {
        setUpcomingAppointments(generateAppointments());
      }

      // 30% chance to update exercises
      if (Math.random() < 0.3) {
        setRecentExercises(generateExercises());
      }

      // 40% chance to update messages
      if (Math.random() < 0.4) {
        setMessages(generateMessages());
      }

      // 25% chance to update progress metrics
      if (Math.random() < 0.25) {
        setProgressMetrics(generateProgressMetrics());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // AI Chat functions
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Based on your recent progress, I recommend focusing on shoulder mobility exercises today.",
        "Your pain levels have decreased by 40% this week. That's excellent progress!",
        "I notice you've been consistent with your exercises. Would you like me to suggest some advanced variations?",
        "Your range of motion has improved significantly. Let's work on strengthening exercises next.",
        "I can see you completed 85% of your exercises this week. Great job! How are you feeling?",
        "Based on your movement patterns, I suggest adding balance training to your routine.",
        "Your recovery is progressing well. Would you like me to schedule a check-in with your therapist?"
      ];

      const aiMessage = {
        id: chatMessages.length + 2,
        type: 'ai',
        message: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // OpenPose simulation functions
  const startPoseDetection = async () => {
    setPoseActive(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate pose detection
      const interval = setInterval(() => {
        setPoseMetrics(prev => ({
          accuracy: Math.min(100, prev.accuracy + Math.random() * 5),
          reps: prev.reps + (Math.random() > 0.7 ? 1 : 0),
          form: ['Excellent', 'Good', 'Needs Improvement'][Math.floor(Math.random() * 3)],
          calories: prev.calories + Math.random() * 0.5,
        }));
      }, 1000);

      // Store interval for cleanup
      setPoseData({ interval, stream });
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to simulation mode
      simulatePoseDetection();
    }
  };

  const simulatePoseDetection = () => {
    const interval = setInterval(() => {
      setPoseMetrics(prev => ({
        accuracy: Math.min(100, prev.accuracy + Math.random() * 5),
        reps: prev.reps + (Math.random() > 0.7 ? 1 : 0),
        form: ['Excellent', 'Good', 'Needs Improvement'][Math.floor(Math.random() * 3)],
        calories: prev.calories + Math.random() * 0.5,
      }));
    }, 1000);
    
    setPoseData({ interval });
  };

  const stopPoseDetection = () => {
    setPoseActive(false);
    
    if (poseData?.interval) {
      clearInterval(poseData.interval);
    }
    
    if (poseData?.stream) {
      poseData.stream.getTracks().forEach(track => track.stop());
    }
    
    setPoseData(null);
  };

  const resetPoseMetrics = () => {
    setPoseMetrics({
      accuracy: 0,
      reps: 0,
      form: 'Good',
      calories: 0,
    });
  };

  // Video call functions
  const startVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const endVideoCall = () => {
    setIsVideoCallActive(false);
    setIsMuted(false);
    setIsVideoOn(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  // Video upload and analysis functions
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
    }
  };

  const startVideoAnalysis = async () => {
    if (!uploadedVideo) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const mockResults = {
        overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
        keyPoints: [
          { name: 'Shoulder Alignment', score: Math.floor(Math.random() * 20) + 80, status: 'good' },
          { name: 'Hip Stability', score: Math.floor(Math.random() * 25) + 75, status: 'good' },
          { name: 'Knee Tracking', score: Math.floor(Math.random() * 30) + 60, status: 'needs_improvement' },
          { name: 'Spine Posture', score: Math.floor(Math.random() * 20) + 80, status: 'excellent' },
          { name: 'Balance Control', score: Math.floor(Math.random() * 25) + 70, status: 'good' }
        ],
        recommendations: [
          'Focus on maintaining neutral spine alignment',
          'Improve knee tracking during squats',
          'Strengthen core muscles for better stability',
          'Work on hip mobility exercises'
        ],
        exerciseCount: Math.floor(Math.random() * 10) + 15,
        duration: `${Math.floor(Math.random() * 5) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        caloriesBurned: Math.floor(Math.random() * 100) + 150
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const clearVideoUpload = () => {
    setUploadedVideo(null);
    setAnalysisResults(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={60} height={60} />
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/exercises"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Activity className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/messages"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link
            href="/progress"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/video-library"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <FileText className="w-5 h-5" />
          </Link>

        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/settings"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={logout}
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header with Notifications */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {user?.name || "User"}</h1>
              <p className="text-gray-500">Here's an overview of your rehabilitation journey</p>
            </div>
            <div className="flex items-center">
              <NotificationSystem />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-[#014585] to-[#0070c0] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Schedule Appointment</CardTitle>
                  <CardDescription className="text-blue-100">Book your next session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-200" />
                      <span>Available slots</span>
                    </div>
                    <Link href="/appointments">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white text-[#014585] hover:bg-blue-100 hover:text-[#014585]"
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today's Exercises</CardTitle>
                  <CardDescription>Complete your assigned routine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-[#014585]" />
                      <span>3 exercises pending</span>
                    </div>
                    <Link href="/exercises">
                      <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                        Start Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                  <CardDescription className="text-purple-100">Get personalized recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Bot className="mr-2 h-5 w-5 text-purple-200" />
                      <span>Chat with AI</span>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white text-[#7c3aed] hover:bg-purple-100 hover:text-[#7c3aed]"
                      onClick={() => document.getElementById('ai-chat')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Chat Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-[#059669] to-[#10b981] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">OpenPose Analysis</CardTitle>
                  <CardDescription className="text-green-100">Real-time movement tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Camera className="mr-2 h-5 w-5 text-green-200" />
                      <span>Start session</span>
                    </div>
                    <Link href="/pose-estimation">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white text-[#059669] hover:bg-green-100 hover:text-[#059669]"
                      >
                        Launch
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Chat Recommendations */}
              <motion.div
                id="ai-chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Bot className="mr-2 h-5 w-5 text-[#7c3aed]" />
                        <CardTitle>AI Rehabilitation Assistant</CardTitle>
                      </div>
                      <Badge variant="secondary" className="bg-[#7c3aed]/10 text-[#7c3aed]">
                        Online
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`mb-3 flex ${
                            msg.type === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.type === 'user'
                                ? 'bg-[#014585] text-white'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start mb-3">
                          <div className="bg-white border border-gray-200 p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask about your rehabilitation progress..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={sendChatMessage}
                        disabled={!chatInput.trim() || isTyping}
                        className="bg-[#7c3aed] hover:bg-[#6d28d9]"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* OpenPose Simulation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Camera className="mr-2 h-5 w-5 text-[#059669]" />
                        <CardTitle>OpenPose Movement Analysis</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={poseActive ? "default" : "secondary"}
                          className={poseActive ? "bg-green-500" : ""}
                        >
                          {poseActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={resetPoseMetrics}
                          disabled={poseActive}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Video Upload Section */}
                    <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        {!uploadedVideo ? (
                          <div>
                            <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Exercise Video</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Upload a video of your exercise routine for AI-powered movement analysis
                            </p>
                            <Button
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-[#059669] hover:bg-[#047857]"
                            >
                              Choose Video File
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-center mb-4">
                              <FileText className="h-8 w-8 text-green-500 mr-2" />
                              <span className="text-sm font-medium">{uploadedVideo.name}</span>
                            </div>
                            {uploadProgress < 100 && (
                              <div className="mb-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Uploading... {Math.round(uploadProgress)}%</p>
                              </div>
                            )}
                            <div className="flex space-x-2 justify-center">
                              <Button
                                onClick={startVideoAnalysis}
                                disabled={uploadProgress < 100 || isAnalyzing}
                                className="bg-[#059669] hover:bg-[#047857]"
                              >
                                {isAnalyzing ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Analyze Video
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={clearVideoUpload}
                                variant="outline"
                                disabled={isAnalyzing}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Analysis Results */}
                    {analysisResults && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Award className="h-5 w-5 text-green-500 mr-2" />
                          Analysis Results
                        </h3>
                        
                        {/* Overall Score */}
                        <div className="mb-4 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {analysisResults.overallScore}/100
                          </div>
                          <p className="text-sm text-gray-600">Overall Movement Score</p>
                        </div>

                        {/* Key Points Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {analysisResults.keyPoints.map((point, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                              <span className="text-sm font-medium">{point.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold">{point.score}%</span>
                                <Badge
                                  variant={point.status === 'excellent' ? 'default' : 
                                         point.status === 'good' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {point.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Exercise Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-white rounded">
                            <div className="text-lg font-bold text-blue-600">{analysisResults.exerciseCount}</div>
                            <div className="text-xs text-gray-600">Exercises</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded">
                            <div className="text-lg font-bold text-purple-600">{analysisResults.duration}</div>
                            <div className="text-xs text-gray-600">Duration</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded">
                            <div className="text-lg font-bold text-orange-600">{analysisResults.caloriesBurned}</div>
                            <div className="text-xs text-gray-600">Calories</div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-medium mb-2 text-gray-800">Recommendations:</h4>
                          <ul className="space-y-1">
                            {analysisResults.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Video Feed */}
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden h-48">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          className="w-full h-full object-cover"
                        />
                        <canvas
                          ref={canvasRef}
                          className="absolute top-0 left-0 w-full h-full"
                        />
                        {!poseActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                            <div className="text-center text-white">
                              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Camera feed will appear here</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 text-[#059669] mr-2" />
                            <span className="text-sm font-medium">Accuracy</span>
                          </div>
                          <span className="text-lg font-bold text-[#059669]">
                            {Math.round(poseMetrics.accuracy)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium">Reps</span>
                          </div>
                          <span className="text-lg font-bold text-blue-500">
                            {poseMetrics.reps}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-amber-500 mr-2" />
                            <span className="text-sm font-medium">Form</span>
                          </div>
                          <Badge
                            variant={poseMetrics.form === 'Excellent' ? 'default' : 
                                   poseMetrics.form === 'Good' ? 'secondary' : 'destructive'}
                          >
                            {poseMetrics.form}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-orange-500 mr-2" />
                            <span className="text-sm font-medium">Calories</span>
                          </div>
                          <span className="text-lg font-bold text-orange-500">
                            {Math.round(poseMetrics.calories)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                      {!poseActive ? (
                        <Button
                          onClick={startPoseDetection}
                          className="bg-[#059669] hover:bg-[#047857]"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Analysis
                        </Button>
                      ) : (
                        <Button
                          onClick={stopPoseDetection}
                          variant="destructive"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Stop Analysis
                        </Button>
                      )}
                      <Link href="/pose-estimation">
                        <Button variant="outline">
                          <SettingsIcon className="h-4 w-4 mr-2" />
                          Advanced Mode
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <Link href="/appointments">
                        <Button variant="ghost" className="h-8 text-[#014585]">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <Link key={appointment.id} href="/appointments">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                              <div className="flex items-center">
                                <div className="relative w-10 h-10 mr-3">
                                  <Image
                                    src={appointment.therapistImage || "/placeholder.svg"}
                                    alt={appointment.therapistName}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">{appointment.therapistName}</h3>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    <span className="mr-2">{appointment.date}</span>
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="mr-4 text-right">
                                  <span className="text-sm text-gray-600">{appointment.type}</span>
                                  <div className="flex items-center justify-end">
                                    {appointment.status === "confirmed" ? (
                                      <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                    ) : (
                                      <AlertCircle className="w-3 h-3 text-amber-500 mr-1" />
                                    )}
                                    <span
                                      className={`text-xs ${
                                        appointment.status === "confirmed" ? "text-green-500" : "text-amber-500"
                                      }`}
                                    >
                                      {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No upcoming appointments</p>
                        <Link href="/appointments/schedule">
                          <Button className="mt-2 bg-[#014585] hover:bg-[#013a70]">Schedule Now</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Exercises */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Exercises</CardTitle>
                      <Link href="/exercises">
                        <Button variant="ghost" className="h-8 text-[#014585]">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentExercises.map((exercise) => (
                        <Link key={exercise.id} href="/exercises">
                          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                              <span className="text-sm text-gray-500">{exercise.lastPerformed}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className="mr-3">{exercise.duration}</span>
                                <span>
                                  {exercise.sets} sets × {exercise.reps} reps
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#014585] h-2 rounded-full"
                                style={{ width: `${exercise.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs font-medium">{exercise.progress}%</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Video Call Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Video className="mr-2 h-5 w-5 text-[#014585]" />
                        <CardTitle>Video Consultation</CardTitle>
                      </div>
                      <Badge
                        variant={isVideoCallActive ? "default" : "secondary"}
                        className={isVideoCallActive ? "bg-green-500" : ""}
                      >
                        {isVideoCallActive ? "In Call" : "Available"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden h-40 mb-4">
                      {isVideoCallActive ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                          <div className="text-center text-white">
                            <Video className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm font-medium">Connected to Dr. Budi Santoso</p>
                            <p className="text-xs opacity-75">Call duration: 00:05:23</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <div className="text-center text-gray-400">
                            <VideoOff className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Video call not active</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {isVideoCallActive ? (
                      <div className="space-y-3">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant={isMuted ? "destructive" : "outline"}
                            onClick={toggleMute}
                          >
                            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant={!isVideoOn ? "destructive" : "outline"}
                            onClick={toggleVideo}
                          >
                            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={endVideoCall}
                          >
                            <PhoneOff className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Dr. Budi Santoso - Physical Therapist</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          onClick={startVideoCall}
                          className="w-full bg-[#014585] hover:bg-[#013a75]"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Start Video Call
                        </Button>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Next appointment: Today 2:30 PM</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              {/* Progress Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Progress Summary</CardTitle>
                      <Link href="/progress">
                        <Button variant="ghost" className="h-8 text-[#014585]">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {progressMetrics.map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                            <div className="flex items-center">
                              <span className="text-xl font-semibold mr-1">
                                {metric.current}
                                {metric.unit}
                              </span>
                              <span className="text-xs text-gray-500">/ {metric.target + metric.unit} target</span>
                            </div>
                          </div>
                          <div
                            className={`flex items-center ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
                          >
                            <span className="text-lg font-medium">{metric.change}</span>
                            <ArrowRight
                              className={`h-4 w-4 ml-1 ${metric.trend === "up" ? "rotate-[-45deg]" : "rotate-45deg"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Messages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Messages</CardTitle>
                      <Link href="/messages">
                        <Button variant="ghost" className="h-8 text-[#014585]">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <Link href="/messages" key={message.id}>
                            <div
                              className={`p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${
                                message.unread ? "bg-blue-50 border-l-2 border-[#014585]" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="relative w-8 h-8 mr-2">
                                    <Image
                                      src={message.senderImage || "/placeholder.svg"}
                                      alt={message.sender}
                                      fill
                                      className="rounded-full object-cover"
                                    />
                                  </div>
                                  <h3 className="font-medium text-gray-900">{message.sender}</h3>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-500 mr-2">{message.time}</span>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No messages</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link href="/video-library/exercise-demos">
                        <Button
                          variant="outline"
                          className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                        >
                          Exercise Demonstrations
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/progress/reports">
                        <Button
                          variant="outline"
                          className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                        >
                          Progress Reports
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/profile/billing">
                        <Button
                          variant="outline"
                          className="w-full justify-between text-[#014585] hover:text-[#013a70]"
                        >
                          Billing & Insurance
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
