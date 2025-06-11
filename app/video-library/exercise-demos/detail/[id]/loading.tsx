import { Skeleton } from "@/components/ui/skeleton"

export default function ExerciseDetailLoading() {
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
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-4 w-20" />
                {i < 3 && <span className="mx-2">›</span>}
              </div>
            ))}
        </div>

        {/* Title Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Video Player Skeleton */}
        <Skeleton className="w-full aspect-video rounded-lg mb-8" />

        {/* Exercise Details Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />

            <Skeleton className="h-6 w-32 mb-4" />
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-4 w-full mb-2" />
              ))}

            <Skeleton className="h-6 w-48 mb-4 mt-6" />
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-4 w-full mb-2" />
              ))}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center p-2">
                      <Skeleton className="w-10 h-10 rounded-md mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="flex justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  )
}
