"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Play, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { exerciseCategories, getExercisesByCategory, type Exercise } from "@/lib/exercise-data"

export default function ExerciseCategoryPage({ params }: { params: { category: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [category, setCategory] = useState<any>(null)

  useEffect(() => {
    const categoryData = exerciseCategories.find((c) => c.id === params.category)
    setCategory(categoryData)

    const exercisesData = getExercisesByCategory(params.category)
    setExercises(exercisesData)
    setFilteredExercises(exercisesData)
  }, [params.category])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExercises(exercises)
    } else {
      const filtered = exercises.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.targetAreas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredExercises(filtered)
    }
  }, [searchQuery, exercises])

  if (!category) {
    return (
      <DashboardLayout activeLink="exercises">
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    )
  }

  // Randomly assign completed status to exercises for demo purposes
  const exercisesWithStatus = filteredExercises.map((exercise) => ({
    ...exercise,
    completed: Math.random() > 0.7,
  }))

  return (
    <DashboardLayout activeLink="exercises">
      <div className="p-8">
        {/* Back button and title */}
        <div className="flex items-center mb-6">
          <Link href="/exercises" className="mr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">{category.name}</h1>
            <p className="text-gray-500">{category.description}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`Search ${category.name.toLowerCase()} exercises...`}
            className="pl-10 py-2 bg-white border-gray-200 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Exercise List */}
        <div className="space-y-4 mb-8">
          {exercisesWithStatus.length > 0 ? (
            exercisesWithStatus.map((exercise, index) => (
              <div key={exercise.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start md:items-center mb-4 md:mb-0">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <Image
                        src={exercise.imageUrl || "/placeholder.svg?height=64&width=64&query=exercise"}
                        alt={exercise.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium mr-2">{exercise.name}</h3>
                        {exercise.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {exercise.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Target: {exercise.targetAreas.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Play className="h-3 w-3 mr-1" /> Watch Demo
                    </Button>
                    <Link href={`/exercises/detail/${exercise.id}`}>
                      <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                        Start Exercise
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 my-8">No exercises found matching your search criteria.</p>
          )}
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {exercisesWithStatus.filter((e) => e.completed).length}/{exercisesWithStatus.length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Consistency</p>
              <p className="text-2xl font-bold text-blue-600">85%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Form Quality</p>
              <p className="text-2xl font-bold text-purple-600">Good</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
