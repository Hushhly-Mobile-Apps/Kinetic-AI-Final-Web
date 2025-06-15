"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, CreditCard, Lock } from "lucide-react"
import Link from "next/link"

export default function AddPaymentPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/billing">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Add Payment Method</h1>
      </div>
      <p className="text-muted-foreground">Add a new credit card or debit card to your account</p>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Card Information
          </CardTitle>
          <CardDescription>Enter your card details below. Your information is secure and encrypted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiration Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name on Card</Label>
            <Input id="name" placeholder="John Doe" />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Your payment information is securely encrypted
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="default" className="h-4 w-4 rounded border-gray-300" />
            <Label htmlFor="default" className="text-sm font-normal">
              Set as default payment method
            </Label>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Add Payment Method</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
