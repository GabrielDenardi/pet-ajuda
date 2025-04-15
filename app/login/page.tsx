"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LockKeyhole } from "lucide-react"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/admin")
    } else {
      setError("Senha incorreta.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-zinc-900 to-background flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl w-full max-w-sm p-8 space-y-6 border border-white/10"
      >
        <div className="text-center">
          <motion.div
            className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <LockKeyhole className="text-primary w-6 h-6" />
          </motion.div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Login Admin</h2>
          <p className="text-sm text-muted-foreground">Área restrita de gerenciamento</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <motion.p
              className="text-red-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-primary text-white font-medium py-3 rounded-full transition"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  )
}
