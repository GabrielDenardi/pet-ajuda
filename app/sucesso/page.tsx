// app/sucesso/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

function SuccessContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment_id")
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const router = useRouter()

  useEffect(() => {
    if (paymentId) {
      fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: paymentId })
      })
          .then((res) => res.ok ? setStatus("success") : setStatus("error"))
          .catch(() => setStatus("error"))
    }
  }, [paymentId])

  return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center px-4">
        {status === "pending" && (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">⏳ Confirmando sua doação...</h1>
              <p className="text-muted-foreground">Por favor, aguarde enquanto registramos sua contribuição.</p>
            </>
        )}
        {status === "success" && (
            <>
              <h1 className="text-3xl font-bold mb-4">🎉 Obrigado pela sua doação!</h1>
              <p className="text-muted-foreground mb-6">Sua contribuição vai fazer diferença na vida de um animal. ❤️</p>
              <motion.button
                  onClick={() => router.push("/")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-6 py-3 rounded-full shadow-lg transition-all"
              >
                Voltar para a página inicial
              </motion.button>
            </>
        )}
        {status === "error" && (
            <>
              <h1 className="text-3xl font-bold mb-4 text-red-500">❌ Ocorreu um erro</h1>
              <p className="text-muted-foreground mb-6">Não conseguimos confirmar sua doação. Tente novamente ou entre em contato.</p>
              <motion.button
                  onClick={() => router.push("/")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg transition-all"
              >
                Voltar para a página inicial
              </motion.button>
            </>
        )}
      </div>
  )
}

export default function SucessoPage() {
  return (
      <Suspense fallback={<p className="text-center py-12">Carregando...</p>}>
        <SuccessContent />
      </Suspense>
  )
}
