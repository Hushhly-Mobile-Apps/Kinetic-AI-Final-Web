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
  Plus,
  Eye,
  MoreVertical,
  Play,
  LogOut,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function VideoLibraryPage() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

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
            <span className="text-gray-700">Video Library</span>
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-6">Video Library</h1>

          {/* Tabs */}
          <Tabs defaultValue="my-submissions" className="mb-6">
            <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none p-0 h-auto">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="exercises"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Exercises
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="my-submissions"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-gray-500 hover:text-gray-700 data-[state=active]:border-[#7e58f4] data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                My Submissions
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Upload */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search videos..."
                className="pl-10 py-2 bg-white border-gray-200 rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-[#014585] hover:bg-[#013a70]">
              <Plus className="h-4 w-4 mr-2" /> Upload New Video
            </Button>
          </div>

          {/* Recent Submissions */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-2">Recent Submissions</h2>
            <p className="text-sm text-gray-500 mb-4">AI analysis usually completes within 24 hours</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Submission 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1">MAY 16, 2023</div>
                <h3 className="text-lg font-semibold mb-1">Knee Extension</h3>
                <p className="text-sm text-gray-500 mb-4">Submitted for review - Awaiting feedback</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Video
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs text-gray-500 border-gray-300">
                    Delete
                  </Button>
                </div>
              </div>

              {/* Submission 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1">MAY 14, 2023</div>
                <h3 className="text-lg font-semibold mb-1">Hamstring Curl</h3>
                <p className="text-sm text-gray-500 mb-4">Feedback received from Dr. Johnson</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Feedback
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs text-gray-500 border-gray-300">
                    Download
                  </Button>
                </div>
              </div>

              {/* Submission 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1">MAY 12, 2023</div>
                <h3 className="text-lg font-semibold mb-1">Balance Training</h3>
                <div className="flex items-center mb-4">
                  <Badge className="bg-green-100 text-green-800 mr-2">Good form</Badge>
                  <span className="text-xs text-gray-500">/ Needs improvement</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Analysis
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs text-gray-500 border-gray-300">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Exercise Videos */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Recommended Exercise Videos</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Exercise 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 mb-2">BEGINNER</Badge>
                <h3 className="text-lg font-semibold mb-1">Seated Leg Raises</h3>
                <p className="text-sm text-gray-500 mb-4">Recommended by Dr. Johnson for your recovery plan</p>
                <Button variant="outline" size="sm" className="text-xs">
                  Watch Demo
                </Button>
              </div>

              {/* Exercise 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 mb-2">INTERMEDIATE</Badge>
                <h3 className="text-lg font-semibold mb-1">Standing Balance</h3>
                <p className="text-sm text-gray-500 mb-4">Next progression in your balance training series</p>
                <Button variant="outline" size="sm" className="text-xs">
                  Watch Demo
                </Button>
              </div>

              {/* Exercise 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800 mb-2">ADVANCED</Badge>
                <h3 className="text-lg font-semibold mb-1">Single Leg Squat</h3>
                <p className="text-sm text-gray-500 mb-4">Future goal exercise - save for later stages</p>
                <Button variant="outline" size="sm" className="text-xs">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Video Submission History */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Video Submission History</h2>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Exercise Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">May 16, 2023</TableCell>
                    <TableCell>Knee Extension</TableCell>
                    <TableCell>1:24</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600">In Progress</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">May 14, 2023</TableCell>
                    <TableCell>Hamstring Curl</TableCell>
                    <TableCell>2:05</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Reviewed
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">87%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">May 12, 2023</TableCell>
                    <TableCell>Balance Training</TableCell>
                    <TableCell>1:47</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Reviewed
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">78%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">May 10, 2023</TableCell>
                    <TableCell>Gait Training</TableCell>
                    <TableCell>3:12</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Reviewed
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">85%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Therapist Feedback */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Therapist Feedback</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <Image src="/caring-doctor.png" alt="Dr. Johnson" width={40} height={40} className="rounded-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center justify-between">
                      <span>Hamstring Curl Feedback</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Good form overall. Try to maintain a slower, more controlled movement on the return phase.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <Image src="/caring-doctor.png" alt="Dr. Johnson" width={40} height={40} className="rounded-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center justify-between">
                      <span>Balance Training Feedback</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your stability has improved. Focus on keeping your core engaged throughout the exercise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
