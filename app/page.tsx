"use client"

import { motion } from "framer-motion"
import { Users, GraduationCap, TrendingUp, AlertTriangle, Award, ChevronDown } from "lucide-react"
import { escolaData, getEstatisticasGerais } from "@/lib/school-data"
import { StatCard } from "@/components/stat-card"
import { TurmaCard } from "@/components/turma-card"
import { AttentionStudentsPanel } from "@/components/attention-students-panel"

export default function DashboardPage() {
  const stats = getEstatisticasGerais()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Dashboard Pedagógico</h1>
        <p className="text-muted-foreground mt-1">
          Análise de desempenho escolar - {escolaData.bimestre} de 2026
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
          title="Média Geral"
          value={stats.mediaGeral}
          icon={TrendingUp}
          color={stats.mediaGeral >= 7 ? "success" : stats.mediaGeral >= 5 ? "warning" : "danger"}
        />
        <StatCard
          title="Alunos Críticos"
          value={stats.alunosCriticos}
          icon={AlertTriangle}
          color="danger"
        />
        <StatCard
          title="Melhor Turma"
          value={stats.melhorTurma.nome}
          subtitle={`Média: ${stats.melhorTurma.media}`}
          icon={Award}
          color="success"
        />
        <StatCard
          title="Turma em Atenção"
          value={stats.piorTurma.nome}
          subtitle={`Média: ${stats.piorTurma.media}`}
          icon={ChevronDown}
          color="warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Turmas Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Turmas</h2>
            <span className="text-sm text-muted-foreground">
              {escolaData.turmas.length} turmas ativas
            </span>
          </div>
          
          {/* Ensino Fundamental */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ensino Fundamental
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {escolaData.turmas
                .filter((t) => t.nivel === "Ensino Fundamental")
                .map((turma, index) => (
                  <TurmaCard key={turma.id} turma={turma} index={index} />
                ))}
            </div>
          </div>

          {/* Ensino Médio */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ensino Médio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {escolaData.turmas
                .filter((t) => t.nivel === "Ensino Médio")
                .map((turma, index) => (
                  <TurmaCard key={turma.id} turma={turma} index={index + 4} />
                ))}
            </div>
          </div>
        </div>

        {/* Alunos em Atenção */}
        <div className="lg:col-span-1">
          <AttentionStudentsPanel limit={8} showViewAll />
        </div>
      </div>
    </div>
  )
}
