import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DeleteExerciseHistoryPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/privacy">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Delete Exercise History</h1>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Warning: This action cannot be undone. Deleting your exercise history will permanently remove all tracking
          data and may affect your rehabilitation progress monitoring.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Data to Delete</h2>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="completed-exercises" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="completed-exercises"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Completed Exercises
                </label>
                <p className="text-sm text-muted-foreground">
                  Records of exercises you've completed, including dates and times
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="progress-metrics" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="progress-metrics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Progress Metrics
                </label>
                <p className="text-sm text-muted-foreground">
                  Measurements of your performance and improvement over time
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="form-feedback" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="form-feedback"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Form Feedback
                </label>
                <p className="text-sm text-muted-foreground">
                  Comments and corrections provided by your therapist on your exercise form
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="all-exercise-data" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="all-exercise-data"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  All Exercise Data
                </label>
                <p className="text-sm text-muted-foreground">
                  Delete all exercise-related data, including assignments, completions, and progress
                </p>
              </div>
            </div>
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
                <p className="text-sm text-muted-foreground">Once deleted, we cannot recover this data</p>
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
                  Your therapist will be informed that you've deleted your exercise history
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="destructive">Delete Selected Data</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  )
}
