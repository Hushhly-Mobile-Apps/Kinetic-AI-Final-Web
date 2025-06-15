"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, Download, FileText, Lock, Shield, Trash2, User, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function PrivacyPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // State for switches
  const [shareWithHealthcare, setShareWithHealthcare] = useState(true)
  const [shareWithResearch, setShareWithResearch] = useState(true)
  const [shareWithInsurance, setShareWithInsurance] = useState(true)

  // State for dropdowns
  const [exerciseProgressVisibility, setExerciseProgressVisibility] = useState("Healthcare Team Only")
  const [recoveryMilestonesVisibility, setRecoveryMilestonesVisibility] = useState("Healthcare Team Only")
  const [videoSubmissionsVisibility, setVideoSubmissionsVisibility] = useState("Healthcare Team Only")

  const handleSavePrivacySettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)

      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleDownloadData = () => {
    toast({
      title: "Data download initiated",
      description: "Your data is being prepared for download.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handleDeleteExerciseHistory = () => {
    toast({
      title: "Delete exercise history",
      description: "Are you sure you want to delete all exercise history? This action cannot be undone.",
      variant: "destructive",
      action: <ToastAction altText="Confirm">Confirm</ToastAction>,
    })
  }

  const handleDeleteVideoSubmissions = () => {
    toast({
      title: "Delete video submissions",
      description: "Are you sure you want to delete all video submissions? This action cannot be undone.",
      variant: "destructive",
      action: <ToastAction altText="Confirm">Confirm</ToastAction>,
    })
  }

  const handleViewTerms = () => {
    toast({
      title: "Terms of Service",
      description: "Opening Terms of Service document.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handleViewPrivacyPolicy = () => {
    toast({
      title: "Privacy Policy",
      description: "Opening Privacy Policy document.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handleCookiePreferences = () => {
    toast({
      title: "Cookie Preferences",
      description: "Opening cookie preferences settings.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
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
        <Link href="/profile/notifications" className="text-sm font-medium">
          Notifications
        </Link>
        <Link href="/profile/privacy" className="text-sm font-medium border-b-2 border-primary pb-4 -mb-4">
          Privacy
        </Link>
        <Link href="/profile/billing" className="text-sm font-medium">
          Billing
        </Link>
      </div>

      <div className="space-y-8">
        {/* Data Sharing */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Data Sharing</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Share with Healthcare Providers</div>
                  <div className="text-sm text-muted-foreground">Allow your therapist to access your data</div>
                </div>
              </div>
              <Switch
                checked={shareWithHealthcare}
                onCheckedChange={setShareWithHealthcare}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Share with Research Partners</div>
                  <div className="text-sm text-muted-foreground">Anonymized data for medical research</div>
                </div>
              </div>
              <Switch
                checked={shareWithResearch}
                onCheckedChange={setShareWithResearch}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Share with Insurance Provider</div>
                  <div className="text-sm text-muted-foreground">Allow your insurance to access progress data</div>
                </div>
              </div>
              <Switch
                checked={shareWithInsurance}
                onCheckedChange={setShareWithInsurance}
              />
            </div>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile Visibility</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Exercise Progress</div>
                  <div className="text-sm text-muted-foreground">Who can see your exercise completion data</div>
                </div>
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={exerciseProgressVisibility}
                onChange={(e) => setExerciseProgressVisibility(e.target.value)}
              >
                <option>Healthcare Team Only</option>
                <option>Healthcare Team & Family</option>
                <option>All Connections</option>
                <option>Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Recovery Milestones</div>
                  <div className="text-sm text-muted-foreground">Who can see your achievement badges</div>
                </div>
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={recoveryMilestonesVisibility}
                onChange={(e) => setRecoveryMilestonesVisibility(e.target.value)}
              >
                <option>Healthcare Team Only</option>
                <option>Healthcare Team & Family</option>
                <option>All Connections</option>
                <option>Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Video Submissions</div>
                  <div className="text-sm text-muted-foreground">Who can access your exercise videos</div>
                </div>
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={videoSubmissionsVisibility}
                onChange={(e) => setVideoSubmissionsVisibility(e.target.value)}
              >
                <option>Healthcare Team Only</option>
                <option>Healthcare Team & Family</option>
                <option>All Connections</option>
                <option>Private</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Data Management</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Download My Data</div>
                  <div className="text-sm text-muted-foreground">Export all your personal data</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownloadData}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Trash2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Delete Exercise History</div>
                  <div className="text-sm text-muted-foreground">Remove all exercise tracking data</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDeleteExerciseHistory}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Trash2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Delete Video Submissions</div>
                  <div className="text-sm text-muted-foreground">Remove all uploaded exercise videos</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDeleteVideoSubmissions}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Consent Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Consent Management</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Terms of Service</div>
                  <div className="text-sm text-muted-foreground">View and manage your agreement</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleViewTerms}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Privacy Policy</div>
                  <div className="text-sm text-muted-foreground">View our privacy policy</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleViewPrivacyPolicy}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Cookie Preferences</div>
                  <div className="text-sm text-muted-foreground">Manage website cookie settings</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCookiePreferences}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSavePrivacySettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </>
            ) : (
              'Save Privacy Settings'
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
