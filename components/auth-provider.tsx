"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabase-client"
import { toast } from "sonner"

// Define user types
export type UserRole = "patient" | "provider" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>
  loginWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (profile: Partial<User>) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize user session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (userProfile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userProfile.name || session.user.email?.split('@')[0] || 'User',
              role: userProfile.role || 'patient',
              avatar: userProfile.avatar_url
            })
          } else {
            // Create profile if doesn't exist
            const defaultUserProfile = {
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: 'patient',
              created_at: new Date().toISOString(),
            }
            
            await supabase.from('profiles').insert([defaultUserProfile])
            setUser(defaultUserProfile)
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get or create user profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        if (userProfile) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: userProfile.name || session.user.email?.split('@')[0] || 'User',
            role: userProfile.role || 'patient',
            avatar: userProfile.avatar_url
          })
        } else {
          // Create profile if doesn't exist
          const newProfile = {
            id: session.user.id,
            name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'patient',
            created_at: new Date().toISOString(),
          }
          
          await supabase.from('profiles').insert([newProfile])
          setUser(newProfile)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })
    
    initializeAuth()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      if (data.user) {
        // Get user profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          
        if (userProfile) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: userProfile.name || data.user.email?.split('@')[0] || 'User',
            role: userProfile.role || 'patient',
            avatar: userProfile.avatar_url
          })
        }
        
        return { success: true }
      }
      
      return { success: false, error: "Unable to login" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Authentication service unavailable" }
    }
  }
  
  const register = async (
    email: string, 
    password: string, 
    name: string,
    role: UserRole = 'patient'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      if (data.user) {
        // Create user profile
        const newProfile = {
          id: data.user.id,
          name,
          email: data.user.email || '',
          role,
          created_at: new Date().toISOString(),
        }
        
        const { error: profileError } = await supabase.from('profiles').insert([newProfile])
        
        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
        
        toast.success("Registration successful! Please check your email to confirm your account.")
        return { success: true }
      }
      
      return { success: false, error: "Unable to register" }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Registration service unavailable" }
    }
  }
  
  const loginWithMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      toast.success("Magic link sent! Please check your email.")
      return { success: true }
    } catch (error) {
      console.error("Magic link error:", error)
      return { success: false, error: "Authentication service unavailable" }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      toast.success("Password reset instructions sent to your email")
      return { success: true }
    } catch (error) {
      console.error("Password reset error:", error)
      return { success: false, error: "Service unavailable" }
    }
  }
  
  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      toast.success("Password updated successfully")
      return { success: true }
    } catch (error) {
      console.error("Update password error:", error)
      return { success: false, error: "Service unavailable" }
    }
  }
  
  const updateProfile = async (profile: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: "Not authenticated" }
      }
      
      // Update auth metadata if name is provided
      if (profile.name) {
        await supabase.auth.updateUser({
          data: { name: profile.name }
        })
      }
      
      // Update profile in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          avatar_url: profile.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      // Update local user state
      setUser({ ...user, ...profile })
      
      toast.success("Profile updated successfully")
      return { success: true }
    } catch (error) {
      console.error("Update profile error:", error)
      return { success: false, error: "Service unavailable" }
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register,
        loginWithMagicLink,
        logout, 
        resetPassword,
        updatePassword,
        updateProfile,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}