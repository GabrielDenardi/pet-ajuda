"use client"

import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Eye, X } from "lucide-react"

interface DonationCardProps {
  month: string
  index: number
}

export function DonationCard({ month, index }: DonationCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fileName = month.toLowerCase().replace(/\s/g, "-") + ".pdf"
  const fileUrl = `/receipts/${fileName}`

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Card className="overflow-hidden h-full bg-black/20 backdrop-blur-sm border-0 shadow-lg group">
          <div className="aspect-[3/2] relative overflow-hidden bg-zinc-900 text-white flex items-center justify-center">
            <span className="text-sm text-white/70">Comprovante PDF</span>

            <motion.button
              onClick={() => setIsOpen(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white/20 backdrop-blur-sm rounded-full p-3"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-medium">Comprovante {month}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs md:text-sm text-muted-foreground">Doação para ONG Amigos dos Animais</p>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs md:text-sm font-medium">R$ 1.500,00</p>
              <motion.button
                onClick={() => setIsOpen(true)}
                className="text-xs text-primary hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver detalhes
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modal PDF */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[60px] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
        
            <motion.div
              className="relative max-w-5xl w-full h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-900 z-10"
              >
                <X size={20} />
              </button>
              <iframe
                src={fileUrl}
                title={`Comprovante ${month}`}
                className="w-full h-full"
              />
              <div className="p-2 text-center text-xs text-muted-foreground border-t">
                Visualizando comprovante de {month}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
