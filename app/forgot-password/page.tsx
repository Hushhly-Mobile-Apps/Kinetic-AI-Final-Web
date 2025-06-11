"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)

  useEffect(() => {
    // Load countdown from localStorage if exists
    const storedTime = localStorage.getItem("passwordResetCountdown")
    const storedEmail = localStorage.getItem("passwordResetEmail")

    if (storedTime && storedEmail) {
      const remainingTime = Number.parseInt(storedTime) - Date.now()

      if (remainingTime > 0) {
        setEmail(storedEmail)
        setSubmitted(true)
        setCanResend(false)
        setCountdown(Math.ceil(remainingTime / 1000))
      } else {
        // Clear expired countdown
        localStorage.removeItem("passwordResetCountdown")
        localStorage.removeItem("passwordResetEmail")
      }
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)

        if (countdown === 1) {
          setCanResend(true)
          localStorage.removeItem("passwordResetCountdown")
          localStorage.removeItem("passwordResetEmail")
        }
      }, 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!canResend) {
      return
    }

    // Simulate password reset request
    console.log("Password reset requested for:", email)

    // Set 5-minute countdown (300 seconds)
    const waitTime = 300
    setCountdown(waitTime)
    setSubmitted(true)
    setCanResend(false)
    setError("")

    // Store countdown end time in localStorage
    const endTime = Date.now() + waitTime * 1000
    localStorage.setItem("passwordResetCountdown", endTime.toString())
    localStorage.setItem("passwordResetEmail", email)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#001a41] to-[#00487c] p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={80} height={80} />
        </div>
        {/* Removed KINETIC text */}
        <div className="mt-2">
          <div className="h-0.5 w-32 bg-purple-500 mx-auto mb-2"></div>
          <p className="text-gray-300 text-sm">Personalized Recovery Powered by Movement Intelligence</p>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reset Your Password</h2>

          {submitted ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">Email Sent</AlertTitle>
                <AlertDescription className="text-green-700">
                  If an account exists with {email}, you will receive password reset instructions shortly.
                </AlertDescription>
              </Alert>

              {!canResend && (
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                    <Clock className="h-5 w-5" />
                    <span>
                      You can request another reset in: <span className="font-semibold">{formatTime(countdown)}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    Resend Instructions
                  </Button>
                </div>
              )}

              {canResend && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    className="w-full border-[#3e82e7] text-[#3e82e7] hover:bg-[#3e82e7] hover:text-white"
                    onClick={() => {
                      setSubmitted(false)
                    }}
                  >
                    Resend Instructions
                  </Button>
                </div>
              )}

              <div className="text-center mt-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-[#3e82e7] text-[#3e82e7] hover:bg-[#3e82e7] hover:text-white"
                  >
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6 text-center">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 py-6"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 bg-[#53d08a] hover:bg-[#31bd7c] text-white font-medium rounded-md"
                >
                  Send Reset Instructions
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-[#3e82e7] hover:underline text-sm">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-white hover:underline text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
