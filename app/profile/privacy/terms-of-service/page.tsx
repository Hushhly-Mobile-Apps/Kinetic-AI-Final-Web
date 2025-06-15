import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/privacy">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
      </div>

      <div className="prose max-w-none">
        <p className="text-muted-foreground">Last updated: May 15, 2024</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Kinetic Rehabilitation Platform. These Terms of Service govern your use of our website, mobile
          application, and services offered by Kinetic.
        </p>

        <h2>2. Acceptance of Terms</h2>
        <p>
          By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the
          terms, you may not access the service.
        </p>

        <h2>3. Description of Service</h2>
        <p>
          Kinetic provides a digital rehabilitation platform that connects patients with healthcare providers, offers
          exercise tracking, progress monitoring, and telehealth services. Our platform is designed to supplement, not
          replace, professional medical care.
        </p>

        <h2>4. User Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and complete information. You are responsible
          for safeguarding the password and for all activities that occur under your account.
        </p>

        <h2>5. Privacy Policy</h2>
        <p>
          Your use of Kinetic is also governed by our Privacy Policy, which is incorporated by reference into these
          Terms of Service.
        </p>

        <h2>6. User Content</h2>
        <p>
          Our service allows you to post, link, store, share and otherwise make available certain information, text,
          graphics, videos, or other material. You retain any rights that you may have in your user content.
        </p>

        <h2>7. Medical Disclaimer</h2>
        <p>
          The content provided through Kinetic is for informational purposes only and is not intended to be a substitute
          for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
          qualified health provider with any questions you may have regarding a medical condition.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          In no event shall Kinetic, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
          for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss
          of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or
          inability to access or use the service.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
          material we will try to provide at least 30 days' notice prior to any new terms taking effect.
        </p>

        <h2>10. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at support@kineticrehab.com.</p>
      </div>

      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">Accept Terms</Button>
        <Button variant="outline">Download PDF</Button>
      </div>
    </div>
  )
}
