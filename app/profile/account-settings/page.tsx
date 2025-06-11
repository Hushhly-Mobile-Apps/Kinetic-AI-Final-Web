"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, Globe, Moon, Shield, Mail, Clock, Download, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AccountSettingsPage() {
  const { toast } = useToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleTwoFactorToggle = () => {
    const newState = !twoFactorEnabled
    setTwoFactorEnabled(newState)

    toast({
      title: newState ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      description: newState
        ? "Your account is now more secure."
        : "Two-factor authentication has been turned off.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handleDarkModeToggle = () => {
    const newState = !darkModeEnabled
    setDarkModeEnabled(newState)

    toast({
      title: newState ? "Dark mode enabled" : "Dark mode disabled",
      description: "Your preference has been saved.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handlePasswordSubmit = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new password and confirmation match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false)
      setPasswordDialogOpen(false)

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })

      toast({
        title: "Password changed successfully",
        description: "Your password has been updated.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
    }, 1500)
  }

  const handleLanguageSelect = () => {
    toast({
      title: "Language selection",
      description: "Language preferences updated.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handleTimezoneSelect = () => {
    toast({
      title: "Timezone selection",
      description: "Timezone preferences updated.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handleRequestData = () => {
    toast({
      title: "Data request submitted",
      description: "We'll process your request and email you when your data is ready to download.",
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  const handleDeactivateAccount = () => {
    toast({
      title: "Account deactivation",
      description: "Please contact support to deactivate your account.",
      variant: "destructive",
      action: <ToastAction altText="Contact Support">Contact Support</ToastAction>,
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
        <Link href="/profile/account-settings" className="text-sm font-medium border-b-2 border-primary pb-4 -mb-4">
          Account Settings
        </Link>
        <Link href="/profile/notifications" className="text-sm font-medium">
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
        {/* Login & Security */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Login & Security</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Email Address</div>
                  <div className="text-sm text-muted-foreground">alex.johnson@example.com</div>
                </div>
              </div>
            </div>

            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and a new password to update your credentials.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={isChangingPassword}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isChangingPassword ? (
                      <>
                        <span className="mr-2">Saving...</span>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                </div>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
              />
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">App Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Language</div>
                  <div className="text-sm text-muted-foreground">English (US)</div>
                </div>
              </div>
              <Button variant="ghost" onClick={handleLanguageSelect}>Select</Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Time Zone</div>
                  <div className="text-sm text-muted-foreground">Pacific Time (US & Canada)</div>
                </div>
              </div>
              <Button variant="ghost" onClick={handleTimezoneSelect}>Select</Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Moon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">Use dark theme throughout the app</div>
                </div>
              </div>
              <Switch
                checked={darkModeEnabled}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connected Accounts</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Google</div>
                  <div className="text-sm text-muted-foreground">Connected</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Apple Health</div>
                  <div className="text-sm text-muted-foreground">Not connected</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Account Management</h2>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 flex items-center justify-center bg-blue-50 rounded-full">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Download Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Get a copy of your personal data in a machine-readable format
                </p>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRequestData}
              >
                Request Data
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleDeactivateAccount}
          >
            Deactivate Account
          </Button>
        </div>
      </div>
    </div>
  )
}
