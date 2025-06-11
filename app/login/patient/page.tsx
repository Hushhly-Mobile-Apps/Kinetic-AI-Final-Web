"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PatientLoginPage() {
  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Register form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const { user, login, register, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      // Don't auto-redirect, let user manually navigate
      console.log("User logged in:", user)
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { success, error } = await login(email, password)

      if (success) {
        // Get the logged in user from localStorage since state might not be updated yet
        const loggedInUser = JSON.parse(localStorage.getItem("kineticUser") || "{}")
        
        if (loggedInUser.role === "patient") {
          // Auto-redirect to dashboard after successful login
          router.push("/dashboard")
        } else {
          setError("This login is for patients only. Please use the provider login.")
        }
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
    e.preventDefault();
    setRegisterError("");
    setIsRegistering(true);

    try {
      // Validate form
      if (!firstName || !lastName || !registerEmail || !registerPassword) {
        setRegisterError("All fields are required");
        setIsRegistering(false);
        return;
      }

      if (registerPassword.length < 8) {
        setRegisterError("Password must be at least 8 characters");
        setIsRegistering(false);
        return;
      }

      // Use Auth provider to register the user
      const fullName = `${firstName} ${lastName}`;
      const { success, error } = await register(registerEmail, registerPassword, fullName, "patient");

      if (success) {
        // Show success message and reset form
        setRegisterSuccess(true);
        setFirstName("");
        setLastName("");
        setRegisterEmail("");
        setRegisterPassword("");

        // Automatically switch to login tab after successful registration
        setTimeout(() => {
          document.getElementById("login-tab")?.click();
          setEmail(registerEmail);
        }, 1500);
      } else {
        setRegisterError(error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setRegisterError("An error occurred during registration. Please try again.");
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  // For demo purposes, let's add a quick login function
  const handleQuickLogin = async (userType: string) => {
    let loginEmail = "";
    let loginPassword = "";

    if (userType === "patient") {
      loginEmail = "sarah@example.com";
      loginPassword = "password123";
    } else if (userType === "provider") {
      loginEmail = "johnson@clinic.com";
      loginPassword = "doctor123";
    }

    setEmail(loginEmail);
    setPassword(loginPassword);

    // Automatically login after setting credentials
    setError("");
    setIsLoading(true);

    try {
      const { success, error } = await login(loginEmail, loginPassword);

      if (success) {
        // Get the logged in user from localStorage since state might not be updated yet
        const loggedInUser = JSON.parse(localStorage.getItem("kineticUser") || "{}")
        
        if (loggedInUser.role === "patient") {
          router.push("/dashboard");
        } else {
          setError("This login is for patients only. Please use the provider login.");
        }
      } else {
        setError(error || "Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000a2c] to-[#00487c] p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={80} height={80} />
        </div>
        <h1 className="text-3xl font-bold text-black mb-1">Kinetic</h1>
        <p className="text-xl text-black">Patient Portal</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
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
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#53d08a] w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-black">Patient Access</h2>
                  <p className="text-black text-sm">
                    Access your personalized recovery plan and track your progress
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
                  <Link href="/forgot-password" className="text-black hover:underline text-sm">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 bg-[#53d08a] hover:bg-[#31bd7c] text-white font-medium rounded-md"
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

              {/* Demo Quick Login Buttons */}
              <div className="mt-4 border-t pt-4">
                <p className="text-xs text-black mb-2 text-center">Demo Quick Login:</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleQuickLogin("patient")}
                  >
                    Patient Login
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleQuickLogin("provider")}
                  >
                    Provider Login
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-black mb-2">
                  Don&apos;t have an account?{" "}
                  <button
                    className="text-black hover:underline"
                    onClick={() => document.getElementById("register-tab")?.click()}
                  >
                    Register now
                  </button>
                </p>
                <p className="text-sm text-black">
                  Are you a healthcare provider?{" "}
                  <Link href="/login/provider" className="text-black hover:underline">
                    Provider Login
                  </Link>
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="register" className="p-0">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#53d08a] w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-black">Create Account</h2>
                  <p className="text-black text-sm">Join Kinetic to start your personalized recovery journey</p>
                </div>
              </div>

              {registerSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">Registration Successful!</h3>
                  <p className="text-black mb-4">Your account has been created successfully.</p>
                  <p className="text-sm text-black">You can now log in with your credentials.</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  {registerError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-black">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        className="py-6"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-black">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        className="py-6"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail" className="text-black">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10 py-6"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword" className="text-black">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10 py-6"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                    <p className="text-xs text-black">
                      Password must be at least 8 characters with a number and special character
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 bg-[#53d08a] hover:bg-[#31bd7c] text-white font-medium rounded-md mt-4"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span> Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-black">
                  Already have an account?{" "}
                  <button
                    className="text-black hover:underline"
                    onClick={() => document.getElementById("login-tab")?.click()}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-8 py-4 bg-gray-50 text-center">
          <p className="text-xs text-black">
            By signing in or creating an account, you agree to our{" "}
            <Link href="/terms" className="text-black hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-black hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-black hover:underline text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
