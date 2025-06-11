"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, User, Mail, Phone, Upload, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    dob: "05/12/1985",
    condition: "Rotator Cuff Injury",
    allergies: "None",
    medications: "Ibuprofen as needed",
    contactName: "Emily Johnson",
    relationship: "Spouse",
    contactPhone: "(555) 987-6543"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSaveChanges = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleRemovePhoto = () => {
    toast({
      title: "Profile photo removed",
      description: "Your profile photo has been removed.",
      variant: "destructive",
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    })
  }

  const handleUploadPhoto = () => {
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    // Handle file selection
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Simulate upload
        toast({
          title: "Uploading photo...",
          description: "Your profile photo is being uploaded.",
        })

        // Simulate success after 2 seconds
        setTimeout(() => {
          toast({
            title: "Profile photo updated",
            description: "Your new profile photo has been set.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          })
        }, 2000)
      }
    }

    // Trigger file selection dialog
    input.click()
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
        <Link href="/profile" className="text-sm font-medium border-b-2 border-primary pb-4 -mb-4">
          Personal Info
        </Link>
        <Link href="/profile/account-settings" className="text-sm font-medium">
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
        {/* Profile Picture */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile Picture</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                    <User className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-center sm:text-left">Alex Johnson</h3>
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Upload a new photo or edit your current profile picture
                  </p>
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <Button size="sm" className="gap-1" onClick={handleUploadPhoto}>
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={handleRemovePhoto}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative">
                <Input
                  id="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Medical Information</h2>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Primary Condition</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={formData.medications}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Emergency Contact</h2>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <div className="relative">
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                />
                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button variant="outline">Cancel</Button>

          {showSuccess && (
            <div className="flex items-center text-green-600 ml-2">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Changes saved successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
