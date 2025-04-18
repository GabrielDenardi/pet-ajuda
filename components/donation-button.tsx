"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const suggestedValues = [10, 20, 50, 100]

export function DonationButton() {
    const router = useRouter()
    const [selected, setSelected] = useState<number | "custom">(10)
    const [customAmount, setCustomAmount] = useState("")
    const [isClicked, setIsClicked] = useState(false)
    const [error, setError] = useState("")
    const [hovered, setHovered] = useState(false)

    const isCustom = selected === "custom"
    const value = isCustom ? Number(customAmount) : selected
    const isValid = !isNaN(value) && value >= 1

    const handleClick = async () => {
        if (!isValid) {
            setError("Informe um valor válido (mínimo R$1)")
            return
        }

        setIsClicked(true)
        setError("")

        try {
            const res = await fetch("/api/create-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value })
            })
            const data = await res.json()

            if (data?.url) {
                window.open(data.url, "_blank")
                router.push("/sucesso")
            } else {
                throw new Error("URL de checkout não retornada")
            }
        } catch (err) {
            console.error(err)
            setError("Erro ao criar pagamento.")
            setIsClicked(false)
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-2">
                {suggestedValues.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => setSelected(amount)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
              ${selected === amount
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-gray-300 text-gray-700 hover:border-primary hover:text-primary"}`}
                    >
                        R$ {amount}
                    </button>
                ))}

                <button
                    onClick={() => setSelected("custom")}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
            ${isCustom
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-gray-300 text-gray-700 hover:border-primary hover:text-primary"}`}
                >
                    Outro valor
                </button>
            </div>

            <AnimatePresence>
                {isCustom && (
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="relative w-full mt-2">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                R$
              </span>
                            <input
                                type="number"
                                min={1}
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full bg-white text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Digite o valor"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <motion.button
                onClick={handleClick}
                disabled={isClicked}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative overflow-hidden group flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-primary via-emerald-500 to-primary text-white font-medium text-sm md:text-base shadow-lg shadow-primary/20"
                style={{
                    backgroundPosition: hovered ? "100%" : "0%",
                    transition: "background-position 0.5s ease-in-out",
                }}
            >
                <AnimatePresence mode="wait">
                    {isClicked ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Heart className="w-4 h-4 md:w-5 md:h-5" />
                            <span>Doar agora</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
