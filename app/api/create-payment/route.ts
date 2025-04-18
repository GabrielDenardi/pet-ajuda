import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const preference = new Preference(mercadopago)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const value = Number(body.value)

  if (!value || isNaN(value) || value < 1) {
    return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
  }

  const baseUrl = process.env.APP_URL

  const preferenceData = {
    items: [{
      id: 'doacao-livre',
      title: 'Doação para animais',
      unit_price: value,
      quantity: 1,
    }],
    back_urls: {
      success: `${baseUrl}/sucesso`,
      pending: `${baseUrl}/sucesso`,
      failure: `${baseUrl}/erro`,
    },
    auto_return: 'approved'
  }

  const response = await preference.create({ body: preferenceData })

  return NextResponse.json({ url: response.init_point })
}
