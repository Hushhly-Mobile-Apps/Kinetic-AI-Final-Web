import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000a2c] to-[#00487c] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="flex justify-center mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>

        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-full mx-auto mb-2" />
        <Skeleton className="h-4 w-3/4 mx-auto mb-6" />

        <Skeleton className="h-12 w-full" />

        <div className="mt-6">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  )
}
