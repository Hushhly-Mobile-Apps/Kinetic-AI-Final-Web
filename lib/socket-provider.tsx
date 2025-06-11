"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import supabase from "@/lib/supabase-client"
import { toast } from "sonner"

type SupabaseChannel = ReturnType<typeof supabase.channel>

type SocketContextType = {
  socket: WebSocket | null
  supabaseChannel: SupabaseChannel | null
  isConnected: boolean
  lastMessage: any
  sendMessage: (message: any) => void
  notifications: any[]
  addNotification: (notification: any) => void
  // Supabase Realtime methods
  subscribe: (channel: string, event: string, callback: (payload: any) => void) => () => void
  publish: (channel: string, event: string, payload: any) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  supabaseChannel: null,
  isConnected: false,
  lastMessage: null,
  sendMessage: () => {},
  notifications: [],
  addNotification: () => {},
  subscribe: () => () => {},
  publish: () => {},
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [supabaseChannel, setSupabaseChannel] = useState<SupabaseChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize Supabase Realtime connection
  useEffect(() => {
    if (!user) return

    // Create a Supabase Realtime channel for real-time communication
    const channel = supabase.channel(`user:${user.id}`, {
      config: {
        broadcast: { self: true }
      }
    })

    // Listen for notifications
    channel
      .on('broadcast', { event: 'notification' }, (payload) => {
        console.log('Notification received:', payload)
        setLastMessage(payload)
        
        if (payload.type === 'notification') {
          addNotification(payload)
          
          // Show toast notification
          if (payload.title) {
            toast(payload.title, {
              description: payload.message,
              action: payload.action ? {
                label: payload.action.label,
                onClick: () => window.location.href = payload.action.url
              } : undefined
            })
          }
        }
      })
      // Subscribe to presence updates (online/offline status)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        console.log('Presence state synced:', state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Supabase Realtime connected')
          setIsConnected(true)
          
          // Set user as online
          const userStatus = {
            user_id: user.id,
            online_at: new Date().toISOString(),
            status: 'online'
          }
          
          // Track presence
          await channel.track(userStatus)
          
          // Update database with status
          await supabase
            .from('user_status')
            .upsert(userStatus, { onConflict: 'user_id' })
            
          // Load initial notifications
          loadInitialNotifications()
        }
      })

    setSupabaseChannel(channel)

    // Cleanup on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [user])

  // Also maintain legacy WebSocket connection for backward compatibility
  useEffect(() => {
    if (!user) return
    
    const connectWebSocket = () => {
      // Connect to the WebSocket server
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://${window.location.host}/api/ws`
        : 'ws://localhost:8000/notifications'
      
      try {
        const socketInstance = new WebSocket(wsUrl)

        socketInstance.onopen = () => {
          console.log("WebSocket connected")
          
          // Send authentication
          socketInstance.send(JSON.stringify({
            type: 'auth',
            userId: user.id
          }))
        }

        socketInstance.onclose = () => {
          console.log("WebSocket disconnected")
          setIsConnected(prev => prev && !!supabaseChannel) // Only set to false if Supabase isn't connected
          
          // Attempt to reconnect after 3 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect WebSocket...")
            connectWebSocket()
          }, 3000)
        }

        socketInstance.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log("WebSocket message received", message)
            setLastMessage(message)
            
            // Handle different message types
            if (message.type === 'notification') {
              addNotification(message)
              
              // Show toast notification
              if (message.title) {
                toast(message.title, {
                  description: message.message
                })
              }
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error)
          }
        }

        socketInstance.onerror = (error) => {
          console.error("WebSocket error:", error)
        }

        setSocket(socketInstance)
      } catch (error) {
        console.error("Error connecting to WebSocket:", error)
      }
    }
    
    connectWebSocket()

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [user])

  // Set user as offline when the page is closed
  useEffect(() => {
    if (!user) return

    const handleBeforeUnload = async () => {
      // Update user status to offline
      await supabase
        .from('user_status')
        .update({
          status: 'offline',
          offline_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [user])

  // Load initial notifications
  const loadInitialNotifications = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        
      if (error) {
        console.error('Error loading notifications:', error)
        return
      }
      
      if (data) {
        setNotifications(data)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  // Send message through WebSocket
  const sendMessage = (message: any) => {
    // Try to send through Supabase first
    if (supabaseChannel) {
      supabaseChannel.send({
        type: 'broadcast',
        event: 'notification',
        payload: message
      })
    }
    
    // Also send through WebSocket for backward compatibility
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }

  // Add notification to state and store in database
  const addNotification = async (notification: any) => {
    setNotifications(prev => [notification, ...prev])
    
    // Store notification in database if it has an ID
    if (user && notification.id) {
      try {
        await supabase.from('notifications').upsert({
          id: notification.id,
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: false,
          created_at: notification.created_at || new Date().toISOString(),
          metadata: notification.metadata || {}
        })
      } catch (error) {
        console.error('Error storing notification:', error)
      }
    }
  }

  // Subscribe to a specific channel and event using Supabase Realtime
  const subscribe = (channel: string, event: string, callback: (payload: any) => void) => {
    if (!supabaseChannel) {
      console.error('Supabase channel not initialized')
      return () => {}
    }

    const subscription = supabaseChannel.on(
      'broadcast',
      { event: `${channel}:${event}` },
      ({ payload }) => {
        callback(payload)
      }
    )

    // Return unsubscribe function
    return () => {
      supabaseChannel.off('broadcast', { event: `${channel}:${event}` })
    }
  }

  // Publish an event to a channel using Supabase Realtime
  const publish = (channel: string, event: string, payload: any) => {
    if (!supabaseChannel) {
      console.error('Supabase channel not initialized')
      return
    }

    supabaseChannel.send({
      type: 'broadcast',
      event: `${channel}:${event}`,
      payload
    })

    // Store messages in database if it's a chat message
    if (channel === 'message' && user) {
      try {
        supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: payload.receiverId,
            content: payload.content,
            created_at: new Date().toISOString()
          })
      } catch (error) {
        console.error('Error storing message:', error)
      }
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        supabaseChannel,
        isConnected,
        lastMessage,
        sendMessage,
        notifications,
        addNotification,
        subscribe,
        publish
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
