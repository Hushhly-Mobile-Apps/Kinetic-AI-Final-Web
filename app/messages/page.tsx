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
  Mail,
  Bell,
  Reply,
  Calendar,
  BarChart,
  HelpCircle,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function MessagesPage() {
  const { user, logout } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [autoReplyOption, setAutoReplyOption] = useState("none")

  // Mock data for recent conversations
  const recentConversations = [
    {
      id: 1,
      name: "Dr. Budi Santoso",
      avatar: "/caring-doctor.png",
      lastMessage: "Your next session is scheduled for Monday at 10:00 AM.",
      unread: true,
    },
    {
      id: 2,
      name: "Dr. Lisa Tan",
      avatar: "/athletic-man-short-hair.png",
      lastMessage: "Great progress on your last exercise routine!",
      unread: false,
    },
    {
      id: 3,
      name: "Admin Team",
      avatar: "/friendly-receptionist.png",
      lastMessage: "Your insurance claim has been approved.",
      unread: false,
    },
  ]

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={40} height={40} />
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <Home className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/exercises"
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <Activity className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Exercises</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/appointments"
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <Users className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Appointments</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/messages"
                className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white relative"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Messages</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/progress"
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <BarChart2 className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Progress</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/video-library"
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <FileText className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Video Library</TooltipContent>
          </Tooltip>
        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <User className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Profile</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Logout</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-[#111827]">Messages</h1>
            <Button className="bg-[#014585] hover:bg-[#013a70]">New Message</Button>
          </div>
          <p className="text-gray-500 mb-6">Communicate with your therapy team</p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <Link href="/dashboard" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Overview
            </Link>
            <Link href="/exercises" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Exercises
            </Link>
            <Link href="/appointments" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Appointments
            </Link>
            <Link
              href="/messages"
              className="pb-2 px-1 mr-6 text-sm font-medium text-gray-900 border-b-2 border-[#014585]"
            >
              Messages
            </Link>
            <Link href="/progress" className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700">
              Progress
            </Link>
            <Link
              href="/video-library"
              className="pb-2 px-1 mr-6 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              My Submissions
            </Link>
          </div>

          {/* Recent Conversations */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#111827]">Recent Conversations</h2>
            </div>

            <div className="space-y-3">
              {recentConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  onClick={() => toast({ title: `Conversation with ${conversation.name}`, description: `Opening chat with ${conversation.name}.` })}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <Image
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{conversation.name}</h3>
                      <p className="text-sm text-gray-500">{conversation.lastMessage}</p>
                    </div>
                  </div>
                  {conversation.unread && <div className="w-3 h-3 rounded-full bg-black flex-shrink-0"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Message Preferences */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Message Preferences</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email alerts for new messages</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4">
                      <Bell className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive mobile alerts for new messages</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4">
                      <Reply className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Auto-reply When Unavailable</h3>
                      <p className="text-sm text-gray-500">Set an automatic response when you can't reply</p>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm"
                      value={autoReplyOption}
                      onChange={(e) => setAutoReplyOption(e.target.value)}
                    >
                      <option value="none">Select</option>
                      <option value="vacation">Vacation</option>
                      <option value="busy">Busy</option>
                      <option value="custom">Custom</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Request Appointment</h3>
                <p className="text-gray-500 mb-4">Send a message to schedule a new session</p>
                <Button className="bg-[#014585] hover:bg-[#013a70]">Request</Button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                  <BarChart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Share Progress</h3>
                <p className="text-gray-500 mb-4">Send your latest exercise results to your therapist</p>
                <Button className="bg-[#014585] hover:bg-[#013a70]">Share</Button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                  <HelpCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ask Question</h3>
                <p className="text-gray-500 mb-4">Get quick answers about your recovery plan</p>
                <Button className="bg-[#014585] hover:bg-[#013a70]">Ask</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
