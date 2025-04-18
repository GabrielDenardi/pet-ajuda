import { NextResponse } from 'next/server'
import { db } from '@/lib/firebaseAdmin'

export async function GET() {
  const doc = await db.collection('donations').doc('total').get()
  if (!doc.exists) {
    return NextResponse.json({ arrecadado: 0, meta: 0 })
  }
  const { arrecadado = 0, meta = 0 } = doc.data()!
  return NextResponse.json({ arrecadado, meta })
}
