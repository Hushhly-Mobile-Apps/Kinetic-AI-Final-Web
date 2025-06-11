"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface ScrollLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function ScrollLink({ href, children, className }: ScrollLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // If the href is a hash link to an element on the current page
    if (href.startsWith("#")) {
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    } else if (href.includes("#")) {
      // If it's a link to another page with a hash
      const [path, hash] = href.split("#")
      router.push(path)

      // Wait for page to load then scroll
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 100)
    } else {
      // Regular link
      router.push(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
