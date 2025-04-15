"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileUp, CheckCircle, XCircle } from "lucide-react"

export default function ReceiptUploadPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setStatus("uploading")
    setMessage("")

    const res = await fetch("/api/receipts/upload", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      setStatus("success")
      setMessage("Comprovante enviado com sucesso!")
    } else {
      setStatus("error")
      setMessage("Erro ao enviar o comprovante.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-lg w-full mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-white/10 p-8 mt-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-primary/20 text-primary">
          <FileUp size={20} />
        </div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Envio de Comprovantes</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full rounded-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={status === "uploading"}
          className="bg-primary text-white py-3 rounded-full transition font-medium"
        >
          {status === "uploading" ? "Enviando..." : "Enviar Comprovante"}
        </motion.button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-4 text-sm flex items-center gap-2 ${
            status === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {status === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}
