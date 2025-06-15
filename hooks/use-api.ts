import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'

// Generic API hook
export function useApi<T>(endpoint: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }
      
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  return { data, loading, error, refetch: fetchData }
}

// Appointments API hooks
export function useAppointments(patientId?: string, status?: string) {
  const params = new URLSearchParams()
  if (patientId) params.append('patientId', patientId)
  if (status) params.append('status', status)
  
  const endpoint = `/api/appointments${params.toString() ? `?${params.toString()}` : ''}`
  return useApi<any[]>(endpoint)
}

export function useCreateAppointment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAppointment = async (appointmentData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create appointment')
      }
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { createAppointment, loading, error }
}

export function useUpdateAppointment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateAppointment = async (appointmentData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update appointment')
      }
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { updateAppointment, loading, error }
}

// Messages API hooks
export function useMessages(userId?: string) {
  const endpoint = userId ? `/api/messages?userId=${userId}` : '/api/messages'
  return useApi<any[]>(endpoint)
}

export function useConversations(userId?: string) {
  const endpoint = userId ? `/api/messages?userId=${userId}` : '/api/messages'
  return useApi<any[]>(endpoint)
}

export function useConversation(conversationId: string) {
  const endpoint = `/api/messages?conversationId=${conversationId}`
  return useApi<any>(endpoint)
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (messageData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading, error }
}

// Progress API hooks
export function useProgress(patientId: string, metric?: string) {
  const endpoint = metric 
    ? `/api/progress?patientId=${patientId}&metric=${metric}`
    : `/api/progress?patientId=${patientId}`
  return useApi<any>(endpoint)
}

export function useUpdateProgress() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProgress = async (progressData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update progress')
      }
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { updateProgress, loading, error }
}

// Videos API hooks
export function useVideos(filters?: {
  category?: string
  difficulty?: string
  search?: string
  instructor?: string
}) {
  const params = new URLSearchParams()
  if (filters?.category) params.append('category', filters.category)
  if (filters?.difficulty) params.append('difficulty', filters.difficulty)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.instructor) params.append('instructor', filters.instructor)
  
  const endpoint = `/api/videos${params.toString() ? `?${params.toString()}` : ''}`
  return useApi<{videos: any[], categories: string[], difficulties: string[], total: number}>(endpoint)
}

export function useVideo(videoId: string) {
  const endpoint = `/api/videos?id=${videoId}`
  return useApi<any>(endpoint)
}

export function useUploadVideo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadVideo = async (videoData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload video')
      }
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { uploadVideo, loading, error }
}

export function useUpdateVideo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateVideo = async (videoData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update video')
      }
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { updateVideo, loading, error }
}