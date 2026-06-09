import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FilterX, Download, FileJson, FileText, File } from 'lucide-react'
import { useReports } from '@/hooks/use-reports'
import { AVAILABLE_AGENTS } from '@/lib/reports-data'
import { exportToCSV, exportToJSON } from '@/lib/export-utils'
import { useToast } from '@/components/ui/use-toast'

const SQUADS = [
  'Todos',
  'Sindico-Squad',
  'Juridico-Squad',
  'Sales-Squad',
  'AIOX-Core',
  'Agents-Guru',
  'Claude-Code-Mastery',
]
const PERIODS = ['Últimas 24h', 'Últimos 7 dias', 'Este mês', 'Todos']

export function ReportsFilters() {
  const { filters, setFilters, resetFilters, hasFilters, stats, rankingTable } = useReports()
  const { toast } = useToast()

  const handleExportCsv = () => {
    exportToCSV(rankingTable, 'relatorio_agentes')
    toast({ title: 'Exportação Concluída', description: 'Arquivo CSV baixado com sucesso.' })
  }

  const handleExportJson = () => {
    exportToJSON({ resumo: stats, ranking: rankingTable }, 'relatorio_agentes')
    toast({ title: 'Exportação Concluída', description: 'Arquivo JSON baixado com sucesso.' })
  }

  const handleExportPdf = () => {
    toast({
      title: 'Recurso em Desenvolvimento',
      description: 'Exportação para PDF estará disponível em breve.',
    })
  }

  return (
    <div className="sticky top-[112px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 py-4 border-b border-border/40 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between shadow-sm -mx-4 px-4 md:-mx-8 md:px-8">
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <Select value={filters.squad} onValueChange={(v) => setFilters({ squad: v })}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Squad" />
          </SelectTrigger>
          <SelectContent>
            {SQUADS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.period} onValueChange={(v) => setFilters({ period: v })}>
          <SelectTrigger className="w-[150px] h-9 text-sm">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.agent} onValueChange={(v) => setFilters({ agent: v })}>
          <SelectTrigger className="w-[180px] h-9 text-sm">
            <SelectValue placeholder="Agente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Agentes</SelectItem>
            {AVAILABLE_AGENTS.map((a) => (
              <SelectItem key={a} value={a} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 whitespace-nowrap">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
            <FileText className="w-4 h-4 mr-2 text-muted-foreground" /> CSV (Tabela)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportJson} className="cursor-pointer">
            <FileJson className="w-4 h-4 mr-2 text-muted-foreground" /> JSON (Completo)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer">
            <File className="w-4 h-4 mr-2 text-muted-foreground" /> PDF (Visual)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
