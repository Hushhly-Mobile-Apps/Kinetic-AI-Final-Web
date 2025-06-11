"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Calendar, CheckCircle, Clock, FileText, MessageSquare, Shield, Trophy, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Email notification states
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [exerciseUpdates, setExerciseUpdates] = useState(true)
  const [progressReports, setProgressReports] = useState(true)
  const [accountUpdates, setAccountUpdates] = useState(true)

  // Push notification states
  const [enablePush, setEnablePush] = useState(true)
  const [appointmentAlerts, setAppointmentAlerts] = useState(true)
  const [exerciseReminders, setExerciseReminders] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)

  // In-app notification states
  const [achievementBadges, setAchievementBadges] = useState(true)
  const [milestoneAlerts, setMilestoneAlerts] = useState(true)
  const [feedbackRequests, setFeedbackRequests] = useState(true)

  // Quiet hours
  const [quietHours, setQuietHours] = useState(true)
  const [startTime, setStartTime] = useState("22:00")
  const [endTime, setEndTime] = useState("07:00")

  const handleSaveNotifications = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)

      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated successfully.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Management</h1>
          <p className="text-muted-foreground">Manage your personal information and account settings</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b pb-4">
        <Link href="/profile" className="text-sm font-medium">
          Personal Info
        </Link>
        <Link href="/profile/account-settings" className="text-sm font-medium">
          Account Settings
        </Link>
        <Link href="/profile/notifications" className="text-sm font-medium border-b-2 border-primary pb-4 -mb-4">
          Notifications
        </Link>
        <Link href="/profile/privacy" className="text-sm font-medium">
          Privacy
        </Link>
        <Link href="/profile/billing" className="text-sm font-medium">
          Billing
        </Link>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Email Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Appointment Reminders</div>
                  <div className="text-sm text-muted-foreground">Receive emails about upcoming appointments</div>
                </div>
              </div>
              <Switch
                checked={appointmentReminders}
                onCheckedChange={setAppointmentReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Exercise Updates</div>
                  <div className="text-sm text-muted-foreground">Get notified when new exercises are assigned</div>
                </div>
              </div>
              <Switch
                checked={exerciseUpdates}
                onCheckedChange={setExerciseUpdates}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Progress Reports</div>
                  <div className="text-sm text-muted-foreground">Weekly summary of your recovery progress</div>
                </div>
              </div>
              <Switch
                checked={progressReports}
                onCheckedChange={setProgressReports}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Account Updates</div>
                  <div className="text-sm text-muted-foreground">Security and account-related notifications</div>
                </div>
              </div>
              <Switch
                checked={accountUpdates}
                onCheckedChange={setAccountUpdates}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Push Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Enable Push Notifications</div>
                  <div className="text-sm text-muted-foreground">Allow notifications on your device</div>
                </div>
              </div>
              <Switch
                checked={enablePush}
                onCheckedChange={setEnablePush}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Appointment Alerts</div>
                  <div className="text-sm text-muted-foreground">Get reminders 1 hour before appointments</div>
                </div>
              </div>
              <Switch
                checked={appointmentAlerts}
                onCheckedChange={setAppointmentAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Exercise Reminders</div>
                  <div className="text-sm text-muted-foreground">Daily reminders to complete your exercises</div>
                </div>
              </div>
              <Switch
                checked={exerciseReminders}
                onCheckedChange={setExerciseReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Messages</div>
                  <div className="text-sm text-muted-foreground">Notifications for new messages</div>
                </div>
              </div>
              <Switch
                checked={messageNotifications}
                onCheckedChange={setMessageNotifications}
              />
            </div>
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">In-App Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Achievement Badges</div>
                  <div className="text-sm text-muted-foreground">Notifications for earned achievements</div>
                </div>
              </div>
              <Switch
                checked={achievementBadges}
                onCheckedChange={setAchievementBadges}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Milestone Alerts</div>
                  <div className="text-sm text-muted-foreground">Notifications when you reach recovery milestones</div>
                </div>
              </div>
              <Switch
                checked={milestoneAlerts}
                onCheckedChange={setMilestoneAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Feedback Requests</div>
                  <div className="text-sm text-muted-foreground">Prompts to provide feedback after sessions</div>
                </div>
              </div>
              <Switch
                checked={feedbackRequests}
                onCheckedChange={setFeedbackRequests}
              />
            </div>
          </div>
        </div>

        {/* Notification Schedule */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notification Schedule</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Quiet Hours</div>
                  <div className="text-sm text-muted-foreground">Don't send notifications during selected hours</div>
                </div>
              </div>
              <Switch
                checked={quietHours}
                onCheckedChange={setQuietHours}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-time" className="text-sm font-medium">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="end-time" className="text-sm font-medium">
                  End Time
                </label>
                <div className="relative">
                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSaveNotifications}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </>
            ) : (
              'Save Notification Preferences'
            )}
          </Button>

          {showSuccess && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Settings saved successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
