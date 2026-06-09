import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useReports } from '@/hooks/use-reports'

export function TopAgentsChart() {
  const { topAgents } = useReports()

  const chartConfig = {
    value: {
      label: 'Execuções',
      color: 'oklch(48% 0.15 242)',
    },
  }

  return (
    <Card className="flex flex-col border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Top 5 Agentes</CardTitle>
        <CardDescription>Os agentes mais utilizados no período</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {topAgents.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topAgents}
                layout="vertical"
                margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <ChartTooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  fill="oklch(48% 0.15 242)"
                  radius={[0, 4, 4, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Nenhum dado encontrado
          </div>
        )}
      </CardContent>
    </Card>
  )
}
