"use client"

import { PoseEstimation } from '@/components/pose-estimation'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function PoseEstimationPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Pose Estimation</h1>
          <p className="text-gray-600 mt-2">
            Advanced pose detection and analysis for physiotherapy sessions
          </p>
        </div>
        
        <PoseEstimation />
      </div>
    </DashboardLayout>
  )
}