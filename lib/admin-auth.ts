import type { NextRequest } from 'next/server'

export const adminCookieName = 'admin-auth'

export function isValidAdminSecret(value: unknown): value is string {
  const secret = process.env.ADMIN_SECRET
  return Boolean(secret) && typeof value === 'string' && value === secret
}

export function isAdminRequest(req: NextRequest): boolean {
  return isValidAdminSecret(req.cookies.get(adminCookieName)?.value)
}
