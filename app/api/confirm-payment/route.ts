import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { registerApprovedPayment } from '@/lib/payments'

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

    const registration = await registerApprovedPayment(String(paymentId), result.transaction_amount!)
    return NextResponse.json(registration)
  } catch (err: any) {
    console.error('Erro ao confirmar pagamento:', err)
    return NextResponse.json({ error: true }, { status: 500 })
  }
}
