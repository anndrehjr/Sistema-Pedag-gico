"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { escolaData } from "@/lib/school-data"
import { TurmaCard } from "@/components/turma-card"

export default function TurmasPage() {
  const turmasFundamental = escolaData.turmas.filter((t) => t.nivel === "Ensino Fundamental")
  const turmasMedio = escolaData.turmas.filter((t) => t.nivel === "Ensino Médio")

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Turmas</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral de todas as turmas - {escolaData.bimestre} de 2026
        </p>
      </motion.div>

      {/* Ensino Fundamental */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">Ensino Fundamental</h2>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {turmasFundamental.length} turmas
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {turmasFundamental.map((turma, index) => (
            <TurmaCard key={turma.id} turma={turma} index={index} />
          ))}
        </div>
      </section>

      {/* Ensino Médio */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">Ensino Médio</h2>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {turmasMedio.length} turmas
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmasMedio.map((turma, index) => (
            <TurmaCard key={turma.id} turma={turma} index={index + turmasFundamental.length} />
          ))}
        </div>
      </section>
    </div>
  )
}
