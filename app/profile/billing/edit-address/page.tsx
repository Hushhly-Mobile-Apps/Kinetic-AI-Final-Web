"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Home } from "lucide-react"
import Link from "next/link"

export default function EditAddressPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/billing">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Billing Address</h1>
      </div>
      <p className="text-muted-foreground">Update your billing address information</p>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Billing Address
          </CardTitle>
          <CardDescription>This address will be used for all billing-related correspondence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Alex Johnson" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address1">Address Line 1</Label>
            <Input id="address1" defaultValue="123 Recovery St" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">Address Line 2 (Optional)</Label>
            <Input id="address2" placeholder="Apartment, suite, unit, etc." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue="Therapy City" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" defaultValue="TC" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP/Postal Code</Label>
              <Input id="zip" defaultValue="12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                defaultValue="US"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" defaultValue="(555) 123-4567" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Save Address</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
