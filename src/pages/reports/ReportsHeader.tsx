import { BarChart2 } from 'lucide-react'

export function ReportsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          <BarChart2 className="w-8 h-8 text-[oklch(48%_0.15_242)]" />
          Analytics & Relatórios
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Acompanhe o desempenho, descubra tendências e extraia insights do uso dos seus agentes.
        </p>
      </div>
    </div>
  )
}
