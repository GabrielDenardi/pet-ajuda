import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { mkdir } from "fs/promises"
import { isAdminRequest } from "@/lib/admin-auth"

const maxReceiptBytes = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.formData()
  const file: File | null = data.get("file") as unknown as File

  if (!file) {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 400 })
  }

  const fileName = safeReceiptName(file.name)

  if (!fileName) {
    return NextResponse.json({ error: "Envie um comprovante em PDF" }, { status: 400 })
  }

  if (file.size > maxReceiptBytes) {
    return NextResponse.json({ error: "O comprovante deve ter até 10 MB" }, { status: 413 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const receiptsDir = path.join(process.cwd(), "public", "receipts")

  await mkdir(receiptsDir, { recursive: true })

  const filePath = path.join(receiptsDir, fileName)
  await writeFile(filePath, buffer)

  return NextResponse.json({ ok: true, file: fileName })
}

function safeReceiptName(name: string): string | null {
  const baseName = path.basename(name).replace(/[^\w.-]/g, "-")
  return baseName.toLowerCase().endsWith(".pdf") ? baseName : null
}
