"use client"

import { use, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Users, TrendingUp, AlertTriangle, BarChart3, Table as TableIcon } from "lucide-react"
import { escolaData, classificarNota, getCorClassificacao } from "@/lib/school-data"
import { GradesTable } from "@/components/grades-table"
import { PedagogicalCharts } from "@/components/pedagogical-charts"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TurmaPageProps {
  params: Promise<{ id: string }>
}

export default function TurmaPage({ params }: TurmaPageProps) {
  const { id } = use(params)
  const [view, setView] = useState<"table" | "charts">("table")
  
  const turma = escolaData.turmas.find((t) => t.id === id)

  if (!turma) {
    notFound()
  }

  const mediaGeral = Number(
    (turma.alunos.reduce((acc, a) => acc + a.media, 0) / turma.alunos.length).toFixed(1)
  )
  const classificacao = classificarNota(mediaGeral)
  const alunosCriticos = turma.alunos.filter((a) => a.media < 5).length
  const taxaCriticos = ((alunosCriticos / turma.alunos.length) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/turmas" className="inline-flex">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para Turmas
        </Button>
      </Link>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {turma.nivel}
              </span>
              <span
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full border",
                  getCorClassificacao(classificacao)
                )}
              >
                {classificacao}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-card-foreground">{turma.nome}</h1>
            <p className="text-muted-foreground mt-1">{turma.bimestre} - {escolaData.dataConselho}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted rounded-xl p-4 text-center">
              <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-2xl font-bold text-card-foreground">{turma.totalAlunos}</p>
              <p className="text-xs text-muted-foreground">Alunos</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-2xl font-bold text-card-foreground">{mediaGeral}</p>
              <p className="text-xs text-muted-foreground">Média Geral</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600">{alunosCriticos}</p>
              <p className="text-xs text-muted-foreground">Em Atenção</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{taxaCriticos}%</p>
              <p className="text-xs text-muted-foreground">Taxa Crítica</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
          className="gap-2"
        >
          <TableIcon className="w-4 h-4" /> Tabela de Notas
        </Button>
        <Button
          variant={view === "charts" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("charts")}
          className="gap-2"
        >
          <BarChart3 className="w-4 h-4" /> Análises Gráficas
        </Button>
      </div>

      {/* Content */}
      {view === "table" ? (
        <GradesTable alunos={turma.alunos} materias={turma.materias} />
      ) : (
        <PedagogicalCharts turma={turma} />
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h3 className="font-semibold text-card-foreground mb-4">Legenda de Classificação Pedagógica</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Abaixo do Básico (1-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-muted-foreground">Básico (5-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Adequado (7-8)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Avançado (9-10)</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
