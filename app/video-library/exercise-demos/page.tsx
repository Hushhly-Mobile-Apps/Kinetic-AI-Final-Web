"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Search,
  Filter,
  Play,
  Download,
  ListPlus,
  MessageCircle,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ExerciseDemosPage() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for categories
  const categories = [
    {
      id: "lower-body",
      title: "Lower Body",
      description: "Knee, hip, and ankle rehabilitation exercises",
      count: 24,
      color: "green",
    },
    {
      id: "upper-body",
      title: "Upper Body",
      description: "Shoulder, elbow, and wrist rehabilitation exercises",
      count: 18,
      color: "orange",
    },
    {
      id: "core-back",
      title: "Core & Back",
      description: "Spine, abdominal, and posture exercises",
      count: 15,
      color: "purple",
    },
    {
      id: "balance",
      title: "Balance",
      description: "Stability and proprioception training exercises",
      count: 12,
      color: "blue",
    },
  ]

  // Mock data for recommended videos
  const recommendedVideos = [
    {
      id: "seated-leg-raises",
      title: "Seated Leg Raises",
      category: "Lower Body",
      difficulty: "Beginner",
      duration: "2:15",
      views: 1245,
    },
    {
      id: "shoulder-mobility",
      title: "Shoulder Mobility",
      category: "Upper Body",
      difficulty: "Intermediate",
      duration: "3:42",
      views: 987,
    },
    {
      id: "core-stabilization",
      title: "Core Stabilization",
      category: "Core & Back",
      difficulty: "Beginner",
      duration: "4:10",
      views: 856,
    },
  ]

  // Mock data for popular videos
  const popularVideos = [
    {
      id: "hamstring-stretch",
      title: "Hamstring Stretch",
      category: "Lower Body",
      difficulty: "Beginner",
      duration: "1:45",
      views: 2187,
    },
    {
      id: "wall-slides",
      title: "Wall Slides",
      category: "Upper Body",
      difficulty: "Beginner",
      duration: "2:15",
      views: 1845,
    },
    {
      id: "bird-dog",
      title: "Bird Dog",
      category: "Core & Back",
      difficulty: "Beginner",
      duration: "2:45",
      views: 1789,
    },
    {
      id: "single-leg-stand",
      title: "Single Leg Stand",
      category: "Balance",
      difficulty: "Beginner",
      duration: "2:30",
      views: 1765,
    },
  ]

  // Mock data for recently added videos
  const recentlyAddedVideos = [
    {
      id: "ankle-circles",
      title: "Ankle Circles",
      category: "Lower Body",
      difficulty: "Beginner",
      duration: "1:30",
      views: 756,
      date: "2 days ago",
    },
    {
      id: "wrist-flexion-extension",
      title: "Wrist Flexion/Extension",
      category: "Upper Body",
      difficulty: "Beginner",
      duration: "1:50",
      views: 723,
      date: "3 days ago",
    },
    {
      id: "pelvic-tilts",
      title: "Pelvic Tilts",
      category: "Core & Back",
      difficulty: "Beginner",
      duration: "1:55",
      views: 654,
      date: "5 days ago",
    },
    {
      id: "tandem-stance",
      title: "Tandem Stance",
      category: "Balance",
      difficulty: "Beginner",
      duration: "1:45",
      views: 543,
      date: "1 week ago",
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Exercise Demonstrations</h1>
              <p className="text-gray-500">Browse and search through our library of rehabilitation exercises</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search exercises..."
                  className="pl-10 py-2 bg-white border-gray-200 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Link href={`/video-library/exercise-demos/category/${category.id}`} key={index}>
                  <div
                    className={`bg-white rounded-lg shadow-sm p-5 border-l-4 border-${category.color}-500 hover:shadow-md transition-shadow`}
                  >
                    <h3 className="font-semibold text-[#111827] mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">{category.count} exercises</span>
                      <Button variant="ghost" size="sm" className="text-[#014585] hover:text-[#013a70] p-0">
                        View All
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended for You */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedVideos.map((video, index) => (
                <Link href={`/video-library/exercise-demos/detail/${video.id}`} key={index}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Play className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#111827] mb-1">{video.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-3">{video.category}</span>
                        <span className="mr-3">•</span>
                        <span>{video.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">{video.views} views</span>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ListPlus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Exercises */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Popular Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularVideos.map((video, index) => (
                <Link href={`/video-library/exercise-demos/detail/${video.id}`} key={index}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Play className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-[#111827] text-sm mb-1">{video.title}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{video.category}</span>
                        <span className="mx-1">•</span>
                        <span>{video.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{video.views} views</span>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="h-3 w-3" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ListPlus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recently Added */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Recently Added</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {recentlyAddedVideos.map((video, index) => (
                <Link href={`/video-library/exercise-demos/detail/${video.id}`} key={index}>
                  <div
                    className={`flex items-center p-4 hover:bg-gray-50 ${
                      index < recentlyAddedVideos.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="relative w-24 h-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                      <Play className="h-6 w-6 text-gray-400" />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#111827]">{video.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">{video.category}</span>
                        <span className="mr-2">•</span>
                        <span>{video.difficulty}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">{video.views} views</div>
                      <div className="text-xs text-gray-400">Added {video.date}</div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ListPlus className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
