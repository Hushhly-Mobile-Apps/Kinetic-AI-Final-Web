"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  Trash,
  Mail,
  Phone,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function PatientManagementPage() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock patient data
  const [patients, setPatients] = useState([
    {
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
    },
    {
      id: 2,
      name: "Michael Smith",
      image: "/athletic-man-short-hair.png",
      age: 42,
      gender: "Male",
      condition: "Lumbar Strain",
      status: "active",
      progress: 30,
      nextAppointment: "May 22, 2:30 PM",
      lastVisit: "1 week ago",
      email: "michael.smith@example.com",
      phone: "(555) 987-6543",
      adherence: "Medium",
      painLevel: 6,
    },
    {
      id: 3,
      name: "Emily Davis",
      image: "/older-man-glasses.png",
      age: 28,
      gender: "Female",
      condition: "ACL Reconstruction",
      status: "active",
      progress: 85,
      nextAppointment: "May 25, 11:15 AM",
      lastVisit: "2 days ago",
      email: "emily.davis@example.com",
      phone: "(555) 456-7890",
      adherence: "High",
      painLevel: 2,
    },
    {
      id: 4,
      name: "Robert Wilson",
      image: "/friendly-receptionist.png",
      age: 56,
      gender: "Male",
      condition: "Frozen Shoulder",
      status: "inactive",
      progress: 40,
      nextAppointment: "Not scheduled",
      lastVisit: "3 weeks ago",
      email: "robert.wilson@example.com",
      phone: "(555) 234-5678",
      adherence: "Low",
      painLevel: 5,
    },
    {
      id: 5,
      name: "Jennifer Brown",
      image: "/smiling-brown-haired-woman.png",
      age: 31,
      gender: "Female",
      condition: "Plantar Fasciitis",
      status: "completed",
      progress: 100,
      nextAppointment: "Not scheduled",
      lastVisit: "1 month ago",
      email: "jennifer.brown@example.com",
      phone: "(555) 876-5432",
      adherence: "High",
      painLevel: 0,
    },
    {
      id: 6,
      name: "David Lee",
      image: "/athletic-man-short-hair.png",
      age: 45,
      gender: "Male",
      condition: "Tennis Elbow",
      status: "active",
      progress: 50,
      nextAppointment: "May 24, 9:00 AM",
      lastVisit: "5 days ago",
      email: "david.lee@example.com",
      phone: "(555) 345-6789",
      adherence: "Medium",
      painLevel: 4,
    },
  ])

  // Filter patients based on search query and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || patient.status === selectedStatus

    return matchesSearch && matchesStatus
  })

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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Patient Management</h1>
              <p className="text-gray-500">Manage and monitor your patients' progress</p>
            </div>
            <Button className="bg-[#014585] hover:bg-[#013a70]">
              <Plus className="mr-2 h-4 w-4" /> Add New Patient
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search patients by name, condition, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Tabs defaultValue="all" className="w-[400px]" onValueChange={setSelectedStatus}>
                <TabsList>
                  <TabsTrigger value="all">All Patients</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          {/* Patient List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50">
                <div className="grid grid-cols-12 gap-2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Patient</div>
                  <div className="col-span-2">Condition</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Progress</div>
                  <div className="col-span-2">Next Appointment</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
              <div className="bg-white divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div key={patient.id} className="grid grid-cols-12 gap-2 px-6 py-4 hover:bg-gray-50">
                      <div className="col-span-3 flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={patient.image}
                            alt={patient.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            {patient.age} • {patient.gender}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-gray-900">{patient.condition}</span>
                      </div>
                      <div className="col-span-1 flex items-center">
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
                      <div className="col-span-2 flex items-center">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{patient.progress}%</span>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-1">Pain:</span>
                              <span
                                className={`text-xs font-medium ${
                                  patient.painLevel <= 3
                                    ? "text-green-600"
                                    : patient.painLevel <= 6
                                      ? "text-amber-600"
                                      : "text-red-600"
                                }`}
                              >
                                {patient.painLevel}/10
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                patient.progress >= 75
                                  ? "bg-green-500"
                                  : patient.progress >= 40
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                              }`}
                              style={{ width: `${patient.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <div className="text-sm text-gray-900">{patient.nextAppointment}</div>
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <Button size="sm" className="bg-[#014585] hover:bg-[#013a70]">
                          View Details
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" /> Schedule Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" /> Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" /> Call Patient
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" /> Delete Patient
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-10 text-center">
                    <p className="text-gray-500">No patients found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
