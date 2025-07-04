"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Define user types
export type UserRole = "patient" | "provider" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "ayu.wulandari@kinetic.co.id",
    password: "password123",
    name: "Ayu Wulandari",
    role: "patient" as UserRole,
    avatar: "/smiling-brown-haired-woman.png"
  },
  {
    id: "2",
    email: "dr.budi.santoso@kinetic.co.id",
    password: "doctor123",
    name: "Dr. Budi Santoso",
    role: "provider" as UserRole,
    avatar: "/caring-doctor.png"
  },
  {
    id: "3",
    email: "admin@kinetic.co.id",
    password: "admin123",
    name: "Admin Kinetic",
    role: "admin" as UserRole,
  },
  {
    id: "4",
    email: "agus.pratama@kinetic.co.id",
    password: "password123",
    name: "Agus Pratama",
    role: "patient" as UserRole,
    avatar: "/athletic-man-short-hair.png"
  },
  {
    id: "5",
    email: "melati.sari@kinetic.co.id",
    password: "password123",
    name: "Melati Sari",
    role: "patient" as UserRole,
  },
  {
    id: "6",
    email: "dr.lisa.tan@kinetic.co.id",
    password: "doctor123",
    name: "Dr. Lisa Tan",
    role: "provider" as UserRole,
  },
  {
    id: "7",
    email: "dr.wijaya@kinetic.co.id",
    password: "provider",
    name: "Dr. Wijaya Saputra",
    role: "provider" as UserRole,
    avatar: "/older-man-glasses.png"
  }
]

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, portalType?: 'patient' | 'provider') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("kineticUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("kineticUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, portalType?: 'patient' | 'provider'): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // First, try to find existing user
      const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
      
      if (foundUser) {
        // Use existing user data
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("kineticUser", JSON.stringify(userWithoutPassword))
        document.cookie = `kineticUser=${JSON.stringify(userWithoutPassword)}; path=/; max-age=86400`
        return { success: true }
      }
      
      // If no existing user found, create a new user based on portal type
      if (email && password) {
        const isProvider = portalType === 'provider' || 
                          email.toLowerCase().includes('provider') || 
                          email.toLowerCase().includes('doctor') || 
                          email.toLowerCase().includes('clinic') ||
                          email.toLowerCase().includes('dr.') ||
                          email.toLowerCase().includes('physio') ||
                          email.toLowerCase().includes('therapist')
        
        const userName = email.split('@')[0]
          .split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ')
        
        const newUser: User = {
          id: Date.now().toString(),
          email: email,
          name: userName,
          role: isProvider ? 'provider' : 'patient',
          avatar: isProvider ? '/caring-doctor.png' : '/smiling-brown-haired-woman.png'
        }
        
        setUser(newUser)
        localStorage.setItem("kineticUser", JSON.stringify(newUser))
        document.cookie = `kineticUser=${JSON.stringify(newUser)}; path=/; max-age=86400`
        
        return { success: true }
      }
      
      return { success: false, error: "Please enter valid credentials" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kineticUser")
    // Clear the cookie by setting an expired date
    document.cookie = 'kineticUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login'
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
