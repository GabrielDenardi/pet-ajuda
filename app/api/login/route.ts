import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()

  if (password === process.env.ADMIN_SECRET) {
    cookies().set('admin-auth', process.env.ADMIN_SECRET!, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
