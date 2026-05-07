"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users, TrendingUp, ArrowRight } from "lucide-react"
import { Turma, classificarNota, getCorClassificacao } from "@/lib/school-data"
import { cn } from "@/lib/utils"

interface TurmaCardProps {
  turma: Turma
  index: number
}

export function TurmaCard({ turma, index }: TurmaCardProps) {
  const mediaGeral = Number(
    (turma.alunos.reduce((acc, a) => acc + a.media, 0) / turma.alunos.length).toFixed(1)
  )
  const classificacao = classificarNota(mediaGeral)
  const alunosCriticos = turma.alunos.filter((a) => a.media < 5).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/turmas/${turma.id}`}>
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {turma.nivel}
              </span>
              <h3 className="text-xl font-bold text-card-foreground mt-2">{turma.nome}</h3>
              <p className="text-sm text-muted-foreground">{turma.bimestre}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {turma.totalAlunos} alunos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Média: {mediaGeral}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span
              className={cn(
                "text-xs font-medium px-3 py-1 rounded-full border",
                getCorClassificacao(classificacao)
              )}
            >
              {classificacao}
            </span>
            {alunosCriticos > 0 && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                {alunosCriticos} em atenção
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
