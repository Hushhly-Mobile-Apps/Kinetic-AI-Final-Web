"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Plus,
  LogOut,
  Camera,
  Phone,
  Mail,
  Edit,
  Download,
  Clipboard,
  Video,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth()
  const patientId = parseInt(params.id)

  // Mock patient data
  const patient = {
    id: 1,
    name: "Alex Johnson",
    image: "/smiling-brown-haired-woman.png",
    age: 35,
    gender: "Female",
    condition: "Rotator Cuff Injury",
    status: "active",
    progress: 65,
    nextAppointment: "Tomorrow, 10:00 AM",
    lastVisit: "3 days ago",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    adherence: "High",
    painLevel: 3,
    startDate: "April 15, 2023",
    estimatedEndDate: "July 15, 2023",
    insuranceProvider: "Blue Cross Blue Shield",
    insuranceId: "BCBS-12345678",
    primaryPhysician: "Dr. Robert Chen",
    emergencyContact: "Emily Johnson (Spouse) - (555) 987-6543",
    notes: "Patient has shown consistent improvement in range of motion. Continues to report mild pain during overhead movements. Adherence to home exercise program has been excellent.",
  }

  // Mock appointment history
  const appointmentHistory = [
    {
      id: 1,
      date: "May 10, 2023",
      time: "10:00 AM",
      type: "Follow-up Session",
      provider: "Dr. James Wilson",
      notes: "Patient reported decreased pain (3/10) and improved range of motion. Increased resistance in exercises. Continued focus on rotator cuff strengthening.",
      completed: true,
    },
    {
      id: 2,
      date: "May 3, 2023",
      time: "10:30 AM",
      type: "Manual Therapy",
      provider: "Dr. James Wilson",
      notes: "Performed soft tissue mobilization and joint mobilization. Patient reported temporary relief. Adjusted home exercise program.",
      completed: true,
    },
    {
      id: 3,
      date: "April 26, 2023",
      time: "11:00 AM",
      type: "Progress Evaluation",
      provider: "Dr. Rebecca Chen",
      notes: "Measured 20° improvement in external rotation. Pain reduced from 6/10 to 4/10. Progressed to phase 2 of rehabilitation protocol.",
      completed: true,
    },
    {
      id: 4,
      date: "April 15, 2023",
      time: "9:00 AM",
      type: "Initial Assessment",
      provider: "Dr. Rebecca Chen",
      notes: "Diagnosed with rotator cuff tendinopathy. Limited range of motion and pain with overhead activities. Initiated phase 1 of rehabilitation protocol.",
      completed: true,
    },
  ]

  // Mock exercise program
  const exerciseProgram = [
    {
      id: 1,
      name: "Pendulum Exercise",
      category: "Range of Motion",
      frequency: "Daily",
      sets: 1,
      reps: "30 seconds",
      lastCompleted: "Today",
      adherence: 95,
      video: true,
    },
    {
      id: 2,
      name: "Isometric Shoulder External Rotation",
      category: "Strengthening",
      frequency: "Daily",
      sets: 3,
      reps: "10 reps, 5 second hold",
      lastCompleted: "Yesterday",
      adherence: 85,
      video: true,
    },
    {
      id: 3,
      name: "Scapular Retraction",
      category: "Strengthening",
      frequency: "3x per week",
      sets: 3,
      reps: "15 reps",
      lastCompleted: "2 days ago",
      adherence: 70,
      video: true,
    },
    {
      id: 4,
      name: "Wall Slides",
      category: "Range of Motion",
      frequency: "Daily",
      sets: 2,
      reps: "10 reps",
      lastCompleted: "Today",
      adherence: 90,
      video: true,
    },
    {
      id: 5,
      name: "Resistance Band External Rotation",
      category: "Strengthening",
      frequency: "3x per week",
      sets: 3,
      reps: "12 reps",
      lastCompleted: "3 days ago",
      adherence: 60,
      video: true,
    },
  ]

  // Mock progress data
  const progressData = [
    {
      metric: "Pain Level",
      initial: 7,
      current: 3,
      target: 0,
      unit: "/10",
      trend: "decreasing",
      good: "decreasing",
    },
    {
      metric: "External Rotation",
      initial: 30,
      current: 60,
      target: 90,
      unit: "°",
      trend: "increasing",
      good: "increasing",
    },
    {
      metric: "Abduction",
      initial: 45,
      current: 90,
      target: 180,
      unit: "°",
      trend: "increasing",
      good: "increasing",
    },
    {
      metric: "Strength",
      initial: 3,
      current: 4,
      target: 5,
      unit: "/5",
      trend: "increasing",
      good: "increasing",
    },
  ]

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={60} height={60} />
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard/provider"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/provider/patients"
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Calendar className="w-5 h-5" />
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
          <Link
            href="/pose-estimation"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Camera className="w-5 h-5" />
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
          {/* Header with Patient Info */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center">
              <div className="relative h-20 w-20 mr-6">
                <Image src={patient.image} alt={patient.name} fill className="rounded-full object-cover" />
              </div>
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-[#111827] mr-3">{patient.name}</h1>
                  <Badge
                    className={
                      patient.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : patient.status === "inactive"
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    }
                  >
                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-500 mb-1">
                  {patient.age} • {patient.gender} • {patient.condition}
                </p>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    {patient.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {patient.phone}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" /> Edit Patient
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" /> Schedule
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" /> Message
              </Button>
              <Button className="bg-[#014585] hover:bg-[#013a70] gap-2">
                <Camera className="h-4 w-4" /> OpenPose Analysis
              </Button>
            </div>
          </div>

          {/* Treatment Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Treatment Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-[#014585]">{patient.progress}%</div>
                  <Progress value={patient.progress} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pain Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-[#014585]">{patient.painLevel}/10</div>
                  <ArrowDownRight
                    className="ml-2 h-5 w-5 text-green-500"
                    aria-label="Decreasing (Improving)"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Exercise Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-[#014585]">{patient.adherence}</div>
                  <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Next Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#014585]">{patient.nextAppointment}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="exercises">Exercise Program</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>

              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Condition</h3>
                          <p className="mt-1">{patient.condition}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Treatment Start Date</h3>
                          <p className="mt-1">{patient.startDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Estimated End Date</h3>
                          <p className="mt-1">{patient.estimatedEndDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Insurance Provider</h3>
                          <p className="mt-1">{patient.insuranceProvider}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Insurance ID</h3>
                          <p className="mt-1">{patient.insuranceId}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Primary Physician</h3>
                          <p className="mt-1">{patient.primaryPhysician}</p>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                          <p className="mt-1">{patient.emergencyContact}</p>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Clinical Notes</h3>
                          <p className="mt-1">{patient.notes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Completed exercises</p>
                            <p className="text-xs text-gray-500">Today, 9:30 AM</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Attended appointment</p>
                            <p className="text-xs text-gray-500">May 10, 10:00 AM</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Reported increased pain</p>
                            <p className="text-xs text-gray-500">May 8, 2:15 PM</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-between">
                          View Exercise History
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between">
                          Generate Progress Report
                          <Download className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between">
                          Update Treatment Plan
                          <Edit className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between">
                          Video Consultation
                          <Video className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Other tabs would be implemented similarly */}
            <TabsContent value="appointments">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Appointment History</CardTitle>
                  <Button className="bg-[#014585] hover:bg-[#013a70]">
                    <Plus className="mr-2 h-4 w-4" /> Schedule New Appointment
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointmentHistory.map((appointment) => (
                      <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-[#014585] mr-2" />
                              <h3 className="font-medium">
                                {appointment.date} • {appointment.time}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500 ml-6">
                              {appointment.type} with {appointment.provider}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                        </div>
                        <div className="ml-6 pl-2 border-l-2 border-gray-200">
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
