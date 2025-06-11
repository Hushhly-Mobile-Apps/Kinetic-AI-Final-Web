"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PlansPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/billing">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Choose a Plan</h1>
      </div>
      <p className="text-muted-foreground">Select the plan that best fits your rehabilitation needs</p>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Basic Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Plan</CardTitle>
            <CardDescription>For individuals just starting their recovery journey</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$19.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Access to basic exercise library</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Weekly progress tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Email support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Mobile app access</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Select Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="py-1 px-3 text-xs font-medium bg-blue-600 text-white rounded-full w-fit">CURRENT PLAN</div>
            <CardTitle className="mt-2">Recovery Pro Plan</CardTitle>
            <CardDescription>For dedicated recovery and rehabilitation</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$29.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited access to exercise library</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Detailed progress analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Video feedback from therapists</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Priority messaging support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Custom exercise routines</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Current Plan</Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Premium Plan</CardTitle>
            <CardDescription>For comprehensive rehabilitation support</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$49.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Everything in Pro Plan</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Weekly virtual sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>24/7 therapist support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Family member access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>AI-powered recovery insights</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Integration with health devices</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Upgrade Plan
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="rounded-lg border p-4 bg-muted/20">
        <h3 className="font-medium mb-2">Need a custom plan?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We offer specialized plans for clinics, hospitals, and rehabilitation centers. Contact our team to discuss
          your specific needs.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  )
}
