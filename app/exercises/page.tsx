"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Activity, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { exerciseCategories, searchExercises, type Exercise } from "@/lib/exercise-data"

export default function ExerciseLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Exercise[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      const results = searchExercises(searchQuery)
      setSearchResults(results)
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  return (
    <DashboardLayout activeLink="exercises">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-1">Exercise Library</h1>
        <p className="text-gray-500 mb-6">Personalized Recovery Powered by Movement Intelligence</p>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <Link href="/dashboard" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
            Overview
          </Link>
          <Link
            href="/exercises"
            className="pb-2 px-1 mr-6 text-sm font-medium text-gray-900 border-b-2 border-[#014585]"
          >
            Exercises
          </Link>
          <Link href="/appointments" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
            Appointments
          </Link>
          <Link href="/messages" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
            Messages
          </Link>
          <Link href="/progress" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
            Progress
          </Link>
          <Link href="/video-library" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
            My Submissions
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search exercises..."
            className="pl-10 py-2 bg-white border-gray-200 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {isSearching ? (
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Search Results ({searchResults.length})</h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {searchResults.map((exercise) => (
                  <Link href={`/exercises/detail/${exercise.id}`} key={exercise.id}>
                    <div className="bg-white rounded-lg shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                      <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                        <Image
                          src={exercise.imageUrl || "/placeholder.svg?height=160&width=320&query=exercise"}
                          alt={exercise.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
                      <p className="text-gray-500 mb-2">Difficulty: {exercise.difficulty}</p>
                      <p className="text-gray-500 mb-4">Target: {exercise.targetAreas.join(", ")}</p>
                      <Button className="bg-[#014585] hover:bg-[#013a70]">View Details</Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 my-8">No exercises found matching your search criteria.</p>
            )}
            <button
              onClick={() => {
                setIsSearching(false)
                setSearchQuery("")
              }}
              className="mt-6 text-[#014585] hover:underline flex items-center mx-auto"
            >
              Back to Categories
            </button>
          </div>
        ) : (
          <>
            {/* Prescribed Categories */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#111827]">
                  Your Prescribed Categories{" "}
                  <span className="text-gray-500 font-normal">(Recommended by your therapist)</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Knee Rehabilitation */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Knee Rehabilitation</h3>
                  <p className="text-gray-500 mb-4">12 exercises tailored for your recovery</p>
                  <div className="relative h-32 w-full mb-4 rounded-md overflow-hidden">
                    <Image src="/wall-slide-exercise.png" alt="Knee Rehabilitation" fill className="object-cover" />
                  </div>
                  <Button className="bg-[#014585] hover:bg-[#013a70]">View Exercises</Button>
                </div>

                {/* Lower Back */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Lower Back</h3>
                  <p className="text-gray-500 mb-4">8 exercises to improve mobility</p>
                  <div className="relative h-32 w-full mb-4 rounded-md overflow-hidden">
                    <Image src="/bridge-exercise.png" alt="Lower Back Exercises" fill className="object-cover" />
                  </div>
                  <Button className="bg-[#014585] hover:bg-[#013a70]">View Exercises</Button>
                </div>

                {/* Posture Correction */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Posture Correction</h3>
                  <p className="text-gray-500 mb-4">5 exercises for better alignment</p>
                  <div className="relative h-32 w-full mb-4 rounded-md overflow-hidden">
                    <Image src="/bird-dog-exercise.png" alt="Posture Correction" fill className="object-cover" />
                  </div>
                  <Button className="bg-[#014585] hover:bg-[#013a70]">View Exercises</Button>
                </div>
              </div>
            </div>

            {/* Exercise Categories */}
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Exercise Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {exerciseCategories.slice(0, 6).map((category) => (
                <Link href={`/exercises/${category.id}`} key={category.id}>
                  <div className="bg-white rounded-lg shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-gray-500 mb-4">
                      {category.count} exercises | {Math.floor(Math.random() * 5) + 1} assigned to you
                    </p>
                    <div className="relative h-32 w-full mb-4 rounded-md overflow-hidden">
                      <Image
                        src={category.imageUrl || "/placeholder.svg?height=128&width=256&query=exercise"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button className="bg-[#014585] hover:bg-[#013a70]">View All</Button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
