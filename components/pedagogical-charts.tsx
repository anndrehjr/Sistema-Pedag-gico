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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts"
import { Turma, getDistribuicaoPedagogica, getMediaPorMateria } from "@/lib/school-data"

const COLORS = {
  critical: "#ef4444",
  basic: "#f59e0b",
  adequate: "#3b82f6",
  advanced: "#22c55e",
}

interface PedagogicalChartsProps {
  turma: Turma
}

export function PedagogicalCharts({ turma }: PedagogicalChartsProps) {
  const distribuicao = getDistribuicaoPedagogica(turma.alunos)
  const mediasPorMateria = getMediaPorMateria(turma)

  const pieColors = [COLORS.critical, COLORS.basic, COLORS.adequate, COLORS.advanced]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribuição Pedagógica - Barras */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Distribuição Pedagógica
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribuicao} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {distribuicao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Distribuição Pedagógica - Pizza */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Proporção de Desempenho
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribuicao}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {distribuicao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Média por Matéria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card rounded-2xl p-6 border border-border lg:col-span-2"
      >
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Média por Disciplina
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mediasPorMateria} margin={{ bottom: 80 }}>
              <XAxis
                dataKey="materia"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 11 }}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string, props: { payload?: { materiaCompleta: string } }) => [
                  value,
                  props.payload?.materiaCompleta || name,
                ]}
              />
              <Bar dataKey="media" radius={[8, 8, 0, 0]}>
                {mediasPorMateria.map((entry, index) => (
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

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card rounded-2xl p-6 border border-border lg:col-span-2"
      >
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Análise Comparativa por Disciplina
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={mediasPorMateria.slice(0, 8)} cx="50%" cy="50%" outerRadius="80%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="materia" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Radar
                name="Média"
                dataKey="media"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
