"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { TransparencySection } from "@/components/transparency-section"

export default function TransparencyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-all hover:gap-2 mb-8 md:mb-12"
          >
            <ArrowLeft size={16} /> Voltar para página inicial
          </Link>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Para onde vai o dinheiro?
        </motion.h1>

        <motion.div
          className="prose prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-lg md:text-xl leading-relaxed">
            Todas as doações arrecadadas são destinadas integralmente a campanhas solidárias que apoiam animais de rua.
            Utilizamos os recursos para:
          </p>

          <motion.ul
            className="my-6 md:my-8 space-y-3 md:space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.6 }}
          >
            {[
              "Alimentação e cuidados veterinários.",
              "Programas de castração e controle populacional.",
              "Campanhas de adoção responsável.",
              "Educação e conscientização sobre bem-estar animal.",
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 p-3 md:p-4 rounded-lg bg-primary/5 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 5, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {index + 1}
                </span>
                <span className="text-base md:text-lg">{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            className="text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Abaixo você encontrará os comprovantes de todas as doações realizadas às organizações parceiras.
          </motion.p>
        </motion.div>

        <motion.h2
          className="text-xl md:text-2xl font-semibold mt-12 md:mt-16 mb-6 md:mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Comprovantes de doações
        </motion.h2>

        <TransparencySection />
      </div>
    </main>
  )
}
