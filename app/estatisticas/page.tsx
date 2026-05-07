"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { escolaData, getEstatisticasGerais, classificarNota } from "@/lib/school-data"
import { StatCard } from "@/components/stat-card"
import { Users, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react"

const COLORS = {
  critical: "#ef4444",
  basic: "#f59e0b",
  adequate: "#3b82f6",
  advanced: "#22c55e",
}

export default function EstatisticasPage() {
  const stats = getEstatisticasGerais()

  // Dados para gráficos
  const turmasComMedia = escolaData.turmas.map((t) => ({
    nome: t.nome,
    media: Number((t.alunos.reduce((acc, a) => acc + a.media, 0) / t.alunos.length).toFixed(1)),
    alunos: t.totalAlunos,
    criticos: t.alunos.filter((a) => a.media < 5).length,
  }))

  // Distribuição geral pedagógica
  const todosAlunos = escolaData.turmas.flatMap((t) => t.alunos)
  const distribuicaoGeral = [
    { name: "Abaixo do Básico", value: todosAlunos.filter((a) => a.media <= 4).length },
    { name: "Básico", value: todosAlunos.filter((a) => a.media > 4 && a.media <= 6).length },
    { name: "Adequado", value: todosAlunos.filter((a) => a.media > 6 && a.media <= 8).length },
    { name: "Avançado", value: todosAlunos.filter((a) => a.media > 8).length },
  ]

  const pieColors = [COLORS.critical, COLORS.basic, COLORS.adequate, COLORS.advanced]

  // Comparação entre níveis
  const comparacaoNiveis = [
    {
      nivel: "Ensino Fundamental",
      media: Number(
        (
          escolaData.turmas
            .filter((t) => t.nivel === "Ensino Fundamental")
            .flatMap((t) => t.alunos)
            .reduce((acc, a) => acc + a.media, 0) /
          escolaData.turmas
            .filter((t) => t.nivel === "Ensino Fundamental")
            .flatMap((t) => t.alunos).length
        ).toFixed(1)
      ),
    },
    {
      nivel: "Ensino Médio",
      media: Number(
        (
          escolaData.turmas
            .filter((t) => t.nivel === "Ensino Médio")
            .flatMap((t) => t.alunos)
            .reduce((acc, a) => acc + a.media, 0) /
          escolaData.turmas
            .filter((t) => t.nivel === "Ensino Médio")
            .flatMap((t) => t.alunos).length
        ).toFixed(1)
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Estatísticas Gerais</h1>
        <p className="text-muted-foreground mt-1">
          Análise completa do desempenho escolar - {escolaData.bimestre} de 2026
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Alunos"
          value={stats.totalAlunos}
          icon={Users}
          color="default"
        />
        <StatCard
          title="Turmas Ativas"
          value={stats.totalTurmas}
          icon={GraduationCap}
          color="default"
        />
        <StatCard
          title="Média Geral da Escola"
          value={stats.mediaGeral}
          icon={TrendingUp}
          color={stats.mediaGeral >= 7 ? "success" : stats.mediaGeral >= 5 ? "warning" : "danger"}
        />
        <StatCard
          title="Alunos em Situação Crítica"
          value={stats.alunosCriticos}
          subtitle={`${((stats.alunosCriticos / stats.totalAlunos) * 100).toFixed(1)}% do total`}
          icon={AlertTriangle}
          color="danger"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Média por Turma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Média por Turma
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turmasComMedia}>
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="media" radius={[8, 8, 0, 0]}>
                  {turmasComMedia.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.media < 5
                          ? COLORS.critical
                          : entry.media < 7
                            ? COLORS.basic
                            : entry.media < 9
                              ? COLORS.adequate
                              : COLORS.advanced
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribuição Pedagógica Geral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Distribuição Pedagógica da Escola
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoGeral}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {distribuicaoGeral.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value} alunos`, "Quantidade"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alunos Críticos por Turma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Alunos em Situação Crítica por Turma
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turmasComMedia} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="nome" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="criticos" fill={COLORS.critical} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Comparação entre Níveis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Comparação entre Níveis de Ensino
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparacaoNiveis}>
                <XAxis dataKey="nivel" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="media" radius={[8, 8, 0, 0]}>
                  {comparacaoNiveis.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS.adequate : COLORS.basic}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-card rounded-2xl p-6 border border-border overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Resumo por Turma
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">Turma</th>
              <th className="text-center py-3 px-4 font-semibold">Nível</th>
              <th className="text-center py-3 px-4 font-semibold">Alunos</th>
              <th className="text-center py-3 px-4 font-semibold">Média</th>
              <th className="text-center py-3 px-4 font-semibold">Classificação</th>
              <th className="text-center py-3 px-4 font-semibold">Em Atenção</th>
              <th className="text-center py-3 px-4 font-semibold">Taxa Crítica</th>
            </tr>
          </thead>
          <tbody>
            {turmasComMedia.map((turma, index) => {
              const turmaOriginal = escolaData.turmas[index]
              const classificacao = classificarNota(turma.media)
              return (
                <tr key={turma.nome} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium">{turma.nome}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">
                    {turmaOriginal.nivel}
                  </td>
                  <td className="py-3 px-4 text-center">{turma.alunos}</td>
                  <td className="py-3 px-4 text-center font-semibold">{turma.media}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        classificacao === "Abaixo do Básico"
                          ? "bg-red-100 text-red-700"
                          : classificacao === "Básico"
                            ? "bg-amber-100 text-amber-700"
                            : classificacao === "Adequado"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {classificacao}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-red-600 font-medium">
                    {turma.criticos}
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">
                    {((turma.criticos / turma.alunos) * 100).toFixed(1)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
