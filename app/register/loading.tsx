import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000a2c] to-[#00487c] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>

        <Skeleton className="h-8 w-64 mx-auto mb-8" />

        <Skeleton className="h-10 w-full mb-8" />

        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-64" />
          </div>

          <Skeleton className="h-12 w-full" />
        </div>

        <div className="mt-8 text-center">
          <Skeleton className="h-5 w-32 mx-auto mb-4" />
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>
      </div>
    </div>
  )
}
