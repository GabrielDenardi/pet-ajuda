import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const dir = path.join(process.cwd(), "public", "receipts")
  try {
    const files = await fs.promises.readdir(dir)
    const pdfs = files.filter(f => f.endsWith(".pdf"))
    return NextResponse.json({ files: pdfs })
  } catch {
    return NextResponse.json({ files: [] })
  }
}
