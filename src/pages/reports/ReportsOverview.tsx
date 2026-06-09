import { Card, CardContent } from '@/components/ui/card'
import { useReports } from '@/hooks/use-reports'

export function ReportsOverview() {
  const { stats } = useReports()

  const cards = [
    {
      title: 'Total Execuções',
      value: stats.total,
      emoji: '📈',
      description: 'No período selecionado',
    },
    {
      title: 'Taxa de Sucesso',
      value: `${stats.successRate.toFixed(1)}%`,
      emoji: '🎯',
      description: 'Execuções com status SUCCESS',
    },
    {
      title: 'Tempo Médio',
      value: `${stats.avgTime.toFixed(1)}s`,
      emoji: '⏱️',
      description: 'Duração média por execução',
    },
    {
      title: 'Squads Ativos',
      value: stats.squadsCount,
      emoji: '👥',
      description: 'Equipes utilizando agentes',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="rounded-lg hover:shadow-sm transition-shadow border-border/60 overflow-hidden"
        >
          <CardContent className="p-5 flex items-center justify-between relative">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <div className="text-2xl font-bold text-foreground tracking-tight">{card.value}</div>
              <p className="text-xs text-muted-foreground/80">{card.description}</p>
            </div>
            <div className="text-3xl opacity-80">{card.emoji}</div>

            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
