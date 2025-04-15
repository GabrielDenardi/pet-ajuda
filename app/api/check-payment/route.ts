import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function POST(req: NextRequest) {
    const { id } = await req.json()

    if (!id) return NextResponse.json({ error: true }, { status: 400 })

    const basePath = path.join(process.cwd(), 'data')
    const confirmedPath = path.join(basePath, 'confirmed-payments.json')

    try {
        const raw = await fs.readFile(confirmedPath, 'utf-8')
        const confirmed: string[] = JSON.parse(raw)

        if (confirmed.includes(id)) {
            return NextResponse.json({ confirmed: true, alreadyRegistered: true })
        }

        confirmed.push(id)
        await fs.writeFile(confirmedPath, JSON.stringify(confirmed, null, 2))

        return NextResponse.json({ confirmed: true, newlyRegistered: true })
    } catch (err) {
        console.error("Erro ao verificar/adicionar pagamento confirmado:", err)
        return NextResponse.json({ error: true }, { status: 500 })
    }
}
