"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is a patient
    if (!isLoading) {
      if (!user) {
        console.log("No user found, redirecting to patient login")
        router.push("/login/patient")
      } else if (user.role !== "patient") {
        console.log("User is not a patient, redirecting to appropriate dashboard")
        router.push("/dashboard/provider")
      }
    }
  }, [user, isLoading, router])

  // If no user or not a patient, return empty until redirect happens
  if ((!user || user.role !== "patient") && !isLoading) {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}