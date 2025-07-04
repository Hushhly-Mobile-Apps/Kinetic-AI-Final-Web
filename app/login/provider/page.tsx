"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, AlertCircle, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProviderLoginPage() {
  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Register form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const { user, login, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      // Don't auto-redirect, let user manually navigate
      console.log("User logged in:", user)
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password, 'provider')
      if (result.success) {
        // Login successful - middleware will handle redirect
        console.log("Provider login successful")
      } else {
        setError(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login for demo purposes
  const handleQuickLogin = async () => {
    const providerEmail = "provider@gmail.com"
    const providerPassword = "provider"

    setEmail(providerEmail)
    setPassword(providerPassword)

    setError("")
    setIsLoading(true)

    try {
      const { success, error } = await login(providerEmail, providerPassword, 'provider')

      if (success) {
        // Login successful - middleware will handle redirect
        setError("")
      } else {
        setError(error || "Login failed. Please check your credentials and try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setIsRegistering(true)

    try {
      if (!firstName || !lastName || !specialization || !licenseNumber || !registerEmail || !registerPassword) {
        setRegisterError("All fields are required")
        return
      }

      if (registerPassword.length < 8) {
        setRegisterError("Password must be at least 8 characters")
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setRegisterSuccess(true)
      setFirstName("")
      setLastName("")
      setSpecialization("")
      setLicenseNumber("")
      setRegisterEmail("")
      setRegisterPassword("")

      setTimeout(() => {
        document.getElementById("login-tab")?.click()
        setEmail(registerEmail)
      }, 1500)

    } catch (err) {
      setRegisterError("An error occurred during registration. Please try again.")
      console.error(err)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#00305a] to-[#0066a2] px-4 py-6 sm:p-4">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Kinetic</h1>
        <p className="text-lg sm:text-xl text-white">Provider Portal</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mx-4 sm:mx-0">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="login" className="rounded-none py-4" id="login-tab">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-none py-4" id="register-tab">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="p-0">
            <div className="p-4 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-[#0066a2] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Provider Access</h2>
              <p className="text-black text-sm">
                Manage your patients and monitor their recovery progress
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-6"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-[#0066a2] hover:underline text-sm">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-[#0066a2] hover:bg-[#004d7a] text-white font-medium rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Quick Login Button */}
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-black mb-2 text-center">Demo Quick Login:</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={handleQuickLogin}
            >
              Provider Demo Login (provider@gmail.com / provider)
            </Button>
          </div>

          {/* Bypass to Dashboard Button */}
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-black mb-2 text-center">Quick Access:</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              onClick={() => {
                // Create a temporary provider user and redirect
                const tempUser = {
                  id: "temp-provider",
                  email: "demo@provider.com",
                  name: "Dr. Demo Provider",
                  role: "provider",
                  avatar: "/caring-doctor.png"
                }
                localStorage.setItem("kineticUser", JSON.stringify(tempUser))
                document.cookie = `kineticUser=${JSON.stringify(tempUser)}; path=/; max-age=86400`
                window.location.href = '/dashboard/provider'
              }}
            >
              🚀 Bypass to Provider Dashboard
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="register" className="p-0">
        <div className="p-4 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-[#0066a2] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">Provider Registration</h2>
              <p className="text-black text-sm">
                Create your provider account to access the platform
              </p>
            </div>
          </div>

          {registerError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{registerError}</AlertDescription>
            </Alert>
          )}

          {registerSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>
                Registration successful! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-black">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="py-6"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-black">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="py-6"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-black">
                Specialization
              </Label>
              <Input
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="py-6"
                placeholder="e.g., Physical Therapist, Orthopedic Specialist"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-black">
                License Number
              </Label>
              <Input
                id="licenseNumber"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="py-6"
                placeholder="Enter your professional license number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerEmail" className="text-black">
                Email
              </Label>
              <Input
                id="registerEmail"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="py-6"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerPassword" className="text-black">
                Password
              </Label>
              <Input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="py-6"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0066a2] hover:bg-[#005a91] text-white py-6"
              disabled={isRegistering}
            >
              {isRegistering ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </TabsContent>
    </Tabs>
  </div>

  <div className="mt-6 text-center">
    <p className="text-sm text-white">
      Are you a patient?{" "}
      <Link href="/login/patient" className="text-white hover:underline">
        Patient Login
    </Link>
    </p>
  </div>
</div>
  )
}
