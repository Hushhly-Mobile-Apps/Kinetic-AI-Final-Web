import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path.startsWith('/login/')
  const isHomePage = path === '/'
  
  // Get the token from cookies
  const token = request.cookies.get('kineticUser')?.value || ''
  
  // If user is not logged in and trying to access protected routes
  if (!isPublicPath && !isHomePage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If user is logged in and trying to access login page
  if (isPublicPath && token) {
    try {
      const user = JSON.parse(token)
      const redirectPath = user.role === 'provider' ? '/dashboard/provider' : '/dashboard/patient'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    } catch (error) {
      // If token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('kineticUser')
      return response
    }
  }
  
  // If user is logged in and accessing home page, redirect to appropriate dashboard
  if (isHomePage && token) {
    try {
      const user = JSON.parse(token)
      const redirectPath = user.role === 'provider' ? '/dashboard/provider' : '/dashboard/patient'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    } catch (error) {
      // If token is invalid, clear it and stay on home page
      const response = NextResponse.next()
      response.cookies.delete('kineticUser')
      return response
    }
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login/:path*',
    '/',
  ],
}
