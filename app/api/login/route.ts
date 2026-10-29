import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminCookieName, isValidAdminSecret } from '@/lib/admin-auth'

export async function POST(req: Request) {
  const { password } = await req.json()

  if (isValidAdminSecret(password)) {
    const cookieStore = await cookies()
    cookieStore.set(adminCookieName, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
