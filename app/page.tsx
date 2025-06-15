'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Activity, BarChart3, FileText, Lock } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [counters, setCounters] = useState({ patients: 0, recovery: 0, satisfaction: 0 })
  
  useEffect(() => {
    setIsVisible(true)
    
    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    // Animated counters
    const animateCounters = () => {
      const targets = { patients: 10000, recovery: 95, satisfaction: 98 }
      const duration = 2000
      const steps = 60
      const stepTime = duration / steps
      
      let currentStep = 0
      const counterTimer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        
        setCounters({
          patients: Math.floor(targets.patients * progress),
          recovery: Math.floor(targets.recovery * progress),
          satisfaction: Math.floor(targets.satisfaction * progress)
        })
        
        if (currentStep >= steps) {
          clearInterval(counterTimer)
          setCounters(targets)
        }
      }, stepTime)
    }
    
    // Start counter animation after a delay
    setTimeout(animateCounters, 2000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
          {/* Interactive background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
              style={{
                transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                left: '10%',
                top: '20%'
              }}
            />
            <div 
              className="absolute w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
              style={{
                transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
                right: '10%',
                bottom: '20%'
              }}
            />
          </div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none min-h-[120px] flex items-center relative z-10 bg-white/90 p-4 rounded-lg" style={{color: '#000000 !important', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
                  Personalized Recovery Powered by Movement Intelligence
                </h1>
                <p className={`text-black !text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed transition-all duration-1000 delay-1000 relative z-10 bg-white/80 p-3 rounded ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{color: '#000000 !important'}}>
                  Transform your rehabilitation with intelligent movement coaching and data-driven therapy. Our platform
                  bridges home exercises with clinical expertise for a smoother, faster recovery experience.
                </p>
                <div className={`flex flex-col gap-2 min-[400px]:flex-row transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <Link href="/recovery-journey">
                    <Button className="bg-[#001a41] text-white hover:bg-[#001a41]/90">
                      Start Your Recovery Journey
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button variant="outline" className="border-[#001a41] !text-black" style={{color: '#000000 !important'}}>
                      Watch Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 lg:flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <Image
                  src="/digital-rehabilitation-therapy.png"
                  alt="Rehabilitation therapy with digital screens"
                  width={600}
                  height={600}
                  className="rounded-lg object-cover transform transition-all duration-700 group-hover:scale-105 group-hover:shadow-2xl relative z-10"
                  style={{
                    transform: `translateY(${scrollY * 0.1}px) scale(${hoveredCard === 0 ? 1.02 : 1})`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
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

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-[#001a41] mb-2 transform transition-all duration-500 group-hover:scale-110">
                  {counters.patients.toLocaleString()}+
                </div>
                <div className="text-gray-600 group-hover:text-[#001a41] transition-colors duration-300">Patients Served</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-[#001a41] mb-2 transform transition-all duration-500 group-hover:scale-110">
                  {counters.recovery}%
                </div>
                <div className="text-gray-600 group-hover:text-[#001a41] transition-colors duration-300">Recovery Rate</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-[#001a41] mb-2 transform transition-all duration-500 group-hover:scale-110">
                  {counters.satisfaction}%
                </div>
                <div className="text-gray-600 group-hover:text-[#001a41] transition-colors duration-300">Patient Satisfaction</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <style jsx>{`
                .feature-card {
                  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                  animation: slideInUp 0.6s ease-out;
                  position: relative;
                  overflow: hidden;
                }
                .feature-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(0, 26, 65, 0.1), transparent);
                  transition: left 0.5s;
                }
                .feature-card:hover::before {
                  left: 100%;
                }
                .feature-card:hover {
                  transform: translateY(-12px) scale(1.02);
                  box-shadow: 0 25px 50px -12px rgba(0, 26, 65, 0.25);
                  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                }
                .feature-card:nth-child(1) { animation-delay: 0.1s; }
                .feature-card:nth-child(2) { animation-delay: 0.2s; }
                .feature-card:nth-child(3) { animation-delay: 0.3s; }
                .feature-card:nth-child(4) { animation-delay: 0.4s; }
                
                @keyframes slideInUp {
                  from {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                
                .typewriter-text {
                  border-right: 2px solid #001a41;
                }
                
                .pulse-button {
                  animation: pulse 2s infinite;
                  position: relative;
                  overflow: hidden;
                }
                .pulse-button::before {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 0;
                  height: 0;
                  background: rgba(255, 255, 255, 0.3);
                  border-radius: 50%;
                  transform: translate(-50%, -50%);
                  transition: width 0.6s, height 0.6s;
                }
                .pulse-button:hover::before {
                  width: 300px;
                  height: 300px;
                }
                
                @keyframes pulse {
                  0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(0, 26, 65, 0.4);
                  }
                  50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 0 10px rgba(0, 26, 65, 0);
                  }
                }
                
                .floating-text {
                  animation: float 3s ease-in-out infinite;
                }
                
                @keyframes float {
                  0%, 100% {
                    transform: translateY(0px);
                  }
                  50% {
                    transform: translateY(-10px);
                  }
                }
                
                .glow-text {
                  animation: glow 3s ease-in-out infinite alternate;
                  background: linear-gradient(45deg, #001a41, #003d82, #001a41);
                  background-size: 200% 200%;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                }
                
                @keyframes glow {
                  0% {
                    background-position: 0% 50%;
                    filter: drop-shadow(0 0 5px rgba(0, 26, 65, 0.5));
                  }
                  50% {
                    background-position: 100% 50%;
                    filter: drop-shadow(0 0 15px rgba(0, 26, 65, 0.8));
                  }
                  100% {
                    background-position: 0% 50%;
                    filter: drop-shadow(0 0 5px rgba(0, 26, 65, 0.5));
                  }
                }
                
                .interactive-bg {
                  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                  background-size: 400% 400%;
                  animation: gradientShift 15s ease infinite;
                }
                
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
              <div 
                className="bg-white p-6 rounded-lg shadow-sm feature-card cursor-pointer"
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] w-12 h-12 rounded-full flex items-center justify-center mb-4 transform transition-all duration-500 ${hoveredCard === 1 ? 'scale-110 rotate-12 bg-gradient-to-br from-blue-100 to-indigo-100' : ''}`}>
                  <Activity className={`w-6 h-6 transition-all duration-500 ${hoveredCard === 1 ? 'text-[#001a41] scale-110' : 'text-[#111827]'}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Movement Intelligence</h3>
                <p className="text-[#4b5563] text-sm">
                  Computer vision technology that analyzes each movement to ensure therapeutic effectiveness
                </p>
              </div>

              <div 
                className="bg-white p-6 rounded-lg shadow-sm feature-card cursor-pointer"
                onMouseEnter={() => setHoveredCard(2)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] w-12 h-12 rounded-full flex items-center justify-center mb-4 transform transition-all duration-500 ${hoveredCard === 2 ? 'scale-110 rotate-12 bg-gradient-to-br from-green-100 to-emerald-100' : ''}`}>
                  <FileText className={`w-6 h-6 transition-all duration-500 ${hoveredCard === 2 ? 'text-[#001a41] scale-110' : 'text-[#111827]'}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Responsive Therapy Plans</h3>
                <p className="text-[#4b5563] text-sm">
                  Dynamic rehabilitation protocols that evolve based on your performance and recovery indicators
                </p>
              </div>

              <div 
                className="bg-white p-6 rounded-lg shadow-sm feature-card cursor-pointer"
                onMouseEnter={() => setHoveredCard(3)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] w-12 h-12 rounded-full flex items-center justify-center mb-4 transform transition-all duration-500 ${hoveredCard === 3 ? 'scale-110 rotate-12 bg-gradient-to-br from-purple-100 to-violet-100' : ''}`}>
                  <BarChart3 className={`w-6 h-6 transition-all duration-500 ${hoveredCard === 3 ? 'text-[#001a41] scale-110' : 'text-[#111827]'}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Recovery Analytics</h3>
                <p className="text-[#4b5563] text-sm">
                  Visual progress reports with actionable insights to keep your recovery on track
                </p>
              </div>

              <div 
                className="bg-white p-6 rounded-lg shadow-sm feature-card cursor-pointer"
                onMouseEnter={() => setHoveredCard(4)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] w-12 h-12 rounded-full flex items-center justify-center mb-4 transform transition-all duration-500 ${hoveredCard === 4 ? 'scale-110 rotate-12 bg-gradient-to-br from-red-100 to-pink-100' : ''}`}>
                  <Lock className={`w-6 h-6 transition-all duration-500 ${hoveredCard === 4 ? 'text-[#001a41] scale-110' : 'text-[#111827]'}`} />
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
              <h2 className="text-3xl font-bold text-[#111827] mb-4 floating-text">How It Works</h2>
              <p className="text-[#4b5563] glow-text">Three simple steps to start your recovery journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-indigo-100">
                  <span className="text-[#111827] font-semibold group-hover:text-[#001a41] transition-colors duration-300">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#001a41] transition-colors duration-300">Initial Assessment</h3>
                <p className="text-[#4b5563] text-sm group-hover:text-[#374151] transition-colors duration-300">
                  Complete a comprehensive evaluation of your condition and goals
                </p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-gradient-to-br group-hover:from-green-100 group-hover:to-emerald-100">
                  <span className="text-[#111827] font-semibold group-hover:text-[#001a41] transition-colors duration-300">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#001a41] transition-colors duration-300">Personalized Plan</h3>
                <p className="text-[#4b5563] text-sm group-hover:text-[#374151] transition-colors duration-300">Receive a customized therapy program tailored to your needs</p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-gradient-to-br group-hover:from-purple-100 group-hover:to-violet-100">
                  <span className="text-[#111827] font-semibold group-hover:text-[#001a41] transition-colors duration-300">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#001a41] transition-colors duration-300">Track Progress</h3>
                <p className="text-[#4b5563] text-sm group-hover:text-[#374151] transition-colors duration-300">Monitor your improvements with detailed analytics and feedback</p>
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
              <div className="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-blue-50/50 group cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <Image
                      src="/smiling-brown-haired-woman.png"
                      alt="Sarah M."
                      width={48}
                      height={48}
                      className="rounded-full mr-4 transform transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold group-hover:text-[#001a41] transition-colors duration-300">Sarah M.</h4>
                    <p className="text-sm text-[#4b5563] group-hover:text-[#001a41]/70 transition-colors duration-300">Knee Rehabilitation</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic group-hover:text-[#374151] transition-colors duration-300">
                  "The AI-guided exercises and real-time feedback helped me recover from my knee surgery faster than
                  expected. I'm back to my active lifestyle!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-green-50/50 group cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <Image
                      src="/athletic-man-short-hair.png"
                      alt="Michael R."
                      width={48}
                      height={48}
                      className="rounded-full mr-4 transform transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold group-hover:text-[#001a41] transition-colors duration-300">Michael R.</h4>
                    <p className="text-sm text-[#4b5563] group-hover:text-[#001a41]/70 transition-colors duration-300">Sports Recovery</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic group-hover:text-[#374151] transition-colors duration-300">
                  "As a professional athlete, precise movement is crucial. This platform measures my performance with
                  extreme accuracy for optimal recovery."
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-purple-50/50 group cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <Image
                      src="/older-man-glasses.png"
                      alt="David L."
                      width={48}
                      height={48}
                      className="rounded-full mr-4 transform transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold group-hover:text-[#001a41] transition-colors duration-300">David L.</h4>
                    <p className="text-sm text-[#4b5563] group-hover:text-[#001a41]/70 transition-colors duration-300">Back Pain Management</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic group-hover:text-[#374151] transition-colors duration-300">
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
              <div className="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-blue-50/50 group cursor-pointer">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#001a41] transition-colors duration-300">Exercise Guides</h3>
                <p className="text-[#4b5563] text-sm mb-4 group-hover:text-[#374151] transition-colors duration-300">
                  Detailed instructions and videos for common rehabilitation exercises
                </p>
                <Link href="/resources/exercise-guides" className="text-[#001a41] text-sm font-medium hover:underline group-hover:font-bold transition-all duration-300">
                  Learn more →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-green-50/50 group cursor-pointer">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#001a41] transition-colors duration-300">Recovery Tips</h3>
                <p className="text-[#4b5563] text-sm mb-4 group-hover:text-[#374151] transition-colors duration-300">
                  Expert advice to maximize your rehabilitation results and prevent setbacks
                </p>
                <Link href="/resources/recovery-tips" className="text-[#001a41] text-sm font-medium hover:underline group-hover:font-bold transition-all duration-300">
                  Learn more →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-purple-50/50 group cursor-pointer">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#001a41] transition-colors duration-300">FAQ</h3>
                <p className="text-[#4b5563] text-sm mb-4 group-hover:text-[#374151] transition-colors duration-300">
                  Answers to common questions about our platform and rehabilitation process
                </p>
                <Link href="/resources/faq" className="text-[#001a41] text-sm font-medium hover:underline group-hover:font-bold transition-all duration-300">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#111827] text-white relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-full bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 animate-pulse" />
            <div 
              className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
              style={{
                transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
                left: '20%',
                top: '10%'
              }}
            />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 floating-text glow-text text-white">Take the First Step Toward Better Recovery</h2>
            <p className="mb-8 max-w-2xl mx-auto text-white">
              Join a community of successful recoveries supported by cutting-edge rehabilitation technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/free-trial">
                <Button className="bg-white text-black hover:bg-[#f3f4f6] pulse-button" style={{color: '#000000 !important'}}>Start Free Trial</Button>
              </Link>
              <Link href="/schedule-demo">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 pulse-button">
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
