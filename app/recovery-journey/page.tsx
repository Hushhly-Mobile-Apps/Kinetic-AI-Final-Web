import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Activity,
  BarChart3,
  FileText,
  Lock,
  Users,
  LineChart,
  UserCog,
  Smartphone,
  Zap,
  MousePointer,
  Clock,
} from "lucide-react"

export default function RecoveryJourneyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-[#111827] text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/kinetic-new-logo.png" alt="Kinetic Logo" width={40} height={40} />
            <span className="font-bold text-xl text-white">KINETIC</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/recovery-journey#features" className="text-sm hover:text-[#9ca3af]">
              Features
            </Link>
            <Link href="/recovery-journey#how-it-works" className="text-sm hover:text-[#9ca3af]">
              How It Works
            </Link>
            <Link href="/recovery-journey#success-stories" className="text-sm hover:text-[#9ca3af]">
              Success Stories
            </Link>
            <Link href="/recovery-journey#resources" className="text-sm hover:text-[#9ca3af]">
              Resources
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight mb-6">
                Personalized Recovery Powered by Movement Intelligence
              </h1>
              <p className="text-[#4b5563] mb-8 max-w-lg">
                Transform your rehabilitation with intelligent movement coaching and data-driven therapy. Our platform
                bridges home exercises with clinical expertise for a smoother, faster recovery experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/assessment">
                  <Button className="bg-[#111827] hover:bg-[#1f2937]">Start Your Recovery Journey</Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" className="border-[#111827] text-[#111827]">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-[#f3e8ff] rounded-lg p-6">
              <Image
                src="/rehabilitation-therapy-data.png"
                alt="Rehabilitation Platform Illustration"
                width={500}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Rehabilitation Equipment Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image src="/rehabilitation-equipment.jpg" alt="Rehabilitation Equipment" fill className="object-cover" />
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
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/movement-intelligence.jpg" alt="Movement Intelligence" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <Activity className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Movement Intelligence</h3>
                <p className="text-[#4b5563] text-sm">
                  Computer vision technology that analyzes each movement to ensure therapeutic effectiveness
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/responsive-therapy.jpg" alt="Responsive Therapy Plans" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <FileText className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Responsive Therapy Plans</h3>
                <p className="text-[#4b5563] text-sm">
                  Dynamic rehabilitation protocols that evolve based on your performance and recovery indicators
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/recovery-analytics.jpg" alt="Recovery Analytics" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <BarChart3 className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Recovery Analytics</h3>
                <p className="text-[#4b5563] text-sm">
                  Visual progress reports with actionable insights to keep your recovery on track
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/clinical-privacy.jpg" alt="Clinical-Grade Privacy" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <Lock className="w-4 h-4 text-[#111827]" />
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

        {/* Website Features */}
        <section className="py-16 bg-[#f9fafb]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Website Features</h2>
              <p className="text-[#4b5563]">Designed for optimal user experience</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/mobile-responsive.jpg" alt="Mobile Responsive" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <Smartphone className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mobile Responsive</h3>
                <p className="text-[#4b5563] text-sm">Access your rehabilitation program on any device</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/fast-loading.jpg" alt="Fast Loading" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <Zap className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Loading</h3>
                <p className="text-[#4b5563] text-sm">Optimized performance for seamless experience</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/accessibility.jpg" alt="Accessibility" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <MousePointer className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-[#4b5563] text-sm">Designed for users of all abilities</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/real-time-updates.jpg" alt="Real-time Updates" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <Clock className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
                <p className="text-[#4b5563] text-sm">Instant feedback and progress monitoring</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Success Metrics</h2>
              <p className="text-[#4b5563]">Real impact through innovative rehabilitation technology</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/patient-satisfaction.jpg" alt="Patient Satisfaction" fill className="object-cover" />
                </div>
                <h3 className="text-3xl font-bold text-[#111827] mb-2">95%</h3>
                <p className="text-[#4b5563] text-sm">Patient satisfaction</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/recovery-time.jpg" alt="Recovery Time Reduction" fill className="object-cover" />
                </div>
                <h3 className="text-3xl font-bold text-[#111827] mb-2">40%</h3>
                <p className="text-[#4b5563] text-sm">Faster recovery time</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/patients-served.jpg" alt="Patients Served" fill className="object-cover" />
                </div>
                <h3 className="text-3xl font-bold text-[#111827] mb-2">10k+</h3>
                <p className="text-[#4b5563] text-sm">Patients served</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/healthcare-providers.jpg" alt="Healthcare Providers" fill className="object-cover" />
                </div>
                <h3 className="text-3xl font-bold text-[#111827] mb-2">500+</h3>
                <p className="text-[#4b5563] text-sm">Healthcare providers</p>
              </div>
            </div>
          </div>
        </section>

        {/* For Practitioners */}
        <section className="py-16 bg-[#f9fafb]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">For Practitioners</h2>
              <p className="text-[#4b5563]">Enhance your practice with AI-powered rehabilitation tools</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/clinical-integration.jpg" alt="Clinical Integration" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <Users className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Clinical Integration</h3>
                <p className="text-[#4b5563] text-sm">
                  Seamlessly integrate AI-powered movement analysis into your existing workflow
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/patient-monitoring.jpg" alt="Patient Monitoring" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <LineChart className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Patient Monitoring</h3>
                <p className="text-[#4b5563] text-sm">
                  Track patient progress and adherence with detailed analytics and reporting
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                  <Image src="/practice-growth.jpg" alt="Practice Growth" fill className="object-cover" />
                </div>
                <div className="bg-[#f3f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-4 -mt-12 ml-4 border-2 border-white">
                  <UserCog className="w-4 h-4 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Practice Growth</h3>
                <p className="text-[#4b5563] text-sm">
                  Expand your practice with remote monitoring and data-driven treatment plans
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="success-stories" className="py-16">
          <div className="container mx-auto px-4">
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-16">
              <Image src="/group-therapy-session.jpg" alt="Group Therapy Session" fill className="object-cover" />
            </div>

            <div className="text-center mb-8">
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

        {/* FAQ Section */}
        <section id="resources" className="py-16 bg-[#f9fafb]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Frequently Asked Questions</h2>
              <p className="text-[#4b5563]">Find answers to common questions about our platform</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                    How does the AI movement analysis work?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-[#4b5563]">
                    Our AI technology uses computer vision to analyze and measure your movements in real-time, providing
                    feedback on form, range of motion, and progress. The system continuously learns from your
                    performance to optimize your recovery journey.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                    Is my medical data secure?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-[#4b5563]">
                    Yes, we implement HIPAA-compliant protocols and use industry-grade encryption to ensure all your
                    personal and medical information is protected at all times.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                    Can I use this platform with my existing healthcare provider?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-[#4b5563]">
                    We designed our platform to complement traditional healthcare. Your therapist can access your
                    progress reports, modify your exercise plan, and collaborate with you remotely.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                    What equipment do I need?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-[#4b5563]">
                    For basic functionality, you only need a smartphone or computer with a camera. Some advanced
                    exercises may require simple equipment like resistance bands or weights, but the platform is
                    designed to work with minimal equipment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#111827] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/kinetic-new-logo.png" alt="Kinetic Logo" width={32} height={32} />
                <span className="font-bold text-xl">KINETIC</span>
              </div>
              <p className="text-sm text-[#9ca3af] mb-4">
                Transforming rehabilitation through movement intelligence and personalized care.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-[#9ca3af] hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-[#9ca3af] hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
                <Link href="#" className="text-[#9ca3af] hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89
                      1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-[#9ca3af]">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-[#9ca3af]">
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-[#9ca3af]">
                <li>info@example.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Recovery Street</li>
                <li>Health City, HC 12345</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1f2937] mt-12 pt-6 text-center text-sm text-[#9ca3af]">
            <p>© 2024 Movement Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
