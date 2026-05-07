"use client"

import { Bell, Search, User } from "lucide-react"
import { escolaData, getAlunosEmAtencao } from "@/lib/school-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const alunosAtencao = getAlunosEmAtencao()

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar alunos, turmas..."
          className="pl-10 bg-background"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Info */}
        <div className="text-right mr-4 hidden md:block">
          <p className="text-sm font-medium text-foreground">{escolaData.nome}</p>
          <p className="text-xs text-muted-foreground">
            {escolaData.bimestre} - {escolaData.dataConselho}
          </p>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {alunosAtencao.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              {alunosAtencao.length}
            </span>
          )}
        </Button>

        {/* Profile */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        </Button>
      </div>
    </header>
  )
}
