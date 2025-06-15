import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function EmailVerificationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000a2c] to-[#00487c] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="flex justify-center mb-6">
          <Mail className="h-16 w-16 text-[#3e82e7] p-3 bg-blue-100 rounded-full" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a verification code to your email address. Please enter the code below to verify your account.
        </p>

        <div className="flex justify-center gap-2 mb-6">
          <Input className="w-12 h-12 text-center text-xl font-bold" maxLength={1} />
          <Input className="w-12 h-12 text-center text-xl font-bold" maxLength={1} />
          <Input className="w-12 h-12 text-center text-xl font-bold" maxLength={1} />
          <Input className="w-12 h-12 text-center text-xl font-bold" maxLength={1} />
          <Input className="w-12 h-12 text-center text-xl font-bold" maxLength={1} />
          <Input className="w-12 h-12 text-center text-xl font-bold" maxLength={1} />
        </div>

        <Button className="w-full bg-[#53d08a] hover:bg-[#31bd7c] text-white font-medium mb-4">Verify Email</Button>

        <div className="text-sm text-gray-500 mb-4">
          Didn't receive a code? <button className="text-[#3e82e7] hover:underline">Resend Code</button>
        </div>

        <div className="text-sm text-gray-500">
          <Link href="/register" className="text-[#3e82e7] hover:underline">
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  )
}
