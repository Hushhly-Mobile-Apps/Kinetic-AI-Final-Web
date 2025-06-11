"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoLoadingProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export function LogoLoading({ size = "medium", className }: LogoLoadingProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Map size to pixel values for the logo
  const dimensions = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 160, height: 160 },
  }[size]

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-[#001a41]", className)}>
      <div className="relative flex flex-col items-center">
        {/* Logo with fixed dimensions to prevent distortion */}
        <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
          <Image
            src="/kinetic-logo.png"
            alt="Kinetic Logo"
            width={dimensions.width}
            height={dimensions.height}
            className={cn("transition-opacity duration-500", loading ? "opacity-100" : "opacity-0")}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Loading spinner positioned below the logo */}
        <div className="mt-8">
          <div className="h-1 w-24 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-[#53d08a] w-1/2 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
