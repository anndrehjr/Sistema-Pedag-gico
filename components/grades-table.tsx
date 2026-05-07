"use client"

import { motion } from "framer-motion"
import { Aluno, getCorClassificacao } from "@/lib/school-data"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface GradesTableProps {
  alunos: Aluno[]
  materias: string[]
}

export function GradesTable({ alunos, materias }: GradesTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-foreground min-w-[200px] sticky left-0 bg-muted/50 z-10">
                Aluno
              </TableHead>
              {materias.map((materia) => (
                <TableHead
                  key={materia}
                  className="font-semibold text-foreground text-center min-w-[80px]"
                  title={materia}
                >
                  {materia.length > 12 ? materia.substring(0, 12) + "..." : materia}
                </TableHead>
              ))}
              <TableHead className="font-semibold text-foreground text-center min-w-[80px]">
                Média
              </TableHead>
              <TableHead className="font-semibold text-foreground text-center min-w-[130px]">
                Classificação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map((aluno, index) => (
              <motion.tr
                key={aluno.nome}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className={cn(
                  "hover:bg-muted/30 transition-colors",
                  aluno.atencao && "bg-red-50/50"
                )}
              >
                <TableCell className="font-medium sticky left-0 bg-card z-10">
                  <div className="flex items-center gap-2">
                    {aluno.atencao && (
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    )}
                    <span className="truncate max-w-[180px]" title={aluno.nome}>
                      {aluno.nome}
                    </span>
                  </div>
                </TableCell>
                {materias.map((materia) => {
                  const nota = aluno.notas[materia]
                  const isNumeric = typeof nota === "number"
                  const isBelowAverage = isNumeric && nota < 5
                  return (
                    <TableCell
                      key={materia}
                      className={cn(
                        "text-center font-medium",
                        isBelowAverage && "text-red-600 bg-red-50"
                      )}
                    >
                      {nota === "TR" ? (
                        <span className="text-muted-foreground text-xs">TR</span>
                      ) : (
                        nota
                      )}
                    </TableCell>
                  )
                })}
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "font-bold px-2 py-1 rounded",
                      aluno.media < 5 && "text-red-600 bg-red-50"
                    )}
                  >
                    {aluno.media}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap",
                      getCorClassificacao(aluno.classificacao)
                    )}
                  >
                    {aluno.classificacao}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}
