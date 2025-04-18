"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

function SuccessContent() {
    const searchParams = useSearchParams()
    const paymentId =
        searchParams.get("payment_id")
        || searchParams.get("collection_id")

    const [status, setStatus] = useState<"pending"|"success"|"error">("pending")
    const router = useRouter()

    useEffect(() => {
        if (!paymentId) {
            setStatus("error")
            return
        }

        const interval = setInterval(() => {
            fetch("/api/check-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: paymentId })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.confirmed) {
                        setStatus("success")
                        clearInterval(interval)
                    }
                })
                .catch(() => {
                    setStatus("error")
                    clearInterval(interval)
                })
        }, 3000)

        return () => clearInterval(interval)
    }, [paymentId])

    if (status === "pending") {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">⏳ Confirmando sua doação…</h1>
                <p className="mt-2 text-gray-600">Aguarde enquanto registramos sua contribuição.</p>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-green-600">🎉 Obrigado pela sua doação!</h1>
                <p className="mt-2 text-gray-700 mb-6">Sua contribuição faz a diferença ❤️</p>
                <motion.button
                    onClick={() => router.push("/")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-6 py-3 rounded-full shadow"
                >
                    Voltar ao início
                </motion.button>
            </div>
        )
    }

    return (
        <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-500">❌ Ocorreu um erro</h1>
            <p className="mt-2 text-gray-600 mb-6">Não conseguimos confirmar sua doação.</p>
            <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 text-white px-6 py-3 rounded-full shadow"
            >
                Tentar novamente
            </motion.button>
        </div>
    )
}

export default function SucessoPage() {
    return (
        <Suspense fallback={<p className="text-center py-12">Carregando…</p>}>
            <SuccessContent />
        </Suspense>
    )
}
