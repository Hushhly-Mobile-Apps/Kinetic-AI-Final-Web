"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  Dumbbell,
  Zap,
  Move,
  Download,
  Share2,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useProgress } from "@/hooks/use-api"
import { useToast } from "@/components/ui/use-toast"

export default function ProgressPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  
  // Fetch progress data using API
  const { data: progressData, loading, error, refetch } = useProgress(user?.id, selectedTimeframe)

  // Handle data refresh
  const handleRefresh = () => {
    refetch()
    toast({
      title: "Data Refreshed",
      description: "Your progress data has been updated.",
    })
  }
  
  // Handle timeframe change
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe)
    // This will trigger a re-fetch with new timeframe
  }
  
  // Handle goal update
  const handleGoalUpdate = (newGoal: number) => {
    // In a real app, this would call an API to update the goal
    toast({
      title: "Goal Updated",
      description: `Your weekly goal has been set to ${newGoal}%.`,
    })
  }
  
  // Handle export data
  const handleExportData = () => {
    // In a real app, this would generate and download a report
    toast({
      title: "Export Started",
      description: "Your progress report is being generated...",
    })
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your progress report has been downloaded.",
      })
    }, 2000)
  }
  
  // Use API data or fallback to mock data
  const recoverySummary = progressData?.summary || [
    {
      id: 1,
      title: "Overall Progress",
      value: "72% complete",
      icon: <Activity className="h-5 w-5 text-white" />,
      iconBg: "bg-green-500",
      action: "View Details",
    },
    {
      id: 2,
      title: "Pain Level",
      value: "Reduced by 65% since start",
      icon: <Zap className="h-5 w-5 text-white" />,
      iconBg: "bg-orange-400",
      action: "Track History",
    },
    {
      id: 3,
      title: "Mobility",
      value: "Improved 48% in last 30 days",
      icon: <Move className="h-5 w-5 text-white" />,
      iconBg: "bg-purple-500",
      action: "See Metrics",
    },
    {
      id: 4,
      title: "Strength",
      value: "Increased by 35% overall",
      icon: <Dumbbell className="h-5 w-5 text-white" />,
      iconBg: "bg-blue-400",
      action: "View Tests",
    },
  ]

  // Mock data for weekly activity
  const weeklyActivity = [
    {
      day: "Monday",
      exercise: "Knee Exercises",
      status: "Completed",
      difficulty: "8/10 difficulty",
      duration: "20 minutes",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      day: "Tuesday",
      exercise: "Stretching Routine",
      status: "Completed",
      difficulty: "6/10 difficulty",
      duration: "15 minutes",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      day: "Wednesday",
      exercise: "Strength Training",
      status: "Completed",
      difficulty: "9/10 difficulty",
      duration: "25 minutes",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      day: "Thursday",
      exercise: "Balance Exercises",
      status: "Missed",
      difficulty: "7/10 difficulty",
      duration: "15 minutes",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    {
      day: "Friday",
      exercise: "Mobility Routine",
      status: "Upcoming",
      difficulty: "5/10 difficulty",
      duration: "20 minutes",
      icon: <Clock className="h-5 w-5 text-gray-500" />,
    },
  ]

  // Mock data for therapist feedback
  const therapistFeedback = [
    {
      id: 1,
      name: "Dr. Sarah Miller",
      avatar: "/caring-doctor.png",
      feedback: "Great improvement on knee extension. Keep focusing on form.",
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      avatar: "/athletic-man-short-hair.png",
      feedback: "Your strength metrics are improving steadily. Let's increase resistance next week.",
    },
  ]

  // Mock data for goals and milestones
  const goalsAndMilestones = [
    {
      id: 1,
      title: "Walk 1 mile without assistance",
      target: "Target: July 15 - Currently at 75%",
      icon: <Flag className="h-5 w-5 text-blue-500" />,
      completed: false,
    },
    {
      id: 2,
      title: "Return to light sports activities",
      target: "Target: August 30 - Currently at 45%",
      icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
      completed: false,
    },
    {
      id: 3,
      title: "Reduce pain medication",
      target: "Target: July 1 - Completed!",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      completed: true,
    },
  ]

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={40} height={40} />
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
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
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] mb-2">Progress</h1>
              <p className="text-gray-500">Track your rehabilitation journey and achievements</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <Link href="/dashboard" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Overview
            </Link>
            <Link href="/exercises" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Exercises
            </Link>
            <Link href="/appointments" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Appointments
            </Link>
            <Link href="/messages" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Messages
            </Link>
            <Link
              href="/progress"
              className="pb-2 px-1 mr-6 text-sm font-medium text-gray-900 border-b-2 border-[#014585]"
            >
              Progress
            </Link>
            <Link
              href="/video-library"
              className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              My Submissions
            </Link>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex space-x-1">
              {['week', 'month', 'quarter', 'year'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => handleTimeframeChange(timeframe)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading progress data...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Error loading progress data: {error}</p>
              <Button onClick={refetch}>Try Again</Button>
            </div>
          )}
          
          {/* Recovery Summary */}
          {!loading && !error && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Recovery Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recoverySummary.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center mr-3`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.value}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#014585] text-[#014585] hover:bg-[#014585] hover:text-white"
                  >
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Weekly Activity</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Day
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Exercise
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Difficulty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Duration
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weeklyActivity.map((activity, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{activity.day}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.exercise}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activity.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "Missed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.difficulty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">{activity.icon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Therapist Feedback */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Therapist Feedback</h2>
            <div className="space-y-4">
              {therapistFeedback.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <Image
                        src={feedback.avatar || "/placeholder.svg"}
                        alt={feedback.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{feedback.name}</h3>
                      <p className="text-sm text-gray-500">{feedback.feedback}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Goals & Milestones */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Goals & Milestones</h2>
            <div className="space-y-4">
              {goalsAndMilestones.map((goal) => (
                <div key={goal.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{goal.title}</h3>
                      <p className="text-sm text-gray-500">{goal.target}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button className="bg-[#014585] hover:bg-[#013a70]" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" /> Download Progress Report
            </Button>
            <Button variant="outline" className="border-[#014585] text-[#014585] hover:bg-[#014585] hover:text-white">
              <Share2 className="mr-2 h-4 w-4" /> Share with Therapist
            </Button>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
