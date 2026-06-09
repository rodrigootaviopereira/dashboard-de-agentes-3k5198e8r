import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useReports } from '@/hooks/use-reports'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ReportsTable() {
  const { rankingTable } = useReports()
  const isMobile = useIsMobile()
  const [showAll, setShowAll] = useState(false)

  const getRateColor = (rate: number) => {
    if (rate >= 90) return 'text-[oklch(65%_0.13_142)] font-semibold'
    if (rate >= 70) return 'text-[oklch(75%_0.12_92)] font-semibold'
    return 'text-[oklch(65%_0.13_9)] font-semibold'
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return (
      <span className="text-muted-foreground w-6 inline-block text-center font-medium">
        {index + 1}
      </span>
    )
  }

  const displayData = isMobile && !showAll ? rankingTable.slice(0, 5) : rankingTable

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Ranking de Agentes</CardTitle>
        <CardDescription>
          Desempenho detalhado de cada agente com base nos filtros selecionados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rankingTable.length > 0 ? (
          <>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">Pos</TableHead>
                    <TableHead>Agente</TableHead>
                    <TableHead className="text-right">Execuções</TableHead>
                    <TableHead className="text-right">Taxa OK</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Tempo Médio</TableHead>
                    <TableHead className="text-right hidden md:table-cell">
                      Última Execução
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((row, index) => (
                    <TableRow
                      key={row.agentId}
                      className="even:bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="text-center text-lg">{getRankIcon(index)}</TableCell>
                      <TableCell
                        className="font-medium"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {row.agentId}
                      </TableCell>
                      <TableCell className="text-right">{row.executions}</TableCell>
                      <TableCell className={`text-right ${getRateColor(row.rate)}`}>
                        {row.rate.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell text-muted-foreground">
                        {row.avgTime.toFixed(1)}s
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell text-muted-foreground text-sm">
                        {new Date(row.lastExecution).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {isMobile && rankingTable.length > 5 && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Mostrar Menos' : `Ver Todos (${rankingTable.length})`}
              </Button>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground border border-border/50 rounded-md bg-muted/10">
            Nenhum dado encontrado para os filtros selecionados
          </div>
        )}
      </CardContent>
    </Card>
  )
}
