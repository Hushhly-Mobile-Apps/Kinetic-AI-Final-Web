"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Send, Paperclip, ArrowLeft, Phone, Video, MoreVertical, Clock } from "lucide-react"
import { useSocket } from "@/lib/socket-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for conversation
const mockConversation = {
  id: "1",
  recipient: {
    id: "therapist-1",
    name: "Dr. Sarah Johnson",
    avatar: "/caring-doctor.png",
    status: "online",
    lastSeen: new Date(),
  },
  messages: [
    {
      id: "m1",
      senderId: "therapist-1",
      text: "Good morning! How are you feeling today?",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: "m2",
      senderId: "current-user",
      text: "Morning Dr. Johnson! My knee is feeling a bit better today. I did the exercises you recommended.",
      timestamp: new Date(Date.now() - 3500000),
      read: true,
    },
    {
      id: "m3",
      senderId: "therapist-1",
      text: "That's great to hear! Did you experience any pain during the exercises?",
      timestamp: new Date(Date.now() - 3400000),
      read: true,
    },
    {
      id: "m4",
      senderId: "current-user",
      text: "A little discomfort during the leg raises, but not as bad as before.",
      timestamp: new Date(Date.now() - 3300000),
      read: true,
    },
    {
      id: "m5",
      senderId: "therapist-1",
      text: "That's progress! Let's adjust your routine slightly. I'll send you updated instructions.",
      timestamp: new Date(Date.now() - 3200000),
      read: true,
    },
    {
      id: "m6",
      senderId: "therapist-1",
      text: "Here's your updated exercise plan. Try these modifications for the leg raises.",
      timestamp: new Date(Date.now() - 3100000),
      read: true,
      attachment: {
        type: "pdf",
        name: "Updated_Exercise_Plan.pdf",
        url: "#",
      },
    },
  ],
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const { socket, isConnected, sendMessage, joinRoom, leaveRoom, typingStatus, setTyping } = useSocket()
  const [conversation, setConversation] = useState(mockConversation)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date for message groups
  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: typeof conversation.messages }[] = []
    let currentDate = ""
    let currentGroup: typeof conversation.messages = []

    conversation.messages.forEach((message) => {
      const messageDate = formatDate(message.timestamp)

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup })
    }

    return groups
  }

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message = {
      id: `m${conversation.messages.length + 1}`,
      senderId: "current-user",
      text: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))

    // Send message via socket
    sendMessage(params.id as string, message)

    setNewMessage("")
  }

  // Handle input change and typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    setTyping(params.id as string, e.target.value.length > 0)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  // Join room on component mount
  useEffect(() => {
    if (isConnected) {
      joinRoom(params.id as string)
      setIsLoading(false)
    }

    return () => {
      if (isConnected) {
        leaveRoom(params.id as string)
      }
    }
  }, [isConnected, joinRoom, leaveRoom, params.id])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading conversation...</div>
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/messages")}>
            <ArrowLeft size={20} />
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={conversation.recipient.avatar || "/placeholder.svg"} alt={conversation.recipient.name} />
            <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{conversation.recipient.name}</h2>
            <p className="text-xs text-gray-500 flex items-center">
              {conversation.recipient.status === "online" ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  Online
                </>
              ) : (
                <>
                  <Clock size={12} className="mr-1" />
                  Last seen{" "}
                  {conversation.recipient.lastSeen.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-blue-600">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-600">
            <Video size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View contact</DropdownMenuItem>
              <DropdownMenuItem>Search</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Clear chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {groupMessagesByDate().map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="flex justify-center">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{group.date}</span>
            </div>

            {group.messages.map((message, messageIndex) => {
              const isCurrentUser = message.senderId === "current-user"
              const showAvatar = messageIndex === 0 || group.messages[messageIndex - 1].senderId !== message.senderId

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  {!isCurrentUser && showAvatar && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage
                        src={conversation.recipient.avatar || "/placeholder.svg"}
                        alt={conversation.recipient.name}
                      />
                      <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}

                  {!isCurrentUser && !showAvatar && <div className="w-8 mr-2"></div>}

                  <div className={`max-w-[70%] ${!isCurrentUser && !showAvatar ? "ml-10" : ""}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        isCurrentUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.text}
                      {message.attachment && (
                        <div
                          className={`mt-2 p-2 rounded flex items-center ${
                            isCurrentUser ? "bg-blue-700" : "bg-gray-200"
                          }`}
                        >
                          <div className={`p-2 rounded ${isCurrentUser ? "bg-blue-800" : "bg-gray-300"}`}>
                            <Paperclip size={16} />
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium">{message.attachment.name}</p>
                            <p className="text-xs">PDF Document</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-1 flex items-center ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      {formatTime(message.timestamp)}
                      {isCurrentUser && message.read && <span className="ml-1 text-blue-600">✓✓</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {typingStatus[params.id as string] && (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={conversation.recipient.avatar || "/placeholder.svg"}
                alt={conversation.recipient.name}
              />
              <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip size={20} />
          </Button>
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 mx-2"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
