"use client"

import Link from "next/link"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { ExternalLink, Menu } from "lucide-react"
import { DonationCard } from "@/components/donation-card"
import { DonationButton } from "@/components/donation-button"
import { MobileMenu } from "@/components/mobile-menu"

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [arrecadado, setArrecadado] = useState(0)
  const [meta, setMeta] = useState(0)
  const [hasReceipts, setHasReceipts] = useState(false)

  useEffect(() => {
    async function fetchProgress() {
      const res = await fetch("/api/donation-progress")
      const data: { arrecadado: number; meta: number } = await res.json()

      const porcentagem =
          data.meta > 0 ? (data.arrecadado / data.meta) * 100 : 0

      setProgress(porcentagem)
      setMeta(data.meta)
      setArrecadado(data.arrecadado)
    }
    fetchProgress()
    const interval = setInterval(fetchProgress, 10000)
    return () => clearInterval(interval)
  }, [])  

  // Animate progress bar on load
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
  
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />
        <div className="absolute top-0 left-0 right-0 h-[300px] md:h-[500px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-[100px] transform translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-between items-center p-4 md:p-6 backdrop-blur-sm bg-background/30 sticky top-0 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
        >
          PetAjuda
        </motion.div>

        {/* Desktop navigation */}
        <div className="hidden md:block">
          <Link
            href="/transparencia"
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-all hover:gap-2"
          >
            Para onde vai o dinheiro? <ExternalLink size={16} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-background/50 backdrop-blur-md"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>

      {/* Hero section */}
      <section className="w-full max-w-5xl mx-auto px-4 pt-8 md:pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center space-y-4 mb-8 md:mb-12"
        >
          <motion.h1
            className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Ajude os animais de rua
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Sua doação pode transformar a vida de um animal abandonado
          </motion.p>
        </motion.div>

        {/* Donation progress and image */}
        <motion.div
          className="w-full relative mb-12 md:mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="relative w-full aspect-square md:aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image
              src="/cat.jpg?height=800&width=1200"
              alt="Animal de rua precisando de ajuda"
              fill
              className="object-cover"
              style={{
                filter: `blur(${20 - 20 * (progress / 100)}px)`, // Blur decreases as progress increases
                transition: "filter 1s ease-in-out",
                transform: `scale(1.1) translateY(${scrollY * 0.1}px)`, // Parallax effect
              }}
            />

            
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="flex justify-between text-white mb-2">
              <span className="font-medium text-base md:text-lg">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(arrecadado)} arrecadados
              </span>
              <span>
                Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(meta)}
              </span>
            </div>
            <Progress value={progress} className="h-2 md:h-3 bg-white/20" />
          </motion.div>
          </motion.div>
        </motion.div>

        {/* Donation button */}
        <div className="flex justify-center">
          <DonationButton />
        </div>
      </section>

      

      {/* Footer */}
      <motion.footer
        className="w-full py-6 md:py-8 px-4 text-center text-xs md:text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>© 2025 PetAjuda. Todos os direitos reservados.</p>
      </motion.footer>
    </main>
  )
}
