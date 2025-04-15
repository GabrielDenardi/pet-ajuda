import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { mkdir } from "fs/promises"

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file: File | null = data.get("file") as unknown as File

  if (!file) {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = file.name
  const receiptsDir = path.join(process.cwd(), "public", "receipts")

  await mkdir(receiptsDir, { recursive: true })

  const filePath = path.join(receiptsDir, fileName)
  await writeFile(filePath, buffer)

  return NextResponse.json({ ok: true, file: fileName })
}
