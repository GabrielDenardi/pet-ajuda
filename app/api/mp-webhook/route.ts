import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { db } from '@/lib/firebaseAdmin'
import admin from 'firebase-admin'

export async function POST(req: NextRequest) {
  const body = await parseBody(req)
  const { type, data } = body

  if (type === 'payment' && data?.id) {
    const mp = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    })
    const payment = new Payment(mp)

    try {
      const result = await payment.get({ id: data.id })

      if (result.status === 'approved') {
        const paymentId = data.id.toString()
        const confirmedRef = db.collection('confirmed-payments').doc(paymentId)
        const confirmedSnap = await confirmedRef.get()

        if (confirmedSnap.exists) {
          console.log(`⚠️ Pagamento ${paymentId} já registrado.`)
          return NextResponse.json({ alreadyConfirmed: true })
        }

        await confirmedRef.set({
          amount: result.transaction_amount,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })

        const totalRef = db.collection('donations').doc('total')
        await totalRef.set(
            { arrecadado: admin.firestore.FieldValue.increment(result.transaction_amount!) },
            { merge: true }
        )

        const updated = await totalRef.get()
        return NextResponse.json({ ok: true, updated: updated.data() })
      } else {
        console.log("ℹ️ Pagamento não aprovado. Status:", result.status)
        return NextResponse.json({ status: result.status })
      }

    } catch (err: any) {
      console.error("❌ Erro ao processar pagamento:", err)
      return NextResponse.json({ error: true }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function parseBody(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return req.json()
  const form = await req.formData()
  const obj: any = {}
  form.forEach((v, k) => (obj[k] = v))
  return obj
}
