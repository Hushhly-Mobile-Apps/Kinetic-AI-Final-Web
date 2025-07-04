"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Activity, BarChart3, FileText, Lock } from "lucide-react"

export default function Home() {
  // Bypass handler
  const handleBypass = () => {
    const tempUser = {
      id: "temp-patient",
      email: "demo@patient.com",
      name: "Ayu Pranata",
      role: "patient",
      avatar: "/smiling-brown-haired-woman.png"
    }
    localStorage.setItem("kineticUser", JSON.stringify(tempUser))
    document.cookie = `kineticUser=${JSON.stringify(tempUser)}; path=/; max-age=86400`
    window.location.href = "/dashboard/patient"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Personalized Recovery Powered by Movement Intelligence
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Transform your rehabilitation with intelligent movement coaching and data-driven therapy. Our platform
                  bridges home exercises with clinical expertise for a smoother, faster recovery experience.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/recovery-journey">
                    <Button className="bg-[#001a41] text-white hover:bg-[#001a41]/90">
                      Start Your Recovery Journey
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button variant="outline" className="border-[#001a41] text-[#001a41]">
                      Watch Demo
                    </Button>
                  </Link>
                </div>
                {/* BYPASS BUTTON */}
                <Button
                  variant="outline"
                  className="mt-4 w-fit bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  onClick={handleBypass}
                >
                  🚀 Bypass to Patient Dashboard
                </Button>
              </div>
              <div className="mx-auto lg:mx-0 lg:flex-1">
                <Image
                  src="/digital-rehabilitation-therapy.png"
                  alt="Rehabilitation therapy with digital screens"
                  width={600}
                  height={600}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Smart Rehabilitation Ecosystem */}
        <section className="py-16 bg-[#f9fafb]" id="features">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Smart Rehabilitation Ecosystem</h2>
              <p className="text-[#4b5563] max-w-2xl mx-auto">
                Comprehensive tools designed by rehabilitation specialists and AI engineers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Movement Intelligence</h3>
                <p className="text-[#4b5563] text-sm">
                  Computer vision technology that analyzes each movement to ensure therapeutic effectiveness
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Responsive Therapy Plans</h3>
                <p className="text-[#4b5563] text-sm">
                  Dynamic rehabilitation protocols that evolve based on your performance and recovery indicators
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Recovery Analytics</h3>
                <p className="text-[#4b5563] text-sm">
                  Visual progress reports with actionable insights to keep your recovery on track
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Clinical-Grade Privacy</h3>
                <p className="text-[#4b5563] text-sm">
                  Enterprise-level security ensuring your medical information meets healthcare compliance standards
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16" id="how-it-works">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">How It Works</h2>
              <p className="text-[#4b5563]">Three simple steps to start your recovery journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#111827] font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Initial Assessment</h3>
                <p className="text-[#4b5563] text-sm">
                  Complete a comprehensive evaluation of your condition and goals
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#111827] font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Personalized Plan</h3>
                <p className="text-[#4b5563] text-sm">Receive a customized therapy program tailored to your needs</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#111827] font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                <p className="text-[#4b5563] text-sm">Monitor your improvements with detailed analytics and feedback</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16" id="success-stories">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">
                See how patients like you achieved their rehabilitation goals with AI assistance
              </h2>
              <p className="text-[#4b5563]">Real results from real patients</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    src="/smiling-brown-haired-woman.png"
                    alt="Sarah M."
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Sarah M.</h4>
                    <p className="text-sm text-[#4b5563]">Knee Rehabilitation</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic">
                  "The AI-guided exercises and real-time feedback helped me recover from my knee surgery faster than
                  expected. I'm back to my active lifestyle!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    src="/athletic-man-short-hair.png"
                    alt="Michael R."
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Michael R.</h4>
                    <p className="text-sm text-[#4b5563]">Sports Recovery</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic">
                  "As a professional athlete, precise movement is crucial. This platform measures my performance with
                  extreme accuracy for optimal recovery."
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    src="/older-man-glasses.png"
                    alt="David L."
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">David L.</h4>
                    <p className="text-sm text-[#4b5563]">Back Pain Management</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic">
                  "The personalized exercise plans and progress tracking have made a huge difference in managing my
                  chronic back pain. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 bg-[#f9fafb]" id="resources">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Resources</h2>
              <p className="text-[#4b5563] max-w-2xl mx-auto">
                Helpful guides and information to support your rehabilitation journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Exercise Guides</h3>
                <p className="text-[#4b5563] text-sm mb-4">
                  Detailed instructions and videos for common rehabilitation exercises
                </p>
                <Link href="/resources/exercise-guides" className="text-[#001a41] text-sm font-medium hover:underline">
                  Learn more →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Recovery Tips</h3>
                <p className="text-[#4b5563] text-sm mb-4">
                  Expert advice to maximize your rehabilitation results and prevent setbacks
                </p>
                <Link href="/resources/recovery-tips" className="text-[#001a41] text-sm font-medium hover:underline">
                  Learn more →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">FAQ</h3>
                <p className="text-[#4b5563] text-sm mb-4">
                  Answers to common questions about our platform and rehabilitation process
                </p>
                <Link href="/resources/faq" className="text-[#001a41] text-sm font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#111827] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Take the First Step Toward Better Recovery</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Join a community of successful recoveries supported by cutting-edge rehabilitation technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/free-trial">
                <Button className="bg-white text-[#111827] hover:bg-[#f3f4f6]">Start Free Trial</Button>
              </Link>
              <Link href="/schedule-demo">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/kinetic-logo.png" alt="Kinetic Logo" width={60} height={60} />
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Transforming rehabilitation through movement intelligence and personalized care.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>info@example.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Recovery Street</li>
                <li>Health City, HC 12345</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-300">
            <p>© 2024 Movement Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
