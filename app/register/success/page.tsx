import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000a2c] to-[#00487c] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-[#53d08a]" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Created Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Your account has been created. You can now sign in to access your Kinetic dashboard.
        </p>

        <Button asChild className="w-full bg-[#53d08a] hover:bg-[#31bd7c] text-white font-medium">
          <Link href="/login">Sign In to Your Account</Link>
        </Button>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-[#3e82e7] hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
