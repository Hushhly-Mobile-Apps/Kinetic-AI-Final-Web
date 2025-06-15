"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function ProviderDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is a provider
    if (!isLoading) {
      if (!user) {
        console.log("No user found, redirecting to provider login")
        router.push("/login/provider")
      } else if (user.role !== "provider") {
        console.log("User is not a provider, redirecting to appropriate dashboard")
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  // If no user or not a provider, return empty until redirect happens
  if ((!user || user.role !== "provider") && !isLoading) {
    return null
  }

  return <>{children}</>
}
