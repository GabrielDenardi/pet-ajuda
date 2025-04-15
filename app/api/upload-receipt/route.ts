import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const API_KEY = process.env.UPLOAD_SECRET_KEY || 'chave-secreta-supersegura'

export async function POST(req: NextRequest) {
  const authKey = req.headers.get('x-api-key')

  if (authKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const receiptsDir = path.join(process.cwd(), 'public', 'receipts')
  if (!existsSync(receiptsDir)) {
    await mkdir(receiptsDir, { recursive: true })
  }

  const filePath = path.join(receiptsDir, file.name)
  await writeFile(filePath, buffer)

  return NextResponse.json({ ok: true, filename: file.name })
}