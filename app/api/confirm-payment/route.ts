import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import path from 'path'
import { promises as fs } from 'fs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const paymentId = body.id

  if (!paymentId) {
    return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
  }

  const mp = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  })

  const payment = new Payment(mp)

  try {
    const result = await payment.get({ id: paymentId })

    if (result.status === 'approved') {
      const basePath = path.join(process.cwd(), 'data')

      // Verifica se já foi processado
      const confirmedPath = path.join(basePath, 'confirmed-payments.json')
      const confirmedRaw = await fs.readFile(confirmedPath, 'utf-8')
      const confirmed: string[] = JSON.parse(confirmedRaw)

      if (confirmed.includes(paymentId.toString())) {
        console.log(`⚠️ Pagamento ${paymentId} já registrado. Ignorando...`)
        return NextResponse.json({ alreadyConfirmed: true })
      }

      // Atualiza o total arrecadado
      const donationPath = path.join(basePath, 'donation.json')
      const file = await fs.readFile(donationPath, 'utf-8')
      const json = JSON.parse(file)

      json.arrecadado += result.transaction_amount
      await fs.writeFile(donationPath, JSON.stringify(json, null, 2))

      // Marca o payment como confirmado
      confirmed.push(paymentId.toString())
      await fs.writeFile(confirmedPath, JSON.stringify(confirmed, null, 2))

      console.log("✅ Valor atualizado via /confirm-payment:", json)
      return NextResponse.json({ ok: true, updated: json })
    } else {
      console.log("ℹ️ Pagamento não aprovado. Status:", result.status)
      return NextResponse.json({ status: result.status })
    }

  } catch (err: any) {
    console.error("❌ Erro ao confirmar pagamento:", err)
    return NextResponse.json({ error: true }, { status: 500 })
  }
}
