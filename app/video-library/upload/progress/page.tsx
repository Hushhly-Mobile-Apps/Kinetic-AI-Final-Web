"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Upload,
  FileUp,
  Cog,
  Brain,
  Bell,
  Calendar,
  Film,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function UploadProgressPage() {
  const { user, logout } = useAuth()
  const [progress, setProgress] = useState(67)

  // Simulate progress increase
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

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
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/video-library"
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
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
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/dashboard" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/video-library" className="hover:text-gray-700">
              Video Library
            </Link>
            <span className="mx-2">›</span>
            <Link href="/video-library/upload" className="hover:text-gray-700">
              Upload
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Progress</span>
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-8">Uploading Video</h1>

          {/* Current Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mr-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Upload className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">Morning Knee Exercises - May 15</h2>
                <p className="text-gray-500 mb-4">
                  Your video is being uploaded and processed. Please don't close this window.
                </p>
                <Button variant="outline" className="bg-[#014585] text-white hover:bg-[#013a70]">
                  Cancel Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          <h2 className="text-xl font-semibold text-[#111827] mb-4">Upload Progress</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mr-4">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{progress}% Complete</h3>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <p className="text-sm text-gray-500">Uploading: knee_exercise_may15.mp4 (124MB of 185MB)</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <h2 className="text-xl font-semibold text-[#111827] mb-4">Next Steps</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                <FileUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Upload</h3>
                <p className="text-sm text-gray-500">Transferring video to secure servers (In progress)</p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4">
                <Cog className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium">Processing</h3>
                <p className="text-sm text-gray-500">Converting and optimizing your video</p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4">
                <Brain className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium">AI Analysis</h3>
                <p className="text-sm text-gray-500">Analyzing your exercise form and technique</p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4">
                <Bell className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium">Notification</h3>
                <p className="text-sm text-gray-500">You'll be notified when analysis is complete</p>
              </div>
            </div>
          </div>

          {/* While You Wait */}
          <h2 className="text-xl font-semibold text-[#111827] mb-4">While You Wait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">View Exercise Plan</h3>
              <p className="text-gray-500 mb-4">Check your upcoming exercises</p>
              <Button variant="outline" className="bg-[#014585] text-white hover:bg-[#013a70]">
                Open Plan
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Film className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Previous Videos</h3>
              <p className="text-gray-500 mb-4">Review your exercise history</p>
              <Link href="/video-library">
                <Button variant="outline" className="bg-[#014585] text-white hover:bg-[#013a70]">
                  View Library
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            You can safely navigate away from this page. Upload will continue in the background.
          </div>
        </div>
      </div>
    </div>
  )
}
