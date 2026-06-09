import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useReports } from '@/hooks/use-reports'

export function SquadSuccessChart() {
  const { squadSuccess } = useReports()

  const chartConfig = {
    value: { label: 'Execuções' },
  }

  return (
    <Card className="flex flex-col border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Performance por Squad</CardTitle>
        <CardDescription>Taxa de sucesso das execuções agrupadas por equipe</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {squadSuccess.length > 0 ? (
          <div className="relative h-[280px] w-full flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Pie
                    data={squadSuccess}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    cx="50%"
                    cy="50%"
                  >
                    {squadSuccess.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Legend placed correctly for better responsive behavior */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 pr-4 hidden sm:flex">
              {squadSuccess.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.fill }}
                  />
                  <span className="truncate max-w-[120px]" title={s.name}>
                    {s.name}
                  </span>
                  <span className="font-medium ml-auto">{s.rate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Nenhum dado encontrado
          </div>
        )}
      </CardContent>
    </Card>
  )
}
