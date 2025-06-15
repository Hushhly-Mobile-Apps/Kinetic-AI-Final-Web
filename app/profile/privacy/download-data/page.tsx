import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Download, FileText } from "lucide-react"
import Link from "next/link"

export default function DownloadDataPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/privacy">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Download My Data</h1>
      </div>

      <p className="text-muted-foreground">
        You can download a copy of your personal data in a machine-readable format. Select the data you want to include
        in your export.
      </p>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Data to Export</h2>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="profile" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="profile"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Profile Information
                </label>
                <p className="text-sm text-muted-foreground">
                  Your personal details, contact information, and medical information
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="exercises" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="exercises"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Exercise History
                </label>
                <p className="text-sm text-muted-foreground">
                  Your exercise assignments, completion records, and progress data
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="messages" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="messages"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Messages
                </label>
                <p className="text-sm text-muted-foreground">Your communication history with healthcare providers</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="appointments" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="appointments"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Appointments
                </label>
                <p className="text-sm text-muted-foreground">
                  Your appointment history and upcoming scheduled sessions
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="videos" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="videos"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Video Submissions
                </label>
                <p className="text-sm text-muted-foreground">
                  Videos you've uploaded for exercise form review (large file size)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="assessments" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="assessments"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Assessments & Evaluations
                </label>
                <p className="text-sm text-muted-foreground">Your assessment results and provider evaluations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Export Format</h2>

          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-auto py-3 px-4">
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">JSON</div>
                <div className="text-xs text-muted-foreground">Machine-readable</div>
              </div>
            </Button>

            <Button variant="outline" className="flex items-center gap-2 h-auto py-3 px-4 border-blue-600 bg-blue-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h2" />
                <path d="M8 17h2" />
                <path d="M14 13h2" />
                <path d="M14 17h2" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-blue-600">CSV</div>
                <div className="text-xs text-blue-600">Spreadsheet-compatible</div>
              </div>
            </Button>

            <Button variant="outline" className="flex items-center gap-2 h-auto py-3 px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 13h6" />
                <path d="M9 17h6" />
                <path d="M9 9h1" />
              </svg>
              <div className="text-left">
                <div className="font-medium">PDF</div>
                <div className="text-xs text-muted-foreground">Human-readable</div>
              </div>
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            Your data export will be prepared and sent to your email address. This process may take up to 24 hours
            depending on the amount of data selected.
          </p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Download className="h-4 w-4" />
          Request Data Export
        </Button>
      </div>
    </div>
  )
}
