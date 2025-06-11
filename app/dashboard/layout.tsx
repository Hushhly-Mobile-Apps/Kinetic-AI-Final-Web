"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if not logged in
    if (!isLoading && !user) {
      console.log("No user found, redirecting to login")
      router.push("/login/patient")
    }
  }, [user, isLoading, router])

  // If no user, return empty until redirect happens
  if (!user && !isLoading) {
    return null
  }

  return <>{children}</>
}
