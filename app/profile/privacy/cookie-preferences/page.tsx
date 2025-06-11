import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiePreferencesPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/privacy">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Cookie Preferences</h1>
      </div>

      <p className="text-muted-foreground">
        Manage how cookies are used on our website and application. Some cookies are necessary for the platform to
        function properly, while others help us improve your experience.
      </p>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <h3 className="font-medium">Essential Cookies</h3>
              <p className="text-sm text-muted-foreground">
                These cookies are necessary for the website to function and cannot be switched off in our systems.
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>

          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <h3 className="font-medium">Performance Cookies</h3>
              <p className="text-sm text-muted-foreground">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance
                of our site.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <h3 className="font-medium">Functional Cookies</h3>
              <p className="text-sm text-muted-foreground">
                These cookies enable the website to provide enhanced functionality and personalization.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <h3 className="font-medium">Targeting Cookies</h3>
              <p className="text-sm text-muted-foreground">
                These cookies may be set through our site by our advertising partners to build a profile of your
                interests.
              </p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Third-Party Cookies</h2>

          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <h3 className="font-medium">Google Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Used to track website usage and user behavior to improve our services.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <h3 className="font-medium">Hotjar</h3>
              <p className="text-sm text-muted-foreground">
                Used to analyze how users interact with our platform to improve user experience.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <h3 className="font-medium">Social Media Cookies</h3>
              <p className="text-sm text-muted-foreground">Enable sharing functionality with social media platforms.</p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
          <Button variant="outline">Accept All</Button>
          <Button variant="outline">Reject Non-Essential</Button>
        </div>
      </div>
    </div>
  )
}
