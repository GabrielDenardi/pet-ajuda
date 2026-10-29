import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoggedIn = isAdminRequest(req)

  if (isAdminRoute && !isLoggedIn) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
