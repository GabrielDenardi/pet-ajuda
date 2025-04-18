import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { db } from '@/lib/firebaseAdmin'
import admin from 'firebase-admin'

export async function POST(req: NextRequest) {
  const { id: paymentId } = await req.json()
  if (!paymentId) {
    return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
  }

  const mp = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  })
  const payment = new Payment(mp)

  try {
    const result = await payment.get({ id: paymentId })
    if (result.status !== 'approved') {
      return NextResponse.json({ status: result.status })
    }

    const confirmedRef = db.collection('confirmed-payments').doc(paymentId)
    const confirmedSnap = await confirmedRef.get()
    if (confirmedSnap.exists) {
      return NextResponse.json({ alreadyConfirmed: true })
    }

    const amount = result.transaction_amount!
    await confirmedRef.set({
      amount,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    const totalRef = db.collection('donations').doc('total')
    await totalRef.set(
        { arrecadado: admin.firestore.FieldValue.increment(amount) },
        { merge: true }
    )

    const updated = await totalRef.get()
    return NextResponse.json({ ok: true, updated: updated.data() })
  } catch (err: any) {
    console.error('Erro ao confirmar pagamento:', err)
    return NextResponse.json({ error: true }, { status: 500 })
  }
}
