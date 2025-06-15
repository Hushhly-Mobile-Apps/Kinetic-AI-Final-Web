import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#001a41] text-white">
      <div className="container flex h-16 items-center">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-[#001a41]/90 hover:text-white">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" className="text-white hover:bg-[#001a41]/90 hover:text-white">
              Sign up
            </Button>
          </Link>
          <Link href="/book-consultation">
            <Button className="bg-white text-[#001a41] hover:bg-white/90">Book Consultation</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
