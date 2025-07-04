"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
  Video,
  Edit,
  X,
  Bell,
  FileTextIcon as FileText2,
  LogOut,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"

export default function AppointmentsPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("appointments")
  const [isJoining, setIsJoining] = useState(false)

  // Generate dynamic dates
  const today = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get upcoming dates
  const getUpcomingDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(today.getDate() + daysFromNow);
    return date;
  };

  // Get past dates
  const getPastDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(today.getDate() - daysAgo);
    return date;
  };

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      date: formatDate(getUpcomingDate(3)),
      time: "10:00 AM",
      doctor: "Dr. Budi Santoso",
      type: "Shoulder Assessment",
      mode: "In-person",
      location: "Main Clinic - Room 305",
      duration: "45 minutes",
      status: "Confirmed",
      notes: "Please arrive 15 minutes early for clinic administration.",
      insuranceVerified: true
    },
    {
      id: 2,
      date: formatDate(getUpcomingDate(10)),
      time: "2:30 PM",
      doctor: "Dr. Budi Santoso",
      type: "Follow-up Session",
      mode: "Virtual",
      location: "Video Conference",
      duration: "30 minutes",
      status: "Pending",
      notes: "A video link will be sent 30 minutes before the session.",
      insuranceVerified: true
    },
    {
      id: 3,
      date: formatDate(getUpcomingDate(21)),
      time: "11:15 AM",
      doctor: "Dr. Lisa Tan",
      type: "Progress Evaluation",
      mode: "In-person",
      location: "Downtown Branch - Room 112",
      duration: "60 minutes",
      status: "Confirmed",
      notes: "Bring your exercise log and wear comfortable sportswear.",
      insuranceVerified: true
    },
    {
      id: 4,
      date: formatDate(getUpcomingDate(28)),
      time: "9:45 AM",
      doctor: "Dr. Wijaya Saputra",
      type: "Gait Analysis",
      mode: "In-person",
      location: "Motion Lab - Building B",
      duration: "75 minutes",
      status: "Confirmed",
      notes: "Wear shorts and athletic shoes for this assessment.",
      insuranceVerified: true
    },
    {
      id: 5,
      date: formatDate(getUpcomingDate(35)),
      time: "3:15 PM",
      doctor: "Dr. Agus Pratama",
      type: "Monthly Review",
      mode: "Virtual",
      location: "Video Conference",
      duration: "45 minutes",
      status: "Tentative",
      notes: "We will discuss your progress and adjust your treatment plan as needed.",
      insuranceVerified: false
    }
  ]

  // Mock data for therapists
  const therapists = [
    {
      id: 1,
      name: "Dr. Budi Santoso",
      specialty: "Shoulder & Upper Extremity Specialist",
      availability: "Available Mon-Thu",
      color: "green",
      image: "/caring-doctor.png",
      education: "MD, University of Indonesia",
      experience: "12 years",
      rating: 4.9,
      reviewCount: 127,
      nextAvailable: "Tomorrow at 2:30 PM",
      bio: "Specializes in post-surgical rehabilitation and sports injuries of the shoulder and upper extremities."
    },
    {
      id: 2,
      name: "Dr. Lisa Tan",
      specialty: "Orthopedic Physical Therapist",
      availability: "Available Tue-Fri",
      color: "orange",
      image: "/athletic-man-short-hair.png",
      education: "MD, Airlangga University",
      experience: "8 years",
      rating: 4.8,
      reviewCount: 93,
      nextAvailable: "Thursday at 10:15 AM",
      bio: "Focuses on evidence-based treatment approaches for orthopedic conditions and sports rehabilitation."
    },
    {
      id: 3,
      name: "Dr. Wijaya Saputra",
      specialty: "Neurological Rehabilitation Expert",
      availability: "Available Wed-Sat",
      color: "blue",
      image: "/smiling-brown-haired-woman.png",
      education: "MD, Gadjah Mada University",
      experience: "15 years",
      rating: 4.9,
      reviewCount: 156,
      nextAvailable: "Wednesday at 1:00 PM",
      bio: "Specializes in neurological rehabilitation with expertise in stroke recovery and balance disorders."
    },
    {
      id: 4,
      name: "Dr. Agus Pratama",
      specialty: "Sports Medicine & Rehabilitation",
      availability: "Available Mon, Wed, Fri",
      color: "purple",
      image: "/older-man-glasses.png",
      education: "MD, Padjadjaran University",
      experience: "10 years",
      rating: 4.7,
      reviewCount: 88,
      nextAvailable: "Monday at 9:00 AM",
      bio: "Former athlete specializing in sports-related injuries and performance optimization."
    },
    {
      id: 5,
      name: "Dr. Melati Sari",
      specialty: "Pediatric Physical Therapist",
      availability: "Available Tue-Thu",
      color: "pink",
      image: "/friendly-receptionist.png",
      education: "MD, Diponegoro University",
      experience: "9 years",
      rating: 4.9,
      reviewCount: 112,
      nextAvailable: "Tuesday at 3:30 PM",
      bio: "Specializes in pediatric physical therapy with a focus on developmental disorders and early intervention."
    }
  ]

  // Mock data for appointment history
  const appointmentHistory = [
    {
      id: 1,
      type: "Initial Assessment",
      date: formatShortDate(getPastDate(45)),
      doctor: "Dr. Sarah Miller",
      mode: "In-person",
      duration: "60 minutes",
      notes: "Comprehensive evaluation of shoulder mobility and strength. Identified rotator cuff weakness and limited range of motion.",
      followUpRecommended: true,
      documents: ["Initial Assessment Report", "Treatment Plan", "Exercise Prescription"],
      billing: {
        status: "Processed",
        insuranceCoverage: "80%",
        patientResponsibility: "$45.00",
        date: formatShortDate(getPastDate(43))
      }
    },
    {
      id: 2,
      type: "Treatment Planning",
      date: formatShortDate(getPastDate(38)),
      doctor: "Dr. Sarah Miller",
      mode: "Virtual",
      duration: "30 minutes",
      notes: "Discussed treatment goals and timeline. Established 12-week rehabilitation program with weekly sessions.",
      followUpRecommended: true,
      documents: ["Updated Treatment Plan", "Home Exercise Program"],
      billing: {
        status: "Processed",
        insuranceCoverage: "80%",
        patientResponsibility: "$25.00",
        date: formatShortDate(getPastDate(36))
      }
    },
    {
      id: 3,
      type: "Exercise Introduction",
      date: formatShortDate(getPastDate(35)),
      doctor: "Dr. James Wilson",
      mode: "In-person",
      duration: "45 minutes",
      notes: "Introduced initial exercise program. Focused on proper form and technique for rotator cuff strengthening exercises.",
      followUpRecommended: true,
      documents: ["Exercise Guide", "Progress Tracking Sheet"],
      billing: {
        status: "Processed",
        insuranceCoverage: "80%",
        patientResponsibility: "$35.00",
        date: formatShortDate(getPastDate(33))
      }
    },
    {
      id: 4,
      type: "Progress Check",
      date: formatShortDate(getPastDate(28)),
      doctor: "Dr. Sarah Miller",
      mode: "In-person",
      duration: "30 minutes",
      notes: "Evaluated progress after first week of exercises. Noted 15% improvement in range of motion. Adjusted exercise intensity.",
      followUpRecommended: true,
      documents: ["Progress Report", "Updated Exercise Program"],
      billing: {
        status: "Processed",
        insuranceCoverage: "80%",
        patientResponsibility: "$25.00",
        date: formatShortDate(getPastDate(26))
      }
    },
    {
      id: 5,
      type: "Manual Therapy Session",
      date: formatShortDate(getPastDate(21)),
      doctor: "Dr. James Wilson",
      mode: "In-person",
      duration: "45 minutes",
      notes: "Performed soft tissue mobilization and joint mobilization techniques. Patient reported decreased pain following treatment.",
      followUpRecommended: true,
      documents: ["Treatment Notes", "Updated Home Care Instructions"],
      billing: {
        status: "Processed",
        insuranceCoverage: "80%",
        patientResponsibility: "$35.00",
        date: formatShortDate(getPastDate(19))
      }
    },
    {
      id: 6,
      type: "Mid-Program Assessment",
      date: formatShortDate(getPastDate(14)),
      doctor: "Dr. Sarah Miller",
      mode: "In-person",
      duration: "60 minutes",
      notes: "Comprehensive re-evaluation at 6-week mark. Noted 40% improvement in range of motion and 30% increase in strength.",
      followUpRecommended: true,
      documents: ["Mid-Program Assessment Report", "Updated Treatment Plan"],
      billing: {
        status: "Processed",
        insuranceCoverage: "80%",
        patientResponsibility: "$45.00",
        date: formatShortDate(getPastDate(12))
      }
    },
    {
      id: 7,
      type: "Exercise Progression",
      date: formatShortDate(getPastDate(7)),
      doctor: "Dr. James Wilson",
      mode: "In-person",
      duration: "45 minutes",
      notes: "Advanced exercise program based on mid-program assessment. Introduced resistance band exercises and increased repetitions.",
      followUpRecommended: true,
      documents: ["Advanced Exercise Program", "Technique Guide"],
      billing: {
        status: "Pending",
        insuranceCoverage: "Pending",
        patientResponsibility: "Pending",
        date: "Processing"
      }
    }
  ]

  // Mock data for appointment reminders
  const appointmentReminders = [
    {
      id: 1,
      message: "Bring your exercise journal",
      details: `For your ${upcomingAppointments[0].date} appointment with Dr. Miller`,
      enabled: true,
      icon: "bell",
      reminderTime: "1 day before",
      method: "Email & SMS",
      customNote: "Don't forget to record your pain levels throughout the week"
    },
    {
      id: 2,
      message: "Test your video connection",
      details: `Before your ${upcomingAppointments[1].date} virtual appointment`,
      enabled: true,
      icon: "video",
      reminderTime: "1 hour before",
      method: "Email & SMS",
      customNote: "Make sure you have a stable internet connection"
    },
    {
      id: 3,
      message: "Wear comfortable clothing",
      details: `For your ${upcomingAppointments[2].date} progress evaluation`,
      enabled: true,
      icon: "bell",
      reminderTime: "1 day before",
      method: "Email only",
      customNote: "Shorts and t-shirt recommended for full movement assessment"
    },
    {
      id: 4,
      message: "Bring athletic shoes",
      details: `For your ${upcomingAppointments[3].date} gait analysis`,
      enabled: true,
      icon: "bell",
      reminderTime: "2 days before",
      method: "SMS only",
      customNote: "The shoes you typically exercise in would be ideal"
    },
    {
      id: 5,
      message: "Prepare questions for monthly review",
      details: `For your ${upcomingAppointments[4].date} appointment with Dr. Rodriguez`,
      enabled: false,
      icon: "bell",
      reminderTime: "3 days before",
      method: "Email only",
      customNote: "Consider what aspects of your treatment plan you'd like to discuss"
    }
  ]

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
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
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
          <h1 className="text-2xl font-bold text-[#111827] mb-1">Appointments</h1>
          <p className="text-gray-500 mb-6">Schedule and manage your therapy sessions</p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`pb-2 px-1 mr-6 text-sm font-medium ${
                activeTab === "overview"
                  ? "text-[#111827] border-b-2 border-[#7e58f4]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`pb-2 px-1 mr-6 text-sm font-medium ${
                activeTab === "exercises"
                  ? "text-[#111827] border-b-2 border-[#7e58f4]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
              onClick={() => setActiveTab("exercises")}
            >
              Exercises
            </button>
            <button
              className={`pb-2 px-1 mr-6 text-sm font-medium ${
                activeTab === "appointments"
                  ? "text-[#111827] border-b-2 border-[#7e58f4]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </button>
            <button
              className={`pb-2 px-1 mr-6 text-sm font-medium ${
                activeTab === "messages"
                  ? "text-[#111827] border-b-2 border-[#7e58f4]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </button>
            <button
              className={`pb-2 px-1 mr-6 text-sm font-medium ${
                activeTab === "progress"
                  ? "text-[#111827] border-b-2 border-[#7e58f4]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              Progress
            </button>
            <button
              className={`pb-2 px-1 mr-6 text-sm font-medium ${
                activeTab === "submissions"
                  ? "text-[#111827] border-b-2 border-[#7e58f4]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              My Submissions
            </button>
          </div>

          {/* Upcoming Appointments */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#111827]">Upcoming Appointments</h2>
            <Button className="bg-[#014585] hover:bg-[#013a70]">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule New Appointment
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{appointment.date}</div>
                          <div className="text-sm text-gray-500">{appointment.time} ({appointment.duration})</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                          {appointment.doctor === "Dr. Budi Santoso" && (
                            <Image src="/caring-doctor.png" alt={appointment.doctor} fill className="object-cover" />
                          )}
                          {appointment.doctor === "Dr. Lisa Tan" && (
                            <Image src="/athletic-man-short-hair.png" alt={appointment.doctor} fill className="object-cover" />
                          )}
                          {appointment.doctor === "Dr. Wijaya Saputra" && (
                            <Image src="/smiling-brown-haired-woman.png" alt={appointment.doctor} fill className="object-cover" />
                          )}
                          {appointment.doctor === "Dr. Agus Pratama" && (
                            <Image src="/older-man-glasses.png" alt={appointment.doctor} fill className="object-cover" />
                          )}
                        </div>
                        <div className="font-medium">{appointment.doctor}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{appointment.type}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {appointment.mode === "Virtual" ? (
                          <Video className="h-4 w-4 text-blue-500 mr-2" />
                        ) : (
                          <User className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        <div>
                          <div className="font-medium">{appointment.mode}</div>
                          <div className="text-xs text-gray-500">{appointment.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {appointment.status === "Confirmed" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {appointment.status}
                          </span>
                        )}
                        {appointment.status === "Pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Bell className="h-3 w-3 mr-1" />
                            {appointment.status}
                          </span>
                        )}
                        {appointment.status === "Tentative" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            {appointment.status}
                          </span>
                        )}
                      </div>
                      {!appointment.insuranceVerified && (
                        <div className="text-xs text-amber-600 mt-1">Insurance verification pending</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {appointment.mode === "Virtual" && appointment.status === "Confirmed" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => {
                                  setIsJoining(true);
                                  setTimeout(() => {
                                    setIsJoining(false);
                                    toast({ title: "Joined session!", description: "You are now connected with the doctor." });
                                  }, 2000);
                                }}
                                disabled={isJoining}
                              >
                                {isJoining ? <Spinner /> : "Join Meeting"}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Join video session</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit appointment</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => toast({ title: "Appointment cancelled", description: "Your appointment has been cancelled." })}>
                              <X className="h-3 w-3 mr-1" /> Cancel
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Cancel appointment</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Your Therapists */}
          <h2 className="text-xl font-semibold text-[#111827] mb-4">Your Therapists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {therapists.map((therapist) => (
              <div key={therapist.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={therapist.image}
                      alt={therapist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{therapist.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {therapist.specialty}
                    </p>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({therapist.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-sm">
                  <div className="flex items-center mb-1">
                    <span className="font-medium w-24">Experience:</span>
                    <span className="text-gray-700">{therapist.experience}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="font-medium w-24">Education:</span>
                    <span className="text-gray-700">{therapist.education}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="font-medium w-24">Availability:</span>
                    <span className="text-gray-700">{therapist.availability}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Next Available:</span>
                    <span className="text-gray-700">{therapist.nextAvailable}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{therapist.bio}</p>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 bg-[#014585] text-white hover:bg-[#013a70]">
                    Schedule
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Message
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Appointment History */}
          <h2 className="text-xl font-semibold text-[#111827] mb-4">Appointment History</h2>
          <div className="space-y-4 mb-8">
            {appointmentHistory.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{appointment.type}</h3>
                      <p className="text-sm text-gray-500">
                        {appointment.date} • {appointment.doctor} • {appointment.mode} • {appointment.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                      <FileText2 className="h-4 w-4 mr-1" /> Notes
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                      <FileText2 className="h-4 w-4 mr-1" /> Documents
                    </Button>
                  </div>
                </div>

                {/* Expandable content */}
                <div className="pl-14">
                  <div className="border-l-2 border-gray-200 pl-4 mb-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Session Notes:</span> {appointment.notes}
                    </p>

                    {appointment.documents && appointment.documents.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Documents:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {appointment.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <FileText2 className="h-3 w-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {appointment.billing && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                        <div className="text-xs text-gray-500">Billing Status:</div>
                        <div className="text-xs font-medium">
                          {appointment.billing.status === "Processed" ? (
                            <span className="text-green-600">✓ {appointment.billing.status}</span>
                          ) : (
                            <span className="text-amber-600">⟳ {appointment.billing.status}</span>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">Insurance Coverage:</div>
                        <div className="text-xs font-medium">{appointment.billing.insuranceCoverage}</div>

                        <div className="text-xs text-gray-500">Your Responsibility:</div>
                        <div className="text-xs font-medium">{appointment.billing.patientResponsibility}</div>

                        <div className="text-xs text-gray-500">Processed Date:</div>
                        <div className="text-xs font-medium">{appointment.billing.date}</div>
                      </div>
                    )}
                  </div>

                  {appointment.followUpRecommended && (
                    <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm text-blue-700">Follow-up appointment recommended</span>
                      </div>
                      <Button size="sm" className="h-7 bg-[#014585] hover:bg-[#013a70]">
                        Schedule
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-4">
              <Button variant="outline" className="text-[#014585]">
                View All History
              </Button>
            </div>
          </div>

          {/* Appointment Reminders */}
          <h2 className="text-xl font-semibold text-[#111827] mb-4">Appointment Reminders</h2>
          <div className="space-y-3">
            {appointmentReminders.map((reminder) => (
              <div key={reminder.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${reminder.enabled ? 'bg-blue-100' : 'bg-gray-100'} mr-4`}>
                      {reminder.icon === "bell" ? (
                        <Bell className={`h-5 w-5 ${reminder.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                      ) : (
                        <Video className={`h-5 w-5 ${reminder.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{reminder.message}</h3>
                      <p className="text-sm text-gray-500">{reminder.details}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 mr-2">
                          {reminder.reminderTime}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {reminder.method}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Switch checked={reminder.enabled} className="mb-2" />
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {reminder.customNote && (
                  <div className="mt-3 ml-14 pl-4 border-l-2 border-gray-200">
                    <p className="text-sm text-gray-600 italic">"{reminder.customNote}"</p>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-4">
              <Button className="w-full bg-[#014585] hover:bg-[#013a70]">
                <Bell className="mr-2 h-4 w-4" /> Add New Reminder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
