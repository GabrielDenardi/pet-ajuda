"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function ErroPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-4 text-red-500"
      >
        ❌ Algo deu errado com sua doação
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-muted-foreground mb-6"
      >
        Infelizmente não conseguimos processar seu pagamento. Você será redirecionado em alguns segundos.
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-md transition-all"
        onClick={() => router.push("/")}
      >
        Voltar para a página inicial
      </motion.button>
    </div>
  )
}
