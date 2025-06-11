import Image from "next/image"
import Link from "next/link"
import { User, Shield } from "lucide-react"

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#001a41] to-[#003366] p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={100} height={100} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Kinetic</h1>
        <p className="text-xl text-white">Choose your login portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Patient Portal Card */}
        <Link
          href="/login/patient"
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#53d08a] w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Patient Portal</h2>
                <p className="text-gray-500">
                  Access your personalized recovery plan and track your progress
                </p>
              </div>
            </div>
            <div className="mt-6 bg-[#f0f9f5] p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">For Patients</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• View and follow your personalized exercise program</li>
                <li>• Track your recovery progress</li>
                <li>• Schedule and manage appointments</li>
                <li>• Communicate with your healthcare providers</li>
              </ul>
            </div>
          </div>
          <div className="bg-[#53d08a] text-white p-4 text-center">
            <span className="font-medium">Enter Patient Portal</span>
          </div>
        </Link>

        {/* Provider Portal Card */}
        <Link
          href="/login/provider"
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#0066a2] w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Provider Portal</h2>
                <p className="text-gray-500">
                  Manage your patients and monitor their recovery progress
                </p>
              </div>
            </div>
            <div className="mt-6 bg-[#f0f4f9] p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">For Healthcare Providers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Manage patient treatment plans</li>
                <li>• Monitor patient progress and adherence</li>

                <li>• Schedule appointments and consultations</li>
              </ul>
            </div>
          </div>
          <div className="bg-[#0066a2] text-white p-4 text-center">
            <span className="font-medium">Enter Provider Portal</span>
          </div>
        </Link>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-white hover:underline text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
