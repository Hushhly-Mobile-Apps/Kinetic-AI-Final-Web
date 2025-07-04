"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
  lastMessage: any
  sendMessage: (roomId: string, message: any) => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  typingStatus: Record<string, { userId: string; username: string }>
  setTyping: (roomId: string, isTyping: boolean) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  lastMessage: null,
  sendMessage: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  typingStatus: {},
  setTyping: () => {},
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [typingStatus, setTypingStatus] = useState<Record<string, { userId: string; username: string }>>({})

  useEffect(() => {
    // In a real app, this would connect to your actual WebSocket server
    const socketInstance = io("https://api.kinetic-rehab.com", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    socketInstance.on("message", (message) => {
      console.log("New message received", message)
      setLastMessage(message)
    })

    socketInstance.on("typing", ({ roomId, user }) => {
      setTypingStatus((prev) => ({
        ...prev,
        [roomId]: user,
      }))

      // Clear typing indicator after 3 seconds of inactivity
      setTimeout(() => {
        setTypingStatus((prev) => {
          const newStatus = { ...prev }
          if (newStatus[roomId]?.userId === user.userId) {
            delete newStatus[roomId]
          }
          return newStatus
        })
      }, 3000)
    })

    socketInstance.on("appointment_update", (data) => {
      console.log("Appointment update received", data)
      // In a real app, you would update your appointment state here
      // For example, dispatch an action to update the Redux store
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const sendMessage = (roomId: string, message: any) => {
    if (socket && isConnected) {
      socket.emit("message", { roomId, message })
    }
  }

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit("join_room", roomId)
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit("leave_room", roomId)
    }
  }

  const setTyping = (roomId: string, isTyping: boolean) => {
    if (socket && isConnected && isTyping) {
      // In a real app, you would get the user info from your auth context
      const user = {
        userId: "current-user-id",
        username: "Current User",
      }
      socket.emit("typing", { roomId, user })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        lastMessage,
        sendMessage,
        joinRoom,
        leaveRoom,
        typingStatus,
        setTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
