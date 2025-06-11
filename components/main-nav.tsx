import Link from "next/link"
import Image from "next/image"
import { ScrollLink } from "@/components/scroll-link"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/kinetic-logo.png"
          alt="Kinetic"
          width={60}
          height={60}
          className="h-12 w-auto"
        />
      </Link>
      <nav className="hidden md:flex items-center space-x-6">
        <ScrollLink
          href="#features"
          className="text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          Features
        </ScrollLink>
        <ScrollLink
          href="#how-it-works"
          className="text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          How It Works
        </ScrollLink>
        <ScrollLink
          href="#success-stories"
          className="text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          Success Stories
        </ScrollLink>
        <ScrollLink
          href="#resources"
          className="text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          Resources
        </ScrollLink>
      </nav>
    </div>
  )
}
