"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Play,
  Pause,
  VolumeX,
  Volume2,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Mock exercise data based on ID
  const getExerciseData = () => {
    // In a real app, this would fetch data from an API
    return {
      id: params.id,
      title: "Seated Leg Raises",
      category: "Lower Body",
      difficulty: "Beginner",
      duration: "2:15",
      views: 1245,
      description:
        "This exercise helps strengthen the quadriceps muscles while minimizing stress on the knee joint. It's particularly beneficial for individuals recovering from knee injuries or surgery.",
      instructions: [
        "Sit upright in a chair with your back straight and feet flat on the floor",
        "Slowly extend one leg until it's straight and parallel to the floor",
        "Hold for 3-5 seconds while contracting your thigh muscle",
        "Slowly lower your leg back to the starting position",
        "Repeat for the recommended number of repetitions, then switch to the other leg",
      ],
      tips: [
        "Keep your back straight against the chair throughout the exercise",
        "Avoid locking your knee at full extension",
        "Focus on controlled movements rather than speed",
        "If you experience pain (not discomfort), stop and consult your therapist",
      ],
      sets: "3 sets of 10 repetitions per leg",
      restTime: "30-60 seconds between sets",
      progression: "As strength improves, add ankle weights or resistance bands",
      relatedExercises: [
        { id: "leg-press", title: "Leg Press", difficulty: "Intermediate" },
        { id: "standing-hamstring-curl", title: "Standing Hamstring Curl", difficulty: "Beginner" },
        { id: "wall-slides", title: "Wall Slides", difficulty: "Beginner" },
      ],
    }
  }

  const exerciseData = getExerciseData()

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

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
            <Link href="/video-library/exercise-demos" className="hover:text-gray-700">
              Exercise Demos
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">{exerciseData.title}</span>
          </div>

          {/* Exercise Title */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{exerciseData.title}</h1>
              <p className="text-gray-500">
                {exerciseData.category} | {exerciseData.difficulty} | {exerciseData.views} views
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" /> Save
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="mb-8">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                poster="/placeholder-hx4x6.png"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button onClick={toggleMute} className="text-white">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-full p-4 backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
              </button>
            </div>
          </div>

          {/* Exercise Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-[#111827] mb-4">Description</h2>
              <p className="text-gray-700 mb-6">{exerciseData.description}</p>

              <h2 className="text-xl font-semibold text-[#111827] mb-4">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 mb-6">
                {exerciseData.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-700">
                    {instruction}
                  </li>
                ))}
              </ol>

              <h2 className="text-xl font-semibold text-[#111827] mb-4">Tips for Proper Form</h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                {exerciseData.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#111827] mb-4">Exercise Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Recommended Sets/Reps</h3>
                    <p className="text-gray-700">{exerciseData.sets}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rest Time</h3>
                    <p className="text-gray-700">{exerciseData.restTime}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Progression</h3>
                    <p className="text-gray-700">{exerciseData.progression}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-[#111827] mb-4">Related Exercises</h2>
                <div className="space-y-4">
                  {exerciseData.relatedExercises.map((exercise, index) => (
                    <Link href={`/video-library/exercise-demos/detail/${exercise.id}`} key={index}>
                      <div className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                          <Play className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{exercise.title}</h3>
                          <p className="text-sm text-gray-500">{exercise.difficulty}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Previous Exercise
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              Next Exercise <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
