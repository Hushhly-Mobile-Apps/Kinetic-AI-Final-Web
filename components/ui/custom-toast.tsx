"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomToastProps {
  message: string
  type: "success" | "error" | "loading" | "info"
  onClose: () => void
  duration?: number
}

export function CustomToast({ message, type, onClose, duration = 5000 }: CustomToastProps) {
  React.useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [onClose, duration, type])

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "loading":
        return "⏳"
      case "info":
        return "ℹ️"
      default:
        return "ℹ️"
    }
  }

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "loading":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "info":
        return "bg-gray-50 border-gray-200 text-gray-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-sm",
      getStyles()
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getIcon()}</span>
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "loading" | "info") => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function CustomToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    message: string
    type: "success" | "error" | "loading" | "info"
  }>>([])

  const showToast = React.useCallback((message: string, type: "success" | "error" | "loading" | "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <CustomToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useCustomToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useCustomToast must be used within a CustomToastProvider")
  }
  return context
} 