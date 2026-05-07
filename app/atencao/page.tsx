"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AlertTriangle, Search, Filter, ArrowUpDown, ExternalLink } from "lucide-react"
import { getAlunosEmAtencao, getCorClassificacao, escolaData } from "@/lib/school-data"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortKey = "nome" | "media" | "turma" | "materiasAbaixo"
type SortOrder = "asc" | "desc"

export default function AtencaoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTurma, setSelectedTurma] = useState<string>("todas")
  const [sortKey, setSortKey] = useState<SortKey>("media")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const alunosEmAtencao = getAlunosEmAtencao()

  // Filter
  let filteredAlunos = alunosEmAtencao.filter((aluno) => {
    const matchesSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTurma = selectedTurma === "todas" || aluno.turmaId === selectedTurma
    return matchesSearch && matchesTurma
  })

  // Sort
  filteredAlunos = [...filteredAlunos].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case "nome":
        comparison = a.nome.localeCompare(b.nome)
        break
      case "media":
        comparison = a.media - b.media
        break
      case "turma":
        comparison = a.turma.localeCompare(b.turma)
        break
      case "materiasAbaixo":
        comparison = a.materiasAbaixo.length - b.materiasAbaixo.length
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Alunos em Atenção</h1>
          </div>
          <p className="text-muted-foreground">
            {alunosEmAtencao.length} alunos identificados que precisam de acompanhamento especial
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card rounded-2xl p-4 border border-border flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedTurma} onValueChange={setSelectedTurma}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as turmas</SelectItem>
              {escolaData.turmas.map((turma) => (
                <SelectItem key={turma.id} value={turma.id}>
                  {turma.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Exibindo {filteredAlunos.length} de {alunosEmAtencao.length} alunos
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card rounded-2xl border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-4 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort("nome")}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    Aluno
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort("turma")}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    Turma
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-center py-4 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort("media")}
                    className="flex items-center gap-2 hover:text-primary transition-colors mx-auto"
                  >
                    Média
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-center py-4 px-4 font-semibold">Classificação</th>
                <th className="text-left py-4 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort("materiasAbaixo")}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    Matérias Críticas
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-center py-4 px-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlunos.map((aluno, index) => (
                <motion.tr
                  key={`${aluno.nome}-${aluno.turma}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="font-medium">{aluno.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/turmas/${aluno.turmaId}`}
                      className="text-primary hover:underline"
                    >
                      {aluno.turma}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={cn(
                        "font-bold px-3 py-1 rounded-lg",
                        aluno.media < 5 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {aluno.media}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap",
                        getCorClassificacao(aluno.classificacao)
                      )}
                    >
                      {aluno.classificacao}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {aluno.materiasAbaixo.slice(0, 4).map((materia) => (
                        <span
                          key={materia}
                          className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
                          title={materia}
                        >
                          {materia.length > 12 ? materia.substring(0, 12) + "..." : materia}
                        </span>
                      ))}
                      {aluno.materiasAbaixo.length > 4 && (
                        <span className="text-xs text-muted-foreground" title={aluno.materiasAbaixo.slice(4).join(", ")}>
                          +{aluno.materiasAbaixo.length - 4}
                        </span>
                      )}
                      {aluno.materiasAbaixo.length === 0 && (
                        <span className="text-xs text-muted-foreground">Nenhuma abaixo de 5</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link href={`/turmas/${aluno.turmaId}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Ver turma <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAlunos.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Nenhum aluno encontrado com os filtros aplicados.
          </div>
        )}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="font-semibold text-card-foreground mb-2">Turmas com Mais Alunos em Atenção</h3>
          <div className="space-y-2">
            {escolaData.turmas
              .map((t) => ({
                nome: t.nome,
                id: t.id,
                count: alunosEmAtencao.filter((a) => a.turmaId === t.id).length,
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((turma) => (
                <div key={turma.id} className="flex items-center justify-between">
                  <Link href={`/turmas/${turma.id}`} className="text-sm hover:text-primary">
                    {turma.nome}
                  </Link>
                  <span className="text-sm font-medium text-red-600">{turma.count} alunos</span>
                </div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="font-semibold text-card-foreground mb-2">Matérias Mais Críticas</h3>
          <div className="space-y-2">
            {(() => {
              const materiaCount: Record<string, number> = {}
              alunosEmAtencao.forEach((a) => {
                a.materiasAbaixo.forEach((m) => {
                  materiaCount[m] = (materiaCount[m] || 0) + 1
                })
              })
              return Object.entries(materiaCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([materia, count]) => (
                  <div key={materia} className="flex items-center justify-between">
                    <span className="text-sm truncate max-w-[150px]" title={materia}>
                      {materia}
                    </span>
                    <span className="text-sm font-medium text-red-600">{count}x</span>
                  </div>
                ))
            })()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="font-semibold text-card-foreground mb-2">Distribuição por Classificação</h3>
          <div className="space-y-2">
            {[
              { label: "Abaixo do Básico", color: "bg-red-500" },
              { label: "Básico", color: "bg-amber-500" },
            ].map((item) => {
              const count = alunosEmAtencao.filter((a) => a.classificacao === item.label).length
              const percent = ((count / alunosEmAtencao.length) * 100).toFixed(0)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                    <span className="font-medium">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
