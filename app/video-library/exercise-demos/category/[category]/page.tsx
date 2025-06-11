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
  ArrowLeft,
  Play,
  Filter,
  Bookmark,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function CategoryExercisesPage({ params }: { params: { category: string } }) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Decode the category from URL
  const categoryName = decodeURIComponent(params.category.replace(/-/g, " "))

  // Mock data for exercises based on category
  const getCategoryData = () => {
    switch (categoryName.toLowerCase()) {
      case "lower body":
        return {
          title: "Lower Body",
          description: "Knee, hip, and ankle rehabilitation exercises",
          color: "green",
          exercises: [
            {
              id: "seated-leg-raises",
              title: "Seated Leg Raises",
              difficulty: "Beginner",
              duration: "2:15",
              views: 1245,
              description: "Strengthen quadriceps with minimal knee stress",
            },
            {
              id: "hamstring-stretch",
              title: "Hamstring Stretch",
              difficulty: "Beginner",
              duration: "1:45",
              views: 987,
              description: "Improve flexibility in the back of the thigh",
            },
            {
              id: "ankle-circles",
              title: "Ankle Circles",
              difficulty: "Beginner",
              duration: "1:30",
              views: 756,
              description: "Increase ankle mobility and circulation",
            },
            {
              id: "standing-calf-raises",
              title: "Standing Calf Raises",
              difficulty: "Beginner",
              duration: "2:00",
              views: 689,
              description: "Strengthen calf muscles for better stability",
            },
            {
              id: "hip-abduction",
              title: "Hip Abduction",
              difficulty: "Intermediate",
              duration: "2:30",
              views: 542,
              description: "Strengthen hip abductors for lateral stability",
            },
            {
              id: "wall-squats",
              title: "Wall Squats",
              difficulty: "Intermediate",
              duration: "3:15",
              views: 478,
              description: "Build quad strength with support",
            },
          ],
        }
      case "upper body":
        return {
          title: "Upper Body",
          description: "Shoulder, elbow, and wrist rehabilitation exercises",
          color: "orange",
          exercises: [
            {
              id: "shoulder-mobility",
              title: "Shoulder Mobility",
              difficulty: "Intermediate",
              duration: "3:42",
              views: 987,
              description: "Improve range of motion in the shoulder joint",
            },
            {
              id: "wall-slides",
              title: "Wall Slides",
              difficulty: "Beginner",
              duration: "2:15",
              views: 845,
              description: "Enhance shoulder mobility and posture",
            },
            {
              id: "wrist-flexion-extension",
              title: "Wrist Flexion/Extension",
              difficulty: "Beginner",
              duration: "1:50",
              views: 723,
              description: "Increase wrist mobility and strength",
            },
            {
              id: "rotator-cuff-exercises",
              title: "Rotator Cuff Exercises",
              difficulty: "Intermediate",
              duration: "4:10",
              views: 612,
              description: "Strengthen the muscles that stabilize the shoulder",
            },
          ],
        }
      case "core & back":
        return {
          title: "Core & Back",
          description: "Spine, abdominal, and posture exercises",
          color: "purple",
          exercises: [
            {
              id: "core-stabilization",
              title: "Core Stabilization",
              difficulty: "Beginner",
              duration: "4:10",
              views: 856,
              description: "Strengthen deep core muscles for better stability",
            },
            {
              id: "bird-dog",
              title: "Bird Dog",
              difficulty: "Beginner",
              duration: "2:45",
              views: 789,
              description: "Improve core stability and coordination",
            },
            {
              id: "pelvic-tilts",
              title: "Pelvic Tilts",
              difficulty: "Beginner",
              duration: "1:55",
              views: 654,
              description: "Relieve lower back tension and strengthen core",
            },
            {
              id: "modified-planks",
              title: "Modified Planks",
              difficulty: "Beginner",
              duration: "3:20",
              views: 587,
              description: "Build core strength with proper alignment",
            },
          ],
        }
      case "balance":
        return {
          title: "Balance",
          description: "Stability and proprioception training exercises",
          color: "blue",
          exercises: [
            {
              id: "single-leg-stand",
              title: "Single Leg Stand",
              difficulty: "Beginner",
              duration: "2:30",
              views: 765,
              description: "Improve balance and stability on one leg",
            },
            {
              id: "balance-board",
              title: "Balance Board",
              difficulty: "Advanced",
              duration: "3:15",
              views: 635,
              description: "Challenge balance with unstable surface",
            },
            {
              id: "tandem-stance",
              title: "Tandem Stance",
              difficulty: "Beginner",
              duration: "1:45",
              views: 543,
              description: "Enhance balance with heel-to-toe positioning",
            },
            {
              id: "dynamic-balance-exercises",
              title: "Dynamic Balance Exercises",
              difficulty: "Intermediate",
              duration: "4:00",
              views: 487,
              description: "Improve balance during movement",
            },
          ],
        }
      default:
        return {
          title: categoryName,
          description: "Exercise program",
          color: "blue",
          exercises: [],
        }
    }
  }

  const categoryData = getCategoryData()

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
          {/* Back button and title */}
          <div className="flex items-center mb-6">
            <Link href="/video-library/exercise-demos" className="mr-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{categoryData.title}</h1>
              <p className="text-gray-500">{categoryData.description}</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search ${categoryData.title.toLowerCase()} exercises...`}
                className="pl-10 py-2 bg-white border-gray-200 rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Exercise List */}
          <div className="space-y-4 mb-8">
            {categoryData.exercises.map((exercise, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-${categoryData.color}-100 mr-4`}
                    >
                      <Play className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <Link href={`/video-library/exercise-demos/detail/${exercise.id}`}>
                        <h3 className="font-medium hover:text-[#014585]">{exercise.title}</h3>
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-3">{exercise.difficulty}</span>
                        <span className="mr-3">{exercise.duration}</span>
                        <span>{exercise.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button className="bg-[#014585] hover:bg-[#013a70] mr-2 flex items-center gap-1">
                      <Play className="h-3 w-3" /> Watch Demo
                    </Button>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Bookmark className="h-3 w-3" /> Save
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 ml-14">{exercise.description}</p>
              </div>
            ))}
          </div>

          {/* Recommended Combinations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Recommended Exercise Combinations</h2>
            <p className="text-gray-600 mb-4">
              These exercise combinations are designed to provide a comprehensive rehabilitation program for{" "}
              {categoryData.title.toLowerCase()} issues.
            </p>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium mb-2">Beginner {categoryData.title} Routine</h3>
                <p className="text-sm text-gray-600 mb-3">
                  A gentle introduction to {categoryData.title.toLowerCase()} rehabilitation
                </p>
                <Button className="bg-[#014585] hover:bg-[#013a70]">View Routine</Button>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium mb-2">Intermediate {categoryData.title} Progression</h3>
                <p className="text-sm text-gray-600 mb-3">
                  For those who have mastered the basics and are ready for more challenge
                </p>
                <Button className="bg-[#014585] hover:bg-[#013a70]">View Routine</Button>
              </div>
              {categoryData.exercises.length > 5 && (
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium mb-2">Advanced {categoryData.title} Program</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Challenging exercises for those in later stages of rehabilitation
                  </p>
                  <Button className="bg-[#014585] hover:bg-[#013a70]">View Routine</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
