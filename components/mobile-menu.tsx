"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { DonationButton } from "@/components/donation-button"
import { X, Home, Info, Heart, Instagram, Twitter, Facebook } from "lucide-react"

// ✅ Adiciona a interface aqui no topo do arquivo
interface MobileMenuProps {
  onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const [showDonation, setShowDonation] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          className="w-full max-w-xs space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            onClick={onClose}
          >
            <Home size={20} />
            <span className="font-medium">Página Inicial</span>
          </Link>

          <Link
            href="/transparencia"
            className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors"
            onClick={onClose}
          >
            <Info size={20} />
            <span className="font-medium">Para onde vai o dinheiro?</span>
          </Link>

          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors"
            onClick={() => {
              setShowDonation(true)
            }}
          >
            <Heart size={20} />
            <span className="font-medium">Doar agora</span>
          </button>
        </motion.div>
      </div>

      {/* Modal da Doação */}
      <AnimatePresence>
        {showDonation && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-md w-full bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <button
                onClick={() => setShowDonation(false)}
                className="absolute top-4 right-4 text-zinc-600 dark:text-zinc-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <DonationButton />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
