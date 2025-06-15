import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

// Fallback to FastAPI backend for legacy support
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json()
    const supabase = createServerSupabaseClient()
    
    // Handle different auth actions
    switch (action) {
      case 'register':
        const { name, role } = await request.json()
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role }
          }
        })
        
        if (signUpError) {
          return NextResponse.json(
            { success: false, message: signUpError.message },
            { status: 400 }
          )
        }
        
        // Create profile in profiles table
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: signUpData.user.id,
              name: name || email.split('@')[0],
              email,
              role: role || 'patient',
              created_at: new Date().toISOString()
            }])
            
          if (profileError) {
            console.error('Profile creation error:', profileError)
          }
        }
        
        return NextResponse.json({
          success: true,
          message: 'Registration successful! Please check your email to confirm your account.'
        })
        
      case 'magic-link':
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${request.headers.get('origin')}/auth/callback`
          }
        })
        
        if (otpError) {
          return NextResponse.json(
            { success: false, message: otpError.message },
            { status: 400 }
          )
        }
        
        return NextResponse.json({
          success: true,
          message: 'Magic link sent! Please check your email.'
        })
        
      case 'reset-password':
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${request.headers.get('origin')}/reset-password`
        })
        
        if (resetError) {
          return NextResponse.json(
            { success: false, message: resetError.message },
            { status: 400 }
          )
        }
        
        return NextResponse.json({
          success: true,
          message: 'Password reset instructions sent to your email'
        })
        
      case 'login':
      default:
        // Use Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) {
          return NextResponse.json(
            { success: false, message: error.message },
            { status: 401 }
          )
        }
        
        if (!data.user) {
          return NextResponse.json(
            { success: false, message: 'Login failed' },
            { status: 401 }
          )
        }
        
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.email?.split('@')[0] || 'User',
          role: profile?.role || 'patient',
          avatar: profile?.avatar_url
        }
        
        return NextResponse.json({
          success: true,
          user,
          token: data.session?.access_token
        })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication service unavailable' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'No active session' },
        { status: 401 }
      )
    }
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      
    const user = {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.name || session.user.email?.split('@')[0] || 'User',
      role: profile?.role || 'patient',
      avatar: profile?.avatar_url
    }
    
    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication service unavailable' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { password, profile } = await request.json()
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Update password if provided
    if (password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password
      })
      
      if (passwordError) {
        return NextResponse.json(
          { success: false, message: passwordError.message },
          { status: 400 }
        )
      }
    }
    
    // Update profile if provided
    if (profile) {
      // Update auth metadata if name is provided
      if (profile.name) {
        await supabase.auth.updateUser({
          data: { name: profile.name }
        })
      }
      
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          avatar_url: profile.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id)
      
      if (profileError) {
        return NextResponse.json(
          { success: false, message: profileError.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, message: 'Profile update service unavailable' },
      { status: 500 }
    )
  }
}