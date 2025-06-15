"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CreditCard, Edit, Home, Mail, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function BillingPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Management</h1>
          <p className="text-muted-foreground">Manage your personal information and account settings</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b pb-4">
        <Link href="/profile" className="text-sm font-medium">
          Personal Info
        </Link>
        <Link href="/profile/account-settings" className="text-sm font-medium">
          Account Settings
        </Link>
        <Link href="/profile/notifications" className="text-sm font-medium">
          Notifications
        </Link>
        <Link href="/profile/privacy" className="text-sm font-medium">
          Privacy
        </Link>
        <Link href="/profile/billing" className="text-sm font-medium border-b-2 border-primary pb-4 -mb-4">
          Billing
        </Link>
      </div>

      <div className="space-y-8">
        {/* Current Subscription */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current Subscription</h2>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-orange-500"></div>
                  </div>
                </div>
                <div className="space-y-1 flex-grow">
                  <div className="text-sm font-medium text-muted-foreground">ACTIVE</div>
                  <h3 className="text-xl font-semibold">Recovery Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    $29.99/month - Unlimited exercises, video feedback, and priority support
                  </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    Change Plan
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Methods</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Visa ending in 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 05/25 - Default</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Mastercard ending in 6888</div>
                  <div className="text-sm text-muted-foreground">Expires 12/24</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </div>

        {/* Billing Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Billing Information</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Billing Address</div>
                  <div className="text-sm text-muted-foreground">123 Recovery St, Therapy City, TC 12345</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-md">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Billing Email</div>
                  <div className="text-sm text-muted-foreground">patient@example.com</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Transaction History</h2>

          <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y">
                  <tr className="bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>May 15, 2023</span>
                      </div>
                    </td>
                    <td className="p-4">Recovery Pro Plan</td>
                    <td className="p-4">$29.99</td>
                    <td className="p-4 text-green-600">Paid</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Apr 15, 2023</span>
                      </div>
                    </td>
                    <td className="p-4">Recovery Pro Plan</td>
                    <td className="p-4">$29.99</td>
                    <td className="p-4 text-green-600">Paid</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Mar 15, 2023</span>
                      </div>
                    </td>
                    <td className="p-4">Recovery Pro Plan</td>
                    <td className="p-4">$29.99</td>
                    <td className="p-4 text-green-600">Paid</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Feb 15, 2023</span>
                      </div>
                    </td>
                    <td className="p-4">Recovery Basic Plan</td>
                    <td className="p-4">$19.99</td>
                    <td className="p-4 text-green-600">Paid</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Button variant="outline" className="w-full sm:w-auto">
            View All Transactions
          </Button>
        </div>
      </div>
    </div>
  )
}
