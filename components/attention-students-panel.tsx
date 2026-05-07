"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { getAlunosEmAtencao, getCorClassificacao } from "@/lib/school-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AttentionStudentsPanelProps {
  limit?: number
  showViewAll?: boolean
}

export function AttentionStudentsPanel({ limit = 5, showViewAll = true }: AttentionStudentsPanelProps) {
  const alunosEmAtencao = getAlunosEmAtencao()
  const displayAlunos = limit ? alunosEmAtencao.slice(0, limit) : alunosEmAtencao

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Alunos que Precisam de Atenção</h3>
            <p className="text-sm text-muted-foreground">
              {alunosEmAtencao.length} alunos identificados
            </p>
          </div>
        </div>
        {showViewAll && (
          <Link href="/atencao">
            <Button variant="ghost" size="sm" className="gap-2">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="divide-y divide-border">
        {displayAlunos.map((aluno, index) => (
          <motion.div
            key={`${aluno.nome}-${aluno.turma}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <h4 className="font-medium text-card-foreground truncate">{aluno.nome}</h4>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    href={`/turmas/${aluno.turmaId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {aluno.turma}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Média: <span className="font-medium text-red-600">{aluno.media}</span>
                  </span>
                </div>
                {aluno.materiasAbaixo.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {aluno.materiasAbaixo.slice(0, 3).map((materia) => (
                      <span
                        key={materia}
                        className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
                      >
                        {materia.length > 15 ? materia.substring(0, 15) + "..." : materia}
                      </span>
                    ))}
                    {aluno.materiasAbaixo.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{aluno.materiasAbaixo.length - 3} mais
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap",
                  getCorClassificacao(aluno.classificacao)
                )}
              >
                {aluno.classificacao}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {displayAlunos.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          Nenhum aluno em situação crítica identificado.
        </div>
      )}
    </motion.div>
  )
}
