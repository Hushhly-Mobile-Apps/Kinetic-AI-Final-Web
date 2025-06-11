"use client"

import { useState } from "react"
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
  ArrowLeft,
  CheckCircle,
  Clock,
  LogOut,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"

export default function TodaysRoutinePage() {
  const { user, logout } = useAuth()
  const [routineProgress, setRoutineProgress] = useState(33)

  // Mock data for today's routine
  const routineData = {
    title: "Today's Routine",
    description: "Shoulder and Upper Body Mobility",
    totalExercises: 6,
    completedExercises: 2,
    estimatedTime: "25 min",
    exercises: [
      {
        id: "shoulder-rotation",
        name: "Shoulder Rotation",
        sets: 3,
        reps: 10,
        status: "pending", // pending, completed, skipped
        difficulty: "Moderate",
      },
      {
        id: "shoulder-flexion",
        name: "Shoulder Flexion",
        sets: 3,
        reps: 12,
        status: "completed",
        difficulty: "Easy",
      },
      {
        id: "wall-slides",
        name: "Wall Slides",
        sets: 2,
        reps: 15,
        status: "completed",
        difficulty: "Moderate",
      },
      {
        id: "doorway-stretch",
        name: "Doorway Stretch",
        sets: 3,
        reps: 8,
        status: "pending",
        difficulty: "Easy",
      },
      {
        id: "scapular-retraction",
        name: "Scapular Retraction",
        sets: 3,
        reps: 10,
        status: "pending",
        difficulty: "Moderate",
      },
      {
        id: "neck-stretches",
        name: "Neck Stretches",
        sets: 2,
        reps: 10,
        status: "pending",
        difficulty: "Easy",
      },
    ],
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
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
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
          {/* Back button and title */}
          <div className="flex items-center mb-6">
            <Link href="/exercises" className="mr-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{routineData.title}</h1>
              <p className="text-gray-500">{routineData.description}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Routine Progress</h2>
              <span className="text-sm text-gray-500">
                {routineData.completedExercises}/{routineData.totalExercises} exercises completed
              </span>
            </div>
            <Progress value={routineProgress} className="h-2 mb-4" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated time: {routineData.estimatedTime}</span>
              <span className="text-[#014585] font-medium">{routineProgress}% complete</span>
            </div>
          </div>

          {/* Exercise List */}
          <h2 className="text-xl font-semibold text-[#111827] mb-4">Exercises</h2>
          <div className="space-y-4 mb-8">
            {routineData.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm p-4 ${
                  exercise.status === "completed" ? "border-l-4 border-green-500" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                        exercise.status === "completed"
                          ? "bg-green-100"
                          : exercise.status === "skipped"
                            ? "bg-gray-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {exercise.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-gray-500">
                        {exercise.sets} sets x {exercise.reps} reps • {exercise.difficulty}
                      </p>
                    </div>
                  </div>
                  <div>
                    {exercise.status === "completed" ? (
                      <span className="text-green-600 text-sm font-medium">Completed</span>
                    ) : (
                      <Link href={`/exercises/detail/${exercise.id}`}>
                        <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                          Start
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button className="bg-[#014585] hover:bg-[#013a70]">Complete All Remaining</Button>
            <Button variant="outline">Reschedule Routine</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
