"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Camera,
  FileVideo,
  LogOut,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"

export default function UploadPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [exerciseType, setExerciseType] = useState("")
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      router.push("/video-library/upload/progress")
    }, 1000)
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
            <span className="text-gray-700">Upload</span>
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-8">Upload Exercise Video</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
                <TabsTrigger value="record">Record Video</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-type">Exercise Type</Label>
                    <Select value={exerciseType} onValueChange={setExerciseType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="knee-extension">Knee Extension</SelectItem>
                        <SelectItem value="hamstring-curl">Hamstring Curl</SelectItem>
                        <SelectItem value="balance-training">Balance Training</SelectItem>
                        <SelectItem value="gait-training">Gait Training</SelectItem>
                        <SelectItem value="shoulder-exercise">Shoulder Exercise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      placeholder="E.g., Morning Knee Exercises - May 15"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-file">Upload Video</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {selectedFile ? (
                        <div className="space-y-2">
                          <FileVideo className="h-10 w-10 text-blue-500 mx-auto" />
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          <Button type="button" variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                          <p className="text-sm font-medium">Drag and drop your video file here</p>
                          <p className="text-xs text-gray-500">Or click to browse files</p>
                          <Input
                            id="video-file"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("video-file")?.click()}
                          >
                            Browse Files
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Supported formats: MP4, MOV, AVI. Maximum file size: 500MB</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes for Your Therapist (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about your exercise performance, pain levels, or questions"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Link href="/video-library">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className="bg-[#014585] hover:bg-[#013a70]"
                      disabled={!selectedFile || !exerciseType || !title || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span> Uploading...
                        </>
                      ) : (
                        <>Upload Video</>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="record">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-type-record">Exercise Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="knee-extension">Knee Extension</SelectItem>
                        <SelectItem value="hamstring-curl">Hamstring Curl</SelectItem>
                        <SelectItem value="balance-training">Balance Training</SelectItem>
                        <SelectItem value="gait-training">Gait Training</SelectItem>
                        <SelectItem value="shoulder-exercise">Shoulder Exercise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title-record">Video Title</Label>
                    <Input id="title-record" placeholder="E.g., Morning Knee Exercises - May 15" />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center aspect-video flex flex-col items-center justify-center">
                    <Camera className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Camera access required</p>
                    <p className="text-xs text-gray-500 mb-4">Please allow camera access to record your exercise</p>
                    <Button className="bg-[#014585] hover:bg-[#013a70]">Start Recording</Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes-record">Notes for Your Therapist (Optional)</Label>
                    <Textarea
                      id="notes-record"
                      placeholder="Add any notes about your exercise performance, pain levels, or questions"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">Tips for Better Analysis:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure good lighting in your recording area</li>
              <li>Position your camera to capture your full body during the exercise</li>
              <li>Wear clothing that makes it easy to see your movements</li>
              <li>Try to keep a neutral background without distractions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
