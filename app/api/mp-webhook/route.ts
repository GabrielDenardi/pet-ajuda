import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { registerApprovedPayment } from '@/lib/payments'

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
        const registration = await registerApprovedPayment(paymentId, result.transaction_amount!)

        if (registration.alreadyConfirmed) {
          console.log(`⚠️ Pagamento ${paymentId} já registrado.`)
        }

        return NextResponse.json(registration)
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
