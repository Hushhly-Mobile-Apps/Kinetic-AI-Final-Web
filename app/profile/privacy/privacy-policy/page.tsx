import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/profile/privacy">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
      </div>

      <div className="prose max-w-none">
        <p className="text-muted-foreground">Last updated: May 15, 2024</p>

        <h2>1. Introduction</h2>
        <p>
          At Kinetic, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our rehabilitation platform.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect several types of information from and about users of our platform, including:</p>
        <ul>
          <li>Personal information such as name, email address, phone number, and date of birth</li>
          <li>Medical information including conditions, allergies, and medications</li>
          <li>Exercise and rehabilitation progress data</li>
          <li>Video submissions of exercise performance</li>
          <li>Communication data between you and your healthcare providers</li>
          <li>Usage data about how you interact with our platform</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Connect you with healthcare providers</li>
          <li>Track and analyze your rehabilitation progress</li>
          <li>Communicate with you about appointments, exercises, and updates</li>
          <li>Conduct research and analysis to improve healthcare outcomes (with anonymized data)</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Your healthcare providers to facilitate your treatment</li>
          <li>Research partners (anonymized data only, if you consent)</li>
          <li>Insurance providers (with your explicit consent)</li>
          <li>Service providers who perform services on our behalf</li>
          <li>Legal authorities when required by law</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information. However,
          no method of transmission over the Internet or electronic storage is 100% secure.
        </p>

        <h2>6. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access your personal information</li>
          <li>The right to correct inaccurate information</li>
          <li>The right to delete your information</li>
          <li>The right to restrict or object to processing</li>
          <li>The right to data portability</li>
        </ul>

        <h2>7. Children's Privacy</h2>
        <p>
          Our services are not intended for children under 13 years of age. We do not knowingly collect personal
          information from children under 13.
        </p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@kineticrehab.com.</p>
      </div>

      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">I Understand</Button>
        <Button variant="outline">Download PDF</Button>
      </div>
    </div>
  )
}
