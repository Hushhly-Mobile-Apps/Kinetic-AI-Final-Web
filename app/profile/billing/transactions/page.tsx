"use client"

import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, Download, Filter } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/billing">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
      </div>
      <p className="text-muted-foreground">View and download your complete billing history</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option>All Time</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <Button variant="outline" className="gap-1 w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Export Transactions
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Receipt</th>
              </tr>
            </thead>
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
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </td>
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
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </td>
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
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </td>
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
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Jan 15, 2023</span>
                  </div>
                </td>
                <td className="p-4">Recovery Basic Plan</td>
                <td className="p-4">$19.99</td>
                <td className="p-4 text-green-600">Paid</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Dec 15, 2022</span>
                  </div>
                </td>
                <td className="p-4">Recovery Basic Plan</td>
                <td className="p-4">$19.99</td>
                <td className="p-4 text-green-600">Paid</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-8 w-8" disabled>
            1
          </Button>
          <Button variant="outline" className="h-8 w-8">
            2
          </Button>
          <Button variant="outline" className="h-8 w-8">
            3
          </Button>
          <span>...</span>
          <Button variant="outline" className="h-8 w-8">
            8
          </Button>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
