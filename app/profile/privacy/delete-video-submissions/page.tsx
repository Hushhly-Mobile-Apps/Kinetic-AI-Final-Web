import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, AlertTriangle, Video } from "lucide-react"
import Link from "next/link"

export default function DeleteVideoSubmissionsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/privacy">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Delete Video Submissions</h1>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Warning: This action cannot be undone. Deleting your video submissions will permanently remove all uploaded
          exercise videos from our servers.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Video Submissions</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-md">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Shoulder Rotation Exercise</h3>
                  <p className="text-sm text-muted-foreground">Uploaded on May 10, 2024</p>
                </div>
              </div>
              <Checkbox id="video-1" />
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-md">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Arm Flexion Exercise</h3>
                  <p className="text-sm text-muted-foreground">Uploaded on May 8, 2024</p>
                </div>
              </div>
              <Checkbox id="video-2" />
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-md">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Resistance Band Training</h3>
                  <p className="text-sm text-muted-foreground">Uploaded on May 5, 2024</p>
                </div>
              </div>
              <Checkbox id="video-3" />
            </div>

            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-md">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Stretching Routine</h3>
                  <p className="text-sm text-muted-foreground">Uploaded on May 1, 2024</p>
                </div>
              </div>
              <Checkbox id="video-4" />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="select-all" />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All Videos
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Confirmation</h2>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="confirm-delete" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="confirm-delete"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand this action cannot be undone
                </label>
                <p className="text-sm text-muted-foreground">Once deleted, we cannot recover these videos</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="confirm-provider" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="confirm-provider"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand my healthcare provider will be notified
                </label>
                <p className="text-sm text-muted-foreground">
                  Your therapist will be informed that you've deleted your video submissions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="destructive">Delete Selected Videos</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  )
}
