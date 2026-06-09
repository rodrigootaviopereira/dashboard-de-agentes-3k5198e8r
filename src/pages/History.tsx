import { useState, useMemo } from 'react'
import { MOCK_HISTORY, Execution } from '@/data/mock-history'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  Filter,
  RotateCcw,
  Activity,
  CheckCircle2,
  Clock,
  CalendarDays,
} from 'lucide-react'
import { ExecutionHistoryModal } from '@/components/ExecutionHistoryModal'

export default function History() {
  const [agentFilter, setAgentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null)

  const uniqueAgents = useMemo(() => Array.from(new Set(MOCK_HISTORY.map((e) => e.agent_id))), [])

  const filteredData = useMemo(() => {
    return MOCK_HISTORY.filter((e) => {
      const matchAgent = agentFilter === 'all' || e.agent_id === agentFilter
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(e.status)
      let matchDate = true
      if (dateFilter !== 'all') {
        const date = new Date(e.timestamp)
        const now = new Date()
        const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
        if (dateFilter === '24h') matchDate = diffHours <= 24
        else if (dateFilter === '7d') matchDate = diffHours <= 24 * 7
        else if (dateFilter === '30d') matchDate = diffHours <= 24 * 30
      }
      return matchAgent && matchStatus && matchDate
    })
  }, [agentFilter, statusFilter, dateFilter])

  const stats = useMemo(() => {
    const total = MOCK_HISTORY.length
    const successes = MOCK_HISTORY.filter((e) => e.status === 'Sucesso').length
    const avgDuration = MOCK_HISTORY.reduce((acc, curr) => acc + curr.duration_ms, 0) / (total || 1)
    return {
      total,
      successRate: total > 0 ? Math.round((successes / total) * 100) : 0,
      avgDuration: (avgDuration / 1000).toFixed(1),
    }
  }, [])

  const hasFilters = agentFilter !== 'all' || statusFilter.length > 0 || dateFilter !== 'all'
  const resetFilters = () => {
    setAgentFilter('all')
    setStatusFilter([])
    setDateFilter('all')
  }

  const exportData = (format: 'csv' | 'json') => {
    let content = ''
    let type = ''

    if (format === 'json') {
      content = JSON.stringify(filteredData, null, 2)
      type = 'application/json'
    } else {
      const headers = ['ID', 'Agent', 'Status', 'Duration (ms)', 'Timestamp']
      const rows = filteredData.map((e) =>
        [e.id, e.agent_id, e.status, e.duration_ms, e.timestamp].join(','),
      )
      content = [headers.join(','), ...rows].join('\n')
      type = 'text/csv'
    }

    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `executions.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Histórico & Logs
        </h1>
        <p className="text-muted-foreground">
          Monitore as execuções dos seus agentes e analise o desempenho ao longo do tempo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Execuções</h3>
              <Activity className="w-5 h-5 text-[oklch(48%_0.15_242)]" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Taxa de Sucesso</h3>
              <CheckCircle2 className="w-5 h-5 text-[oklch(65%_0.13_142)]" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.successRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Duração Média</h3>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.avgDuration}s</p>
          </CardContent>
        </Card>
        <Card className="bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Última Execução</h3>
              <CalendarDays className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xl font-bold text-foreground truncate mt-2">
              {MOCK_HISTORY.length > 0
                ? new Date(MOCK_HISTORY[0].timestamp).toLocaleTimeString()
                : '--'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card p-4 rounded-lg border border-border/50 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium mr-2">Filtros:</span>
          </div>

          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Selecione um Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Agentes</SelectItem>
              {uniqueAgents.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 text-xs justify-between min-w-[120px]">
                {statusFilter.length > 0 ? `${statusFilter.length} Status` : 'Status: Todos'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {['Sucesso', 'Erro'].map((s) => (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={statusFilter.includes(s)}
                  onCheckedChange={(c) =>
                    setStatusFilter((prev) => (c ? [...prev, s] : prev.filter((x) => x !== s)))
                  }
                >
                  {s}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue placeholder="Data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Datas</SelectItem>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Último mês</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs h-9 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Resetar
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end mt-4 lg:mt-0 border-t lg:border-none pt-4 lg:pt-0 border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('csv')}
            className="text-xs h-9"
          >
            <Download className="w-3.5 h-3.5 mr-2" /> CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('json')}
            className="text-xs h-9"
          >
            <Download className="w-3.5 h-3.5 mr-2" /> JSON
          </Button>
        </div>
      </div>

      <div className="border border-border/50 rounded-lg bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] shadow-sm overflow-hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px] font-semibold">Agente</TableHead>
                <TableHead className="min-w-[300px] font-semibold">Instrução</TableHead>
                <TableHead className="w-[120px] font-semibold text-center">Status</TableHead>
                <TableHead className="w-[160px] font-semibold">Data/Hora</TableHead>
                <TableHead className="w-[120px] font-semibold text-right">Duração</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Nenhuma execução encontrada para os filtros atuais.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((exec) => (
                  <TableRow
                    key={exec.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedExecution(exec)}
                  >
                    <TableCell className="font-mono text-xs text-foreground/80">
                      {exec.agent_id}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm" title={exec.instruction}>
                      {exec.instruction}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${exec.status === 'Sucesso' ? 'bg-[oklch(65%_0.13_142)]' : 'bg-[oklch(65%_0.13_9)]'}`}
                        />
                        <span className="text-xs font-medium">{exec.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(exec.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono text-muted-foreground">
                      {(exec.duration_ms / 1000).toFixed(1)}s
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <ExecutionHistoryModal
        execution={selectedExecution}
        onClose={() => setSelectedExecution(null)}
      />
    </div>
  )
}
