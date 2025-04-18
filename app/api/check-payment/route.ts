import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })

    try {
        const doc = await db.collection('confirmed-payments').doc(id).get()
        if (doc.exists) {
            return NextResponse.json({ confirmed: true })
        } else {
            return NextResponse.json({ confirmed: false })
        }
    } catch (err) {
        console.error("Erro ao verificar pagamento:", err)
        return NextResponse.json({ error: true }, { status: 500 })
    }
}
