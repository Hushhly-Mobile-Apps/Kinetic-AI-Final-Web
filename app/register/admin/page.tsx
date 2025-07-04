"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function AdminRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [emailUpdates, setEmailUpdates] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000a2c] to-[#00487c] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={80} height={80} />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-8">Create your account</h1>

        <Tabs defaultValue="admin" className="w-full mb-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="patient" asChild>
              <Link href="/register/patient">Patient</Link>
            </TabsTrigger>
            <TabsTrigger value="physiotherapist" asChild>
              <Link href="/register/physiotherapist">Physiotherapist</Link>
            </TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
        </Tabs>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-white">
              Full Name
            </label>
            <Input id="fullName" placeholder="Enter your full name" className="bg-white h-12 rounded-md" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="bg-white h-12 rounded-md pr-10"
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (min. 8 characters)"
                className="bg-white h-12 rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="bg-white h-12 rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center h-5">
              <Switch id="terms" checked={termsAgreed} onCheckedChange={setTermsAgreed} />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-white">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-300 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-300 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center h-5">
              <Switch id="updates" checked={emailUpdates} onCheckedChange={setEmailUpdates} />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="updates" className="text-white">
                I consent to receive email updates about new features
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-white hover:bg-gray-100 text-[#00487c] font-semibold">
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white text-sm mb-4">Or sign up with</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="bg-white hover:bg-gray-100 px-6">
              Google
            </Button>
            <Button variant="outline" className="bg-white hover:bg-gray-100 px-6">
              Apple
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
