'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { Play, X } from "lucide-react"

export default function DemoPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafb] p-4">
      <header className="w-full bg-[#111827] text-white py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={40} height={40} />
            <span className="font-bold text-xl">KINETIC</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-[#111827] mb-6">Watch Our Demo</h1>
        
        {/* Demo Video Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-[#111827] to-[#374151] rounded-lg mb-8 flex items-center justify-center cursor-pointer group overflow-hidden"
             onClick={() => setIsVideoOpen(true)}>
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-opacity-30 transition-all duration-300">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <p className="text-white text-lg font-medium">Click to Watch Demo</p>
            <p className="text-white text-sm opacity-80">See Kinetic AI in Action</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        <p className="text-[#4b5563] mb-8">
          See how our AI-powered rehabilitation platform can transform your recovery journey with personalized
          exercises, real-time pose detection, and progress tracking.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="border-[#111827] text-[#111827]">
              Back to Home
            </Button>
          </Link>
          <Link href="/free-trial">
            <Button className="bg-[#111827] hover:bg-[#1f2937]">Start Free Trial</Button>
          </Link>
        </div>
      </div>

      {/* Demo Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="absolute top-4 right-4 z-50">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {/* Simulated Video Player */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Play className="w-12 h-12 text-white ml-1" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Kinetic AI Demo Video</h3>
                <p className="text-lg opacity-90 mb-6">Real-time Pose Detection & Exercise Analysis</p>
                <div className="space-y-2 text-sm opacity-75">
                  <p>• AI-powered movement tracking</p>
                  <p>• Instant form correction</p>
                  <p>• Personalized rehabilitation plans</p>
                  <p>• Progress monitoring & analytics</p>
                </div>
              </div>
              
              {/* Simulated video controls */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-white text-sm">
                  <span>0:00</span>
                  <div className="flex-1 mx-4 h-1 bg-white bg-opacity-30 rounded-full">
                    <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
                  </div>
                  <span>3:45</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
