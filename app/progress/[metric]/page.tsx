"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Settings,
  LogOut,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function MetricDetailPage({ params }: { params: { metric: string } }) {
  const { user, logout } = useAuth()
  const [timeRange, setTimeRange] = useState("3 months")

  // Format the metric name for display
  const formatMetricName = (metric: string) => {
    return metric
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const metricName = formatMetricName(params.metric)

  // Mock data for charts
  const chartData = {
    "overall-progress": {
      title: "Overall Recovery Progress",
      description: "Your rehabilitation journey progress over time",
      currentValue: "72%",
      change: "+8% from last month",
      positive: true,
    },
    "pain-level": {
      title: "Pain Level Tracking",
      description: "Your reported pain levels over time",
      currentValue: "3/10",
      change: "-2 points from initial assessment",
      positive: true,
    },
    mobility: {
      title: "Mobility Metrics",
      description: "Range of motion and movement capabilities",
      currentValue: "48% improvement",
      change: "+12% in the last 30 days",
      positive: true,
    },
    strength: {
      title: "Strength Development",
      description: "Muscle strength and endurance measurements",
      currentValue: "35% increase",
      change: "+8% from last assessment",
      positive: true,
    },
  }

  // Get the data for the current metric
  const currentMetric = chartData[params.metric as keyof typeof chartData] || {
    title: "Metric Details",
    description: "Detailed view of your progress",
    currentValue: "N/A",
    change: "No data available",
    positive: false,
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
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
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
          {/* Back button and title */}
          <div className="flex items-center mb-6">
            <Link href="/progress">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{currentMetric.title}</h1>
              <p className="text-gray-500">{currentMetric.description}</p>
            </div>
          </div>

          {/* Current Value Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Current Value</h2>
                <p className="text-3xl font-bold">{currentMetric.currentValue}</p>
                <p className={`text-sm ${currentMetric.positive ? "text-green-600" : "text-red-600"} font-medium mt-1`}>
                  {currentMetric.change}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Week
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Month
                </Button>
                <Button size="sm" className="text-xs bg-[#014585] hover:bg-[#013a70] text-white">
                  3 Months
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Year
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  All
                </Button>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Progress Over Time</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Last {timeRange}</span>
                </div>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
              {/* This would be replaced with an actual chart component */}
              <div className="text-center">
                <p className="text-gray-500">Chart visualization would appear here</p>
                <p className="text-sm text-gray-400">Using a chart library like Chart.js, Recharts, or Nivo</p>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Detailed Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Starting Value</h3>
                <p className="text-xl font-semibold">{params.metric === "pain-level" ? "8/10" : "0%"}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Goal Value</h3>
                <p className="text-xl font-semibold">{params.metric === "pain-level" ? "2/10" : "100%"}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Average Improvement</h3>
                <p className="text-xl font-semibold">{params.metric === "pain-level" ? "-0.8/week" : "+5%/week"}</p>
              </div>
            </div>
          </div>

          {/* Therapist Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Therapist Notes</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <Image
                      src="/caring-doctor.png"
                      alt="Dr. Sarah Miller"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Dr. Sarah Miller</h3>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  {params.metric === "pain-level"
                    ? "Pain levels have decreased significantly since starting the new exercise regimen. Continue with the current protocol and we'll reassess in two weeks."
                    : params.metric === "mobility"
                      ? "Range of motion has improved by 48% since our initial assessment. Focus on maintaining proper form during exercises to maximize benefits."
                      : params.metric === "strength"
                        ? "Strength metrics show consistent improvement. We'll increase resistance in your next session to continue challenging the muscles."
                        : "Overall progress is excellent. You're on track to meet all rehabilitation goals within the expected timeframe."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button className="bg-[#014585] hover:bg-[#013a70]">Download Detailed Report</Button>
            <Button variant="outline" className="border-[#014585] text-[#014585] hover:bg-[#014585] hover:text-white">
              Share with Healthcare Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
