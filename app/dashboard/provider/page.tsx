"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ProviderDashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }
  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 1,
      patientName: "Alex Johnson",
      patientImage: "/smiling-brown-haired-woman.png",
      time: "9:00 AM",
      type: "Initial Assessment",
      status: "checked-in",
      duration: "45 min",
    },
    {
      id: 2,
      patientName: "Michael Smith",
      patientImage: "/athletic-man-short-hair.png",
      time: "10:30 AM",
      type: "Follow-up Session",
      status: "confirmed",
      duration: "30 min",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      patientImage: "/older-man-glasses.png",
      time: "1:15 PM",
      type: "Video Consultation",
      status: "confirmed",
      duration: "20 min",
    },
    {
      id: 4,
      patientName: "Sarah Wilson",
      patientImage: "/smiling-brown-haired-woman.png",
      time: "3:00 PM",
      type: "Progress Evaluation",
      status: "pending",
      duration: "45 min",
    },
  ])

  const [patientUpdates, setPatientUpdates] = useState([
    {
      id: 1,
      patientName: "Alex Johnson",
      patientImage: "/smiling-brown-haired-woman.png",
      update: "Completed all assigned exercises with improved range of motion",
      time: "Yesterday",
      type: "Exercise Completion",
    },
    {
      id: 2,
      patientName: "Michael Smith",
      patientImage: "/athletic-man-short-hair.png",
      update: "Reported increased pain level (6/10) after last session",
      time: "2 days ago",
      type: "Pain Report",
      priority: "high",
    },
    {
      id: 3,
      patientName: "Emily Davis",
      patientImage: "/older-man-glasses.png",
      update: "Missed scheduled video session - needs rescheduling",
      time: "3 days ago",
      type: "Missed Appointment",
    },
  ])

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex Johnson",
      senderImage: "/smiling-brown-haired-woman.png",
      message: "Is it normal to feel a slight pulling sensation during the hamstring stretch?",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Dr. Williams",
      senderImage: "/caring-doctor.png",
      message: "Patient referral sent for Michael Smith. Please review his medical history.",
      time: "Yesterday",
      unread: true,
    },
    {
      id: 3,
      sender: "Front Desk",
      senderImage: "/friendly-receptionist.png",
      message: "Your schedule for next week has been updated with two new patients.",
      time: "Yesterday",
      unread: false,
    },
  ])

  const [performanceMetrics, setPerformanceMetrics] = useState([
    {
      id: 1,
      name: "Patient Satisfaction",
      value: 4.8,
      total: 5,
      change: "+0.2",
      trend: "up",
    },
    {
      id: 2,
      name: "Recovery Rate",
      value: 92,
      unit: "%",
      change: "+3%",
      trend: "up",
    },
    {
      id: 3,
      name: "Avg. Treatment Duration",
      value: 5.2,
      unit: " weeks",
      change: "-0.5",
      trend: "down",
    },
  ])

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
            className={`w-10 h-10 rounded-xl ${
              pathname === "/dashboard/provider" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/provider/patients"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/patients") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/appointments") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <Calendar className="w-5 h-5" />
          </Link>
          <Link
            href="/messages"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/messages") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link
            href="/progress"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/progress") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/video-library"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/video-library") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <FileText className="w-5 h-5" />
          </Link>
          <Link
            href="/pose-estimation"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/pose-estimation") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <Camera className="w-5 h-5" />
          </Link>

        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6">
          <Link
            href="/profile"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/profile") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/settings"
            className={`w-10 h-10 rounded-xl ${
              pathname.includes("/settings") ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-colors duration-200`}
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl hover:bg-white/10 hover:bg-red-500/20 flex items-center justify-center text-white transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {user?.name || "Doctor"}</h1>
            <p className="text-gray-500">Here's an overview of your practice and patients</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-[#014585] to-[#0070c0] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patient Management</CardTitle>
                <CardDescription className="text-blue-100">Search or add patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Search className="mr-2 h-5 w-5 text-blue-200" />
                    <span>Find patient</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white text-[#014585] hover:bg-blue-100 hover:text-[#014585]"
                    >
                      <Search className="h-4 w-4 mr-1" /> Search
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white text-[#014585] hover:bg-blue-100 hover:text-[#014585]"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>



            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Schedule Management</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-[#014585]" />
                    <span>{todayAppointments.length} appointments today</span>
                  </div>
                  <Link href="/appointments">
                    <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                      View Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Treatment Library</CardTitle>
                <CardDescription>Access exercise and treatment resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-[#014585]" />
                    <span>Browse resources</span>
                  </div>
                  <Link href="/video-library">
                    <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                      Open Library
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Appointments */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Today's Appointments</CardTitle>
                    <Link href="/appointments">
                      <Button variant="ghost" className="h-8 text-[#014585]">
                        Full Schedule
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="relative w-10 h-10 mr-3">
                              <Image
                                src={appointment.patientImage || "/placeholder.svg"}
                                alt={appointment.patientName}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className="mr-2">{appointment.time}</span>
                                <span>({appointment.duration})</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4 text-right">
                              <span className="text-sm text-gray-600">{appointment.type}</span>
                              <div className="flex items-center justify-end">
                                {appointment.status === "checked-in" ? (
                                  <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                                ) : appointment.status === "confirmed" ? (
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-amber-500 mr-1" />
                                )}
                                <span
                                  className={`text-xs ${
                                    appointment.status === "checked-in"
                                      ? "text-green-600"
                                      : appointment.status === "confirmed"
                                        ? "text-green-500"
                                        : "text-amber-500"
                                  }`}
                                >
                                  {appointment.status === "checked-in"
                                    ? "Checked In"
                                    : appointment.status === "confirmed"
                                      ? "Confirmed"
                                      : "Pending"}
                                </span>
                              </div>
                            </div>
                            <Link href={`/appointments/${appointment.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No appointments scheduled for today</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Patient Updates */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Patient Updates</CardTitle>
                    <Button variant="ghost" className="h-8 text-[#014585]">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientUpdates.map((update) => (
                      <div
                        key={update.id}
                        className={`p-3 rounded-lg ${
                          update.priority === "high"
                            ? "bg-red-50 border-l-2 border-red-500"
                            : update.type === "Missed Appointment"
                              ? "bg-amber-50 border-l-2 border-amber-500"
                              : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="relative w-8 h-8 mr-2">
                              <Image
                                src={update.patientImage || "/placeholder.svg"}
                                alt={update.patientName}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <h3 className="font-medium text-gray-900">{update.patientName}</h3>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">{update.time}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                update.type === "Pain Report"
                                  ? "bg-red-100 text-red-800"
                                  : update.type === "Missed Appointment"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {update.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{update.update}</p>
                        <div className="flex justify-end mt-2">
                          <Link href={`/patients/${update.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-[#014585]">
                              View Patient
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Performance Metrics</CardTitle>
                    <Link href="/progress/provider">
                      <Button variant="ghost" className="h-8 text-[#014585]">
                        Details
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric) => (
                      <div key={metric.id} className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                          <div className="flex items-center">
                            <span className="text-xl font-semibold mr-1">
                              {metric.value}
                              {metric.unit || ""}
                            </span>
                            {metric.total && <span className="text-xs text-gray-500">/ {metric.total}</span>}
                          </div>
                        </div>
                        <div
                          className={`flex items-center ${
                            metric.trend === "up"
                              ? metric.name === "Avg. Treatment Duration"
                                ? "text-red-500"
                                : "text-green-500"
                              : metric.name === "Avg. Treatment Duration"
                                ? "text-green-500"
                                : "text-red-500"
                          }`}
                        >
                          <span className="text-lg font-medium">{metric.change}</span>
                          <ArrowRight
                            className={`h-4 w-4 ml-1 ${metric.trend === "up" ? "rotate-[-45deg]" : "rotate-45deg"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Messages</CardTitle>
                    <Link href="/messages">
                      <Button variant="ghost" className="h-8 text-[#014585]">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <Link href={`/messages/${message.id}`} key={message.id}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.unread ? "bg-blue-50 border-l-2 border-[#014585]" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="relative w-8 h-8 mr-2">
                                  <Image
                                    src={message.senderImage || "/placeholder.svg"}
                                    alt={message.sender}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                                <h3 className="font-medium text-gray-900">{message.sender}</h3>
                              </div>
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No messages</p>
                    </div>
                  )}
                </CardContent>
              </Card>



              {/* Quick Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">

                    <Link href="/video-library/exercise-demos">
                      <Button variant="outline" className="w-full justify-between text-[#014585] hover:text-[#013a70]">
                        Exercise Library
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/patients/reports">
                      <Button variant="outline" className="w-full justify-between text-[#014585] hover:text-[#013a70]">
                        Patient Reports
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/appointments/schedule">
                      <Button variant="outline" className="w-full justify-between text-[#014585] hover:text-[#013a70]">
                        Schedule Management
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
