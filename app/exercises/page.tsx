"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Activity, User, Play, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VideoModal } from "@/components/video-modal"
import { exerciseCategories, searchExercises, type Exercise } from "@/lib/exercise-data"
import { useAuth } from "@/components/auth-provider"
import supabase from "@/lib/supabase-client"
import { toast } from "sonner"

// Extended Exercise type to include Supabase fields
type SupabaseExercise = Exercise & {
  id: string;
  target_area?: string;
  difficulty?: string;
  duration?: number;
  thumbnail_url?: string;
  video_url?: string;
  metadata?: any;
}

export default function ExercisesPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SupabaseExercise[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<SupabaseExercise | null>(null)
  const [exercises, setExercises] = useState<SupabaseExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [assignedExercises, setAssignedExercises] = useState<SupabaseExercise[]>([])
  
  // Load exercises from Supabase
  useEffect(() => {
    async function fetchExercises() {
      setLoading(true)
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .order('name')
        
        if (error) {
          console.error('Error fetching exercises:', error)
          // We'll still use the local data in this case
        } else if (data && data.length > 0) {
          // Convert Supabase data to our expected format
          const formattedExercises: SupabaseExercise[] = data.map(ex => ({
            id: ex.id,
            name: ex.name,
            description: ex.description,
            difficulty: ex.difficulty || 'Beginner',
            targetAreas: ex.target_area ? [ex.target_area] : ['General'],
            imageUrl: ex.thumbnail_url,
            videoUrl: ex.video_url,
            duration: ex.duration,
            sets: ex.metadata?.sets || 3,
            reps: ex.metadata?.total_reps || 10,
            target_area: ex.target_area,
            thumbnail_url: ex.thumbnail_url,
            metadata: ex.metadata
          }))
          
          setExercises(formattedExercises)
          
          // Get assigned exercises if user exists
          if (user) {
            const { data: assignedData, error: assignedError } = await supabase
              .from('user_exercises')
              .select('exercise_id')
              .eq('user_id', user.id)
              
            if (!assignedError && assignedData) {
              const assignedIds = assignedData.map(item => item.exercise_id)
              const assigned = formattedExercises.filter(ex => assignedIds.includes(ex.id))
              setAssignedExercises(assigned)
            }
          }
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [user])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // First try to search from Supabase-loaded exercises
      if (exercises.length > 0) {
        const results = exercises.filter(ex => 
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.target_area?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        if (results.length > 0) {
          setSearchResults(results)
          setIsSearching(true)
          return
        }
      }
      
      // Fallback to local search if no results from Supabase data
      const results = searchExercises(searchQuery) as SupabaseExercise[]
      setSearchResults(results)
      setIsSearching(true)
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  const handleWatchDemo = (exercise: SupabaseExercise) => {
    if (exercise.videoUrl || exercise.video_url) {
      setSelectedExercise(exercise)
      setIsVideoModalOpen(true)
    } else {
      toast.error("No demo video available for this exercise")
    }
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false)
    setSelectedExercise(null)
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
                  <div key={exercise.id} className="bg-white rounded-lg shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                    <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                      <Image
                        src={exercise.thumbnail_url || exercise.imageUrl || "/exercise-placeholder.jpg"}
                        alt={exercise.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
                    <p className="text-gray-500 mb-2">Difficulty: {exercise.difficulty}</p>
                    <p className="text-gray-500 mb-4">
                      Target: {exercise.target_area || (exercise.targetAreas && exercise.targetAreas.join(", "))}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleWatchDemo(exercise)
                        }}
                        disabled={!exercise.videoUrl && !exercise.video_url}
                      >
                        <Play className="h-3 w-3 mr-1" /> Demo
                      </Button>
                      <Link href={`/exercises/${exercise.id}`}>
                        <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">View Details</Button>
                      </Link>
                    </div>
                  </div>
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
                {loading && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <div className="h-3 w-3 rounded-full border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin mr-2"></div>
                    Loading your exercises...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {assignedExercises.length > 0 ? (
                  // Show assigned exercises if available
                  assignedExercises.slice(0, 3).map((exercise) => (
                    <Link href={`/exercises/${exercise.id}`} key={exercise.id}>
                      <div className="bg-white rounded-lg shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
                        <p className="text-gray-500 mb-4">
                          {exercise.target_area || exercise.targetAreas?.[0]} • {exercise.difficulty}
                        </p>
                        <div className="relative h-32 w-full mb-4 rounded-md overflow-hidden">
                          <Image 
                            src={exercise.thumbnail_url || exercise.imageUrl || "/exercise-placeholder.jpg"} 
                            alt={exercise.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <Button className="bg-[#014585] hover:bg-[#013a70]">View Exercise</Button>
                      </div>
                    </Link>
                  ))
                ) : (
                  // Show default categories if no assigned exercises
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Exercise Categories */}
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Exercise Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {loading ? (
                // Show skeleton loaders while loading
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 h-full">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-4 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4 animate-pulse"></div>
                    <div className="relative h-32 w-full mb-4 rounded-md bg-gray-200 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))
              ) : exercises.length > 0 ? (
                // Group exercises by target area to create categories
                Object.entries(
                  exercises.reduce((acc, exercise) => {
                    const area = exercise.target_area || (exercise.targetAreas?.[0] || 'General');
                    if (!acc[area]) {
                      acc[area] = [];
                    }
                    acc[area].push(exercise);
                    return acc;
                  }, {} as Record<string, SupabaseExercise[]>)
                )
                .slice(0, 6)
                .map(([area, areaExercises]) => {
                  // Get a random color for the category icon
                  const colors = ['blue', 'green', 'orange', 'purple', 'red', 'teal'];
                  const colorIndex = Math.floor(Math.random() * colors.length);
                  const color = colors[colorIndex];
                  
                  return (
                    <div key={area} className="bg-white rounded-lg shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${color}-100 mb-4`}>
                        <div className={`w-8 h-8 rounded-full bg-${color}-500 flex items-center justify-center`}>
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{area}</h3>
                      <p className="text-gray-500 mb-4">
                        {areaExercises.length} exercises available
                      </p>
                      <div className="relative h-32 w-full mb-4 rounded-md overflow-hidden">
                        <Image
                          src={areaExercises[0]?.thumbnail_url || areaExercises[0]?.imageUrl || "/exercise-placeholder.jpg"}
                          alt={area}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button 
                        className="bg-[#014585] hover:bg-[#013a70]"
                        onClick={() => {
                          setSearchQuery(area);
                          handleSearch(new Event('submit') as any);
                        }}
                      >
                        View All
                      </Button>
                    </div>
                  );
                })
              ) : (
                // Fallback to local data if no exercises from Supabase
                exerciseCategories.slice(0, 6).map((category) => (
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
                ))
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Video Modal */}
      {selectedExercise && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={handleCloseVideoModal}
          videoUrl={selectedExercise.video_url || selectedExercise.videoUrl || ""}
          title={selectedExercise.name}
        />
      )}
    </DashboardLayout>
  )
}
