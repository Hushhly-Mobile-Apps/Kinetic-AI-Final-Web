import { useAuth } from '@/components/auth-provider'
import supabase from '@/lib/supabase-client'
import { toast } from 'sonner'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

export function useAuthApi() {
  const { user, logout } = useAuth()

  const makeAuthenticatedRequest = async (url: string, options: ApiOptions = {}) => {
    // Check if we have a session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      toast.error('Your session has expired. Please log in again.')
      logout()
      throw new Error('No authentication session found')
    }

    const { method = 'GET', body, headers = {} } = options

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...headers
      }
    }

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, requestOptions)
      
      // Handle token expiration
      if (response.status === 401) {
        toast.error('Your session has expired. Please log in again.')
        logout()
        throw new Error('Session expired. Please log in again.')
      }
      
      const data = await response.json()
      
      if (!response.ok) {
        toast.error(data.message || `Request failed: ${response.status}`)
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }
  
  // Profile and user management functions
  const updateProfile = async (profileData: any) => {
    return makeAuthenticatedRequest('/api/auth', {
      method: 'PUT',
      body: {
        profile: profileData
      }
    })
  }
  
  const updatePassword = async (password: string) => {
    return makeAuthenticatedRequest('/api/auth', {
      method: 'PUT',
      body: {
        password
      }
    })
  }

  // Video call functions
  const startVideoCall = async (targetId: string, sessionData?: any) => {
    const result = await makeAuthenticatedRequest('/api/video-call', {
      method: 'POST',
      body: {
        userId: user?.id,
        targetId,
        type: 'start-session',
        sessionData
      }
    })
    
    // Store session in Supabase for persistence
    if (result.success && result.sessionId) {
      await supabase.from('video_sessions').insert([{
        id: result.sessionId,
        user_id: user?.id,
        target_id: targetId,
        status: 'active',
        started_at: new Date().toISOString(),
        metadata: sessionData || {}
      }])
    }
    
    return result
  }

  const sendWebRTCOffer = async (sessionId: string, targetId: string, offer: RTCSessionDescriptionInit) => {
    return makeAuthenticatedRequest('/api/video-call', {
      method: 'POST',
      body: {
        userId: user?.id,
        targetId,
        type: 'offer',
        sessionData: { sessionId },
        offer
      }
    })
  }

  const sendWebRTCAnswer = async (sessionId: string, answer: RTCSessionDescriptionInit) => {
    return makeAuthenticatedRequest('/api/video-call', {
      method: 'POST',
      body: {
        userId: user?.id,
        type: 'answer',
        sessionData: { sessionId },
        answer
      }
    })
  }

  const sendICECandidate = async (sessionId: string, candidate: RTCIceCandidate) => {
    return makeAuthenticatedRequest('/api/video-call', {
      method: 'POST',
      body: {
        userId: user?.id,
        type: 'ice-candidate',
        sessionData: { sessionId },
        candidate
      }
    })
  }

  const endVideoCall = async (sessionId: string) => {
    const result = await makeAuthenticatedRequest('/api/video-call', {
      method: 'POST',
      body: {
        userId: user?.id,
        type: 'end-session',
        sessionData: { sessionId }
      }
    })
    
    // Update session status in Supabase
    if (result.success) {
      await supabase.from('video_sessions')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    }
    
    return result
  }

  // Pose estimation functions
  const analyzePoseData = async (poseData: any, videoFrame?: string, sessionId?: string) => {
    const result = await makeAuthenticatedRequest('/api/pose-estimation', {
      method: 'POST',
      body: {
        poseData,
        videoFrame,
        sessionId
      }
    })
    
    // Store results in Supabase for persistence
    if (result.success && result.analysis) {
      await supabase.from('pose_analyses').insert([{
        user_id: user?.id,
        session_id: sessionId,
        pose_data: poseData,
        analysis: result.analysis,
        feedback: result.feedback,
        score: result.score,
        created_at: new Date().toISOString()
      }])
    }
    
    return result
  }

  const getPoseHistory = async (sessionId?: string) => {
    // Try to get from Supabase first for better performance
    if (sessionId) {
      const { data, error } = await supabase
        .from('pose_analyses')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        return { success: true, history: data }
      }
    }
    
    // Fall back to API if needed
    const url = sessionId ? `/api/pose-estimation?sessionId=${sessionId}` : '/api/pose-estimation'
    return makeAuthenticatedRequest(url, { method: 'GET' })
  }

  const getVideoCallSession = async (sessionId: string) => {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('video_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    if (!error && data) {
      return { success: true, session: data }
    }
    
    // Fall back to API
    return makeAuthenticatedRequest(`/api/video-call?sessionId=${sessionId}`, { method: 'GET' })
  }

  const getActiveVideoCallSessions = async () => {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('video_sessions')
      .select('*')
      .eq('status', 'active')
      .or(`user_id.eq.${user?.id},target_id.eq.${user?.id}`)
    
    if (!error && data) {
      return { success: true, sessions: data }
    }
    
    // Fall back to API
    return makeAuthenticatedRequest('/api/video-call', { method: 'GET' })
  }
  
  // Calendar and appointments
  const createAppointment = async (appointmentData: any) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        user_id: user?.id,
        provider_id: appointmentData.providerId,
        title: appointmentData.title,
        description: appointmentData.description,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        status: 'scheduled',
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) {
      toast.error('Failed to create appointment')
      throw error
    }
    
    toast.success('Appointment scheduled successfully')
    return { success: true, appointment: data?.[0] }
  }
  
  const getAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .or(`user_id.eq.${user?.id},provider_id.eq.${user?.id}`)
      .order('start_time', { ascending: true })
    
    if (error) {
      toast.error('Failed to load appointments')
      throw error
    }
    
    return { success: true, appointments: data }
  }
  
  const updateAppointment = async (id: string, updateData: any) => {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        title: updateData.title,
        description: updateData.description,
        start_time: updateData.startTime,
        end_time: updateData.endTime,
        status: updateData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) {
      toast.error('Failed to update appointment')
      throw error
    }
    
    toast.success('Appointment updated successfully')
    return { success: true, appointment: data?.[0] }
  }

  // Therapy progress tracking
  const saveProgressNote = async (note: any) => {
    const { data, error } = await supabase
      .from('progress_notes')
      .insert([{
        user_id: user?.id,
        provider_id: note.providerId,
        session_id: note.sessionId,
        content: note.content,
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) {
      toast.error('Failed to save progress note')
      throw error
    }
    
    return { success: true, note: data?.[0] }
  }
  
  const getProgressNotes = async (sessionId?: string) => {
    let query = supabase
      .from('progress_notes')
      .select('*')
      
    if (user?.role === 'patient') {
      query = query.eq('user_id', user.id)
    } else if (user?.role === 'provider') {
      query = query.eq('provider_id', user.id)
    }
    
    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      toast.error('Failed to load progress notes')
      throw error
    }
    
    return { success: true, notes: data }
  }

  return {
    makeAuthenticatedRequest,
    // User profile
    updateProfile,
    updatePassword,
    // Video calls
    startVideoCall,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendICECandidate,
    endVideoCall,
    getVideoCallSession,
    getActiveVideoCallSessions,
    // Pose estimation
    analyzePoseData,
    getPoseHistory,
    // Appointments
    createAppointment,
    getAppointments,
    updateAppointment,
    // Progress tracking
    saveProgressNote,
    getProgressNotes
  }
}