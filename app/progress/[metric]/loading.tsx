import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-8">
      {/* Back button and title */}
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-10 mr-2" />
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Current Value Card */}
      <Skeleton className="h-32 w-full mb-6" />

      {/* Chart */}
      <Skeleton className="h-80 w-full mb-6" />

      {/* Detailed Metrics */}
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Therapist Notes */}
      <Skeleton className="h-6 w-40 mb-4" />
      <Skeleton className="h-32 w-full mb-6" />

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  )
}
