// components/transparency-section.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DonationCard } from "@/components/donation-card"
import fs from "fs"

export function TransparencySection() {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/receipts")
        const data = await res.json()
        setFiles(data.files || [])
      } catch (error) {
        console.error("Erro ao buscar comprovantes:", error)
        setFiles([])
      }
    }
    fetchFiles()
  }, [])

  return (
    <section className="w-full backdrop-blur-md py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Transparência</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Acompanhe como suas doações estão sendo utilizadas para ajudar os animais de rua
          </p>
        </motion.div>

        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {files.map((file, index) => (
              <DonationCard key={file} month={file.replace(".pdf", "")} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-6">
            Nenhum comprovante disponível ainda. Em breve publicaremos os dados de transparência. 🐾
          </div>
        )}
      </div>
    </section>
  )
}
