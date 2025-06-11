import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, CheckCircle, Clock, Video } from "lucide-react"

export default function PersonalizedPlanPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <header className="bg-[#111827] text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={40} height={40} />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-sm hover:text-[#9ca3af]">
              Dashboard
            </Link>
            <Link href="/exercises" className="text-sm hover:text-[#9ca3af]">
              Exercises
            </Link>
            <Link href="/progress" className="text-sm hover:text-[#9ca3af]">
              Progress
            </Link>
            <Link href="/support" className="text-sm hover:text-[#9ca3af]">
              Support
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-white hover:text-[#9ca3af]">
              Account
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#111827]">Your Personalized Recovery Plan</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#111827] mb-2">Recovery Progress</h2>
              <div className="flex items-center mb-2">
                <Progress value={35} className="h-2 flex-1" />
                <span className="ml-4 text-sm font-medium text-[#4b5563]">35%</span>
              </div>
              <p className="text-sm text-[#4b5563]">
                You're making great progress! Continue with your exercises to reach your goals.
              </p>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recovery Summary</CardTitle>
                      <CardDescription>Knee Rehabilitation Program</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm">Personalized for your specific condition</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm">Automated movement analysis for optimal form</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm">Adaptive difficulty based on your progress</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm">Regular progress assessments and plan adjustments</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Next Session</CardTitle>
                      <CardDescription>Scheduled for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-4">
                        <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mr-4">
                          <Calendar className="h-6 w-6 text-[#111827]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Lower Body Strength</h3>
                          <p className="text-sm text-[#4b5563]">30 minutes • 5 exercises</p>
                        </div>
                      </div>
                      <Link href="/exercises/session">
                        <Button className="w-full bg-[#111827] hover:bg-[#1f2937]">Start Session</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recovery Timeline</CardTitle>
                    <CardDescription>Estimated 12-week program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#f3f4f6]"></div>
                      <div className="space-y-6 relative">
                        <div className="flex">
                          <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white z-10 mr-4">
                            1
                          </div>
                          <div>
                            <h3 className="font-medium">Phase 1: Pain Management & Mobility (Weeks 1-3)</h3>
                            <p className="text-sm text-[#4b5563]">
                              Focus on reducing inflammation and restoring basic range of motion
                            </p>
                            <span className="inline-block mt-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                              In Progress
                            </span>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="bg-[#f3f4f6] rounded-full w-8 h-8 flex items-center justify-center text-[#4b5563] z-10 mr-4">
                            2
                          </div>
                          <div>
                            <h3 className="font-medium">Phase 2: Strength Building (Weeks 4-7)</h3>
                            <p className="text-sm text-[#4b5563]">
                              Progressive resistance training to rebuild muscle strength
                            </p>
                            <span className="inline-block mt-1 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                              Upcoming
                            </span>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="bg-[#f3f4f6] rounded-full w-8 h-8 flex items-center justify-center text-[#4b5563] z-10 mr-4">
                            3
                          </div>
                          <div>
                            <h3 className="font-medium">Phase 3: Functional Training (Weeks 8-12)</h3>
                            <p className="text-sm text-[#4b5563]">
                              Activity-specific exercises to prepare for return to normal activities
                            </p>
                            <span className="inline-block mt-1 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                              Upcoming
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exercises">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#111827]">Your Exercise Program</h2>
                  <p className="text-sm text-[#4b5563]">
                    These exercises are specifically designed for your knee rehabilitation program.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "Gentle Knee Extensions",
                        duration: "5 minutes",
                        difficulty: "Beginner",
                        description: "Seated knee extensions to improve range of motion",
                        icon: <Clock className="h-5 w-5" />,
                      },
                      {
                        name: "Supported Squats",
                        duration: "8 minutes",
                        difficulty: "Beginner",
                        description: "Wall-supported partial squats for stability",
                        icon: <Clock className="h-5 w-5" />,
                      },
                      {
                        name: "Hamstring Curls",
                        duration: "6 minutes",
                        difficulty: "Beginner",
                        description: "Lying hamstring curls to strengthen posterior chain",
                        icon: <Clock className="h-5 w-5" />,
                      },
                      {
                        name: "Balance Training",
                        duration: "5 minutes",
                        difficulty: "Beginner",
                        description: "Single-leg balance exercises with support",
                        icon: <Clock className="h-5 w-5" />,
                      },
                    ].map((exercise, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <div className="bg-[#f3f4f6] w-10 h-10 rounded-full flex items-center justify-center mr-4">
                              {exercise.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{exercise.name}</h3>
                              <p className="text-xs text-[#4b5563]">
                                {exercise.duration} • {exercise.difficulty}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-[#4b5563] mb-3">{exercise.description}</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-xs border-[#111827] text-[#111827]">
                              <Video className="h-3 w-3 mr-1" />
                              Watch Demo
                            </Button>
                            <Button size="sm" className="text-xs bg-[#111827] hover:bg-[#1f2937]">
                              Start Exercise
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button variant="outline" className="border-[#111827] text-[#111827]">
                      View All Exercises
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#111827]">Weekly Schedule</h2>
                  <p className="text-sm text-[#4b5563]">
                    Your personalized rehabilitation schedule for optimal recovery.
                  </p>

                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="font-medium text-sm py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center">
                    {[
                      { day: "Mon", session: "Lower Body", active: true },
                      { day: "Tue", session: "Rest", active: false },
                      { day: "Wed", session: "Balance", active: true },
                      { day: "Thu", session: "Mobility", active: true },
                      { day: "Fri", session: "Rest", active: false },
                      { day: "Sat", session: "Lower Body", active: true },
                      { day: "Sun", session: "Rest", active: false },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg ${
                          item.active ? "bg-[#111827] text-white" : "bg-[#f3f4f6] text-[#4b5563] opacity-75"
                        }`}
                      >
                        <p className="text-xs">{item.session}</p>
                      </div>
                    ))}
                  </div>

                  <Card className="mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            name: "Lower Body Strength",
                            day: "Today",
                            time: "Any time",
                            duration: "30 minutes",
                          },
                          {
                            name: "Balance & Stability",
                            day: "Wednesday",
                            time: "Any time",
                            duration: "25 minutes",
                          },
                          {
                            name: "Mobility & Flexibility",
                            day: "Thursday",
                            time: "Any time",
                            duration: "20 minutes",
                          },
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-[#f3f4f6] w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                <Calendar className="h-5 w-5 text-[#111827]" />
                              </div>
                              <div>
                                <h3 className="font-medium">{session.name}</h3>
                                <p className="text-xs text-[#4b5563]">
                                  {session.day} • {session.time} • {session.duration}
                                </p>
                              </div>
                            </div>
                            {index === 0 && (
                              <Button size="sm" className="bg-[#111827] hover:bg-[#1f2937]">
                                Start
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="metrics">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#111827]">Recovery Metrics</h2>
                  <p className="text-sm text-[#4b5563]">Track your progress with detailed analytics.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <BarChart3 className="h-8 w-8 mx-auto mb-2 text-[#111827]" />
                          <h3 className="font-medium">Range of Motion</h3>
                          <div className="text-3xl font-bold my-2">65°</div>
                          <p className="text-xs text-green-600">↑ 15° improvement</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <BarChart3 className="h-8 w-8 mx-auto mb-2 text-[#111827]" />
                          <h3 className="font-medium">Pain Level</h3>
                          <div className="text-3xl font-bold my-2">3/10</div>
                          <p className="text-xs text-green-600">↓ 2 points improvement</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <BarChart3 className="h-8 w-8 mx-auto mb-2 text-[#111827]" />
                          <h3 className="font-medium">Strength</h3>
                          <div className="text-3xl font-bold my-2">40%</div>
                          <p className="text-xs text-green-600">↑ 10% improvement</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Weekly Progress</CardTitle>
                      <CardDescription>Last 4 weeks of your recovery journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-[#f3f4f6] rounded-md">
                        <p className="text-[#4b5563]">Progress chart will display here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center mt-6">
                    <Button variant="outline" className="border-[#111827] text-[#111827]">
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-between">
            <Link href="/assessment">
              <Button variant="outline" className="border-[#111827] text-[#111827]">
                Back to Assessment
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#111827] hover:bg-[#1f2937]">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
