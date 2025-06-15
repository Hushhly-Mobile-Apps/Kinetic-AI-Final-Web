import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
  href?: string
}

export function Logo({ className, size = 60, href = "/" }: LogoProps) {
  const logoComponent = (
    <div className={cn("relative", className)} style={{ width: `${size}px`, height: `${size}px` }}>
      <Image
        src="/kinetic-logo.png"
        alt="Kinetic Logo"
        fill
        style={{
          objectFit: "contain",
          objectPosition: "center",
        }}
        priority
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoComponent}
      </Link>
    )
  }

  return logoComponent
}
