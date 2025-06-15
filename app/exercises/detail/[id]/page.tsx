"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Timer, CheckCircle, ChevronRight, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getExerciseById, type Exercise } from "@/lib/exercise-data"

export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [currentSet, setCurrentSet] = useState(1)
  const [currentRep, setCurrentRep] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [isSetStarted, setIsSetStarted] = useState(false)

  useEffect(() => {
    const exerciseData = getExerciseById(params.id)
    setExercise(exerciseData || null)
  }, [params.id])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleStartSet = () => {
    setIsSetStarted(true)
    setIsTimerRunning(true)
  }

  const handleCompleteRep = () => {
    if (currentRep < (exercise?.repetitions ? Number.parseInt(exercise.repetitions) : 10)) {
      setCurrentRep(currentRep + 1)
    }

    if (currentRep === (exercise?.repetitions ? Number.parseInt(exercise.repetitions) - 1 : 9)) {
      // Last rep of the set
      if (currentSet < (exercise?.sets ? Number.parseInt(exercise.sets) : 3)) {
        // Move to next set
        setCurrentSet(currentSet + 1)
        setCurrentRep(0)
        setIsSetStarted(false)
      } else {
        // Exercise complete
        setIsTimerRunning(false)
      }
    }
  }

  if (!exercise) {
    return (
      <DashboardLayout activeLink="exercises">
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeLink="exercises">
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/exercises" className="hover:text-gray-700">
            Exercises
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/exercises/${exercise.category}`} className="hover:text-gray-700">
            {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700">{exercise.name}</span>
        </div>

        {/* Exercise Title */}
        <h1 className="text-2xl font-bold text-[#111827] mb-2">{exercise.name}</h1>
        <p className="text-gray-500 mb-6">
          {exercise.sets} sets x {exercise.repetitions} reps | Difficulty: {exercise.difficulty}
        </p>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Exercise Video/Image */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mr-3">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">Exercise Demonstration</h2>
            </div>
            <p className="text-gray-500 mb-4">Watch the demonstration to ensure proper form</p>
            <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-4">
              <Image
                src={exercise.imageUrl || "/placeholder.svg?height=180&width=320&query=exercise"}
                alt={exercise.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Watch Video
            </Button>
          </div>

          {/* Current Set */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 mr-3">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold">
                Current Set: {currentSet}/{exercise.sets}
              </h2>
            </div>
            <p className="text-gray-500 mb-4">
              Reps: {currentRep}/{exercise.repetitions}
            </p>
            {isSetStarted ? (
              <Button className="w-full bg-[#014585] hover:bg-[#013a70]" onClick={handleCompleteRep}>
                Complete Rep
              </Button>
            ) : (
              <Button className="w-full bg-[#014585] hover:bg-[#013a70]" onClick={handleStartSet}>
                Start Set
              </Button>
            )}
          </div>

          {/* Timer */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mr-3">
                <Timer className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold">Timer</h2>
            </div>
            <div className="flex justify-center items-center h-20">
              <span className="text-3xl font-bold">{formatTime(time)}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <h2 className="text-xl font-semibold text-[#111827] mb-4">Instructions</h2>
        <div className="space-y-4 mb-8">
          {exercise.instructions.map((instruction, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#014585] text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <div>
                <p className="text-gray-700">{instruction}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <h2 className="text-xl font-semibold text-[#111827] mb-4">Benefits</h2>
        <div className="space-y-4 mb-8">
          {exercise.benefits.map((benefit, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  <CheckCircle className="h-5 w-5 text-[#014585]" />
                </div>
              </div>
              <div>
                <p className="text-gray-700">{benefit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Precautions */}
        {exercise.precautions && exercise.precautions.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-[#111827] mb-4">Precautions</h2>
            <div className="space-y-4 mb-8">
              {exercise.precautions.map((precaution, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
                      <CheckCircle className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700">{precaution}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button className="bg-[#014585] hover:bg-[#013a70]">Complete Exercise</Button>
          <Button variant="outline">Skip Exercise</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
