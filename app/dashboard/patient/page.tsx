"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { 
  Activity, 
  Calendar, 
  Target, 
  TrendingUp, 
  Play, 
  Download, 
  CheckCircle, 
  Clock,
  Award,
  BarChart3,
  Video,
  FileText
} from "lucide-react"

export default function PatientDashboard() {
  const { user } = useAuth()
  const { showToast } = useCustomToast()
  const [progress, setProgress] = useState(78)
  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Ayu Pranata"}</h2>
          <p className="text-muted-foreground">Track your recovery progress and manage your physiotherapy sessions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => showToast("Feature coming soon!", "info")}>
            <Video className="h-4 w-4 mr-2" />
            Start Session
          </Button>
          <Button onClick={() => showToast("Redirecting to pose estimation...", "info")}>
            <Activity className="h-4 w-4 mr-2" />
            AI Analysis
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recovery Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress}%</div>
                <Progress value={progress} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">+5% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Session</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Tomorrow</div>
                <p className="text-xs text-muted-foreground">10:00 AM with Dr. Aditya Raharjo</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exercises Completed</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18/20</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pain Level</CardTitle>
                <Activity className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Mild</div>
                <p className="text-xs text-muted-foreground">Decreased from moderate</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Shoulder Mobility Test</p>
                        <p className="text-xs text-muted-foreground">2 hours ago • 92% accuracy</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => showToast("Opening session review...", "info")}>
                      <Play className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Knee Rehabilitation Exercise</p>
                        <p className="text-xs text-muted-foreground">5 hours ago • 88% accuracy</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => showToast("Opening session review...", "info")}>
                      <Play className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Core Stability Training</p>
                        <p className="text-xs text-muted-foreground">Yesterday • 85% accuracy</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => showToast("Opening session review...", "info")}>
                      <Play className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>You have 2 upcoming sessions this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Virtual Session with Dr. Aditya Raharjo</p>
                      <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
                    </div>
                    <Badge variant="secondary">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Progress Review & Assessment</p>
                      <p className="text-xs text-muted-foreground">Friday at 2:00 PM</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Follow-up Consultation</p>
                      <p className="text-xs text-muted-foreground">Next Monday at 11:00 AM</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div>
                      <p className="font-medium text-sm">Shoulder Mobility Test</p>
                      <p className="text-xs text-gray-600">July 3, 2025 • 15:30</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">92%</p>
                      <p className="text-xs text-gray-600">Accuracy</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                      <p className="font-medium text-sm">Knee Rehabilitation</p>
                      <p className="text-xs text-gray-600">July 2, 2025 • 14:15</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">88%</p>
                      <p className="text-xs text-gray-600">Accuracy</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <div>
                      <p className="font-medium text-sm">Core Stability</p>
                      <p className="text-xs text-gray-600">July 1, 2025 • 16:45</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-purple-600">85%</p>
                      <p className="text-xs text-gray-600">Accuracy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Reports & Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setIsDownloading(true)
                      setTimeout(() => {
                        setIsDownloading(false)
                        showToast("Report downloaded successfully", "success")
                      }, 2000)
                    }}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Downloading..." : "AI_Posture_Review_Ayu_July2025.pdf"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => showToast("Report downloaded successfully", "success")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Movement_Analysis_Report.pdf
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => showToast("Report downloaded successfully", "success")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Progress_Summary_June2025.pdf
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">Consistency Champion</p>
                      <p className="text-xs text-gray-600">Completed 5 sessions this week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Progress Master</p>
                      <p className="text-xs text-gray-600">Improved accuracy by 15%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Goal Achiever</p>
                      <p className="text-xs text-gray-600">Reached 90% recovery target</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}