"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, MessageSquare, Calendar, Activity, CheckCircle } from "lucide-react"
import { useSocket } from "@/lib/socket-provider"

export type Notification = {
  id: string
  title: string
  message: string
  type: "message" | "appointment" | "exercise" | "progress"
  read: boolean
  timestamp: Date
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [newNotification, setNewNotification] = useState<Notification | null>(null)
  const { socket, isConnected } = useSocket()

  // Generate random notifications
  const generateRandomNotification = (): Notification => {
    const types: Notification["type"][] = ["message", "appointment", "exercise", "progress"];
    const type = types[Math.floor(Math.random() * types.length)];

    const titles = {
      message: ["New Message", "Message Received", "Therapist Message"],
      appointment: ["Appointment Reminder", "Appointment Update", "Schedule Change"],
      exercise: ["Exercise Completed", "New Exercise Added", "Exercise Reminder"],
      progress: ["Progress Update", "Recovery Milestone", "Goal Achieved"]
    };

    const messages = {
      message: [
        "Dr. Sarah Johnson sent you a message",
        "Dr. Michael Chen has a question about your progress",
        "New message from your physical therapist",
        "Reception sent you information about your next visit"
      ],
      appointment: [
        "You have an appointment tomorrow at 2:30 PM",
        "Your appointment on Friday has been confirmed",
        "Reminder: Video consultation in 2 hours",
        "Your therapist suggested a follow-up appointment"
      ],
      exercise: [
        "Great job! You've completed today's exercises",
        "New exercise routine has been added to your program",
        "Don't forget to complete your evening exercises",
        "Your exercise performance has improved by 15%"
      ],
      progress: [
        "Your therapist has updated your recovery progress",
        "Congratulations! You've reached a recovery milestone",
        "Your range of motion has improved significantly",
        "Weekly progress report is now available"
      ]
    };

    const title = titles[type][Math.floor(Math.random() * titles[type].length)];
    const message = messages[type][Math.floor(Math.random() * messages[type].length)];

    // Generate a random timestamp within the last 24 hours
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      title,
      message,
      type,
      read: Math.random() > 0.7, // 30% chance of being unread
      timestamp
    };
  };

  // Simulate receiving notifications
  useEffect(() => {
    if (isConnected) {
      // Generate 3-5 initial notifications
      const count = Math.floor(Math.random() * 3) + 3;
      const initialNotifications: Notification[] = [];

      for (let i = 0; i < count; i++) {
        initialNotifications.push(generateRandomNotification());
      }

      // Sort by timestamp (newest first)
      initialNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setNotifications(initialNotifications);

      // Simulate receiving new notifications periodically
      const interval = setInterval(() => {
        // 30% chance of receiving a new notification
        if (Math.random() < 0.3) {
          const newNotif = generateRandomNotification();
          newNotif.timestamp = new Date(); // Set to now
          newNotif.read = false; // Always unread

          setNotifications((prev) => [newNotif, ...prev]);
          setNewNotification(newNotif);

          // Auto-hide the notification after 5 seconds
          setTimeout(() => {
            setNewNotification(null);
          }, 5000);
        }
      }, 15000); // Check every 15 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected])

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "exercise":
        return <Activity className="h-5 w-5 text-green-500" />
      case "progress":
        return <CheckCircle className="h-5 w-5 text-orange-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
              style={{ transformOrigin: "top right" }}
            >
              <div className="p-3 bg-[#014585] text-white flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                <button className="text-sm text-blue-100 hover:text-white transition-colors" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
              <div className="p-2 bg-gray-50 text-center">
                <button className="text-sm text-[#014585] hover:underline">View all notifications</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification for New Notifications */}
      <AnimatePresence>
        {newNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-50 flex items-start max-w-md"
          >
            <div className="flex-shrink-0 mr-3 mt-1">{getNotificationIcon(newNotification.type)}</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{newNotification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{newNotification.message}</p>
            </div>
            <button className="ml-4 text-gray-400 hover:text-gray-600" onClick={() => setNewNotification(null)}>
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
