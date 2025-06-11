"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Home, Activity, Users, MessageSquare, BarChart2, FileText, User, Settings, LogOut, Camera } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"


export function DashboardLayout({ children, activeLink = "home" }: { children: React.ReactNode; activeLink?: string }) {
  const { signOut } = useAuth()
  const router = useRouter()

  const logout = async () => {
    await signOut()
    router.push("/")
  }
  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <Logo size={40} />
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "home" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/exercises"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "exercises" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <Activity className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "appointments" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/messages"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "messages" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link
            href="/progress"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "progress" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/video-library"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "videos" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <FileText className="w-5 h-5" />
          </Link>
          <Link
            href="/pose-estimation"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "pose" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <Camera className="w-5 h-5" />
          </Link>

        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6">
          <Link
            href="/profile"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "profile" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/settings"
            className={`w-10 h-10 rounded-xl ${
              activeLink === "settings" ? "bg-[#7e58f4] bg-opacity-20" : "hover:bg-white/10"
            } flex items-center justify-center text-white transition-all duration-200 hover:scale-105`}
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={logout}
            className="w-10 h-10 rounded-xl hover:bg-white/10 hover:bg-red-500/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
