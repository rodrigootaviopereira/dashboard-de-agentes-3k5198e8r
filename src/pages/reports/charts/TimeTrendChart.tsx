import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useReports } from '@/hooks/use-reports'

export function TimeTrendChart() {
  const { timeTrend } = useReports()

  const chartConfig = {
    value: { label: 'Tempo Médio (s)', color: 'oklch(48% 0.15 242)' },
  }

  return (
    <Card className="flex flex-col border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Tendência de Tempo de Execução</CardTitle>
        <CardDescription>Duração média diária nos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {timeTrend.length > 0 && timeTrend.some((d) => d.value > 0) ? (
          <ChartContainer config={chartConfig} className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(48% 0.15 242)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(48% 0.15 242)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
                <ChartTooltip
                  cursor={{
                    stroke: 'var(--muted-foreground)',
                    strokeWidth: 1,
                    strokeDasharray: '3 3',
                  }}
                  content={<ChartTooltipContent />}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(48% 0.15 242)"
                  strokeWidth={2.5}
                  fill="url(#colorTrend)"
                  activeDot={{ r: 6, fill: 'oklch(48% 0.15 242)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Nenhum dado encontrado no período
          </div>
        )}
      </CardContent>
    </Card>
  )
}
