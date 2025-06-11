import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryExercisesLoading() {
  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar Skeleton */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <Skeleton className="h-10 w-10 rounded-full mb-8" />
        <div className="flex-1 flex flex-col items-center space-y-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-xl" />
            ))}
        </div>
        <div className="mt-auto flex flex-col items-center space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-xl" />
            ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-auto p-8">
        {/* Title Skeleton */}
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-8 mr-4" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Search and Filter Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Exercise List Skeleton */}
        <div className="space-y-4 mb-8">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-9 w-28 mr-2" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-3/4 mt-2 ml-14" />
              </div>
            ))}
        </div>

        {/* Recommended Combinations Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton className="h-6 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-md p-4">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
