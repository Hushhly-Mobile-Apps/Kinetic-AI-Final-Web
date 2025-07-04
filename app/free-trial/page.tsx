'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { CheckCircle, Sparkles, Camera, Activity } from "lucide-react"

export default function FreeTrialPage() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    condition: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setIsSuccessOpen(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafb] p-4">
      <header className="w-full bg-[#111827] text-white py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={40} height={40} />
            <span className="font-bold text-xl">KINETIC</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#111827] mb-2">Start Your Free Trial</h1>
              <p className="text-gray-600">Experience AI-powered rehabilitation</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter your phone number" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Rehabilitation Focus</Label>
                <Select onValueChange={(value) => setFormData({...formData, condition: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary concern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="knee">Knee Injury/Pain</SelectItem>
                    <SelectItem value="shoulder">Shoulder Injury/Pain</SelectItem>
                    <SelectItem value="back">Back Pain</SelectItem>
                    <SelectItem value="hip">Hip Injury/Pain</SelectItem>
                    <SelectItem value="ankle">Ankle Injury/Pain</SelectItem>
                    <SelectItem value="general">General Fitness</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Start Free Trial
                </Button>
              </div>
              <p className="text-sm text-[#4b5563] text-center">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-[#111827] underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#111827] underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-[#111827] text-sm hover:underline">
                Back to Home
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">What's Included in Your Free Trial</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Real-time Pose Detection</h3>
                  <p className="text-sm text-gray-600">AI-powered movement analysis using your camera</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Personalized Exercises</h3>
                  <p className="text-sm text-gray-600">Customized rehabilitation programs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Instant Feedback</h3>
                  <p className="text-sm text-gray-600">Real-time form correction and guidance</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Progress Tracking</h3>
                  <p className="text-sm text-gray-600">Detailed analytics and improvement metrics</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">14 Days</p>
                <p className="text-sm text-gray-600">Completely Free</p>
                <p className="text-xs text-gray-500 mt-2">No credit card required</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
                Welcome to Kinetic AI!
              </DialogTitle>
              <p className="text-gray-600 mb-6">
                Your free trial has been activated. Check your email for login instructions.
              </p>
              <div className="space-y-3">
                <Link href="/login/patient">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" className="w-full">
                    Watch Demo First
                  </Button>
                </Link>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
