console.log("🛬 Webhook ativado!");

import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import path from 'path'
import { promises as fs } from 'fs'

export async function POST(req: NextRequest) {
  let body: any = {}

  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    body = await req.json()
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData()
    formData.forEach((value, key) => (body[key] = value))
  }

  console.log("📥 Webhook recebido:", body)

  const { type, data } = body

  if (type === 'payment' && data?.id) {
    const mp = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    })

    const payment = new Payment(mp)

    try {
      const result = await payment.get({ id: data.id })

      if (result.status === 'approved') {
        const filePath = path.join(process.cwd(), 'data/donation.json')
        const file = await fs.readFile(filePath, 'utf-8')
        const json = JSON.parse(file)

        json.arrecadado += result.transaction_amount
        await fs.writeFile(filePath, JSON.stringify(json, null, 2))

        console.log("✅ Valor atualizado:", json)
        return NextResponse.json({ ok: true, updated: json })
      } else {
        console.log("ℹ️ Pagamento não está aprovado. Status:", result.status)
      }

    } catch (err: any) {
      // Tratar erro de ID inexistente (ex: teste do painel)
      console.warn("⚠️ Pagamento não encontrado ou erro de API:", err.message || err)
      return NextResponse.json({ warning: 'Pagamento não encontrado ou inválido' }, { status: 200 })
    }
  }

  return NextResponse.json({ received: true })
}
