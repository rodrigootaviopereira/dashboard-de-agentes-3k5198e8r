import { ReportExecution } from './reports-data'

export type FilterState = { squad: string; period: string; agent: string }

export function filterData(data: ReportExecution[], filters: FilterState) {
  const now = new Date()
  return data.filter((d) => {
    if (filters.squad !== 'Todos' && d.squad !== filters.squad) return false
    if (filters.agent !== 'Todos' && d.agentId !== filters.agent) return false

    if (filters.period !== 'Todos') {
      const dDate = new Date(d.timestamp)
      const diffHours = (now.getTime() - dDate.getTime()) / (1000 * 60 * 60)

      if (filters.period === 'Últimas 24h' && diffHours > 24) return false
      if (filters.period === 'Últimos 7 dias' && diffHours > 24 * 7) return false
      if (
        filters.period === 'Este mês' &&
        (now.getMonth() !== dDate.getMonth() || now.getFullYear() !== dDate.getFullYear())
      )
        return false
    }
    return true
  })
}

export function getSummaryStats(data: ReportExecution[]) {
  const total = data.length
  const successCount = data.filter((d) => d.status === 'SUCCESS').length
  const avgTime = total ? data.reduce((acc, d) => acc + d.duration, 0) / total : 0
  const squads = new Set(data.map((d) => d.squad))

  return {
    total,
    successRate: total ? (successCount / total) * 100 : 0,
    avgTime,
    squadsCount: squads.size,
  }
}

export function getTopAgents(data: ReportExecution[]) {
  const counts: Record<string, number> = {}
  data.forEach((d) => {
    counts[d.agentId] = (counts[d.agentId] || 0) + 1
  })

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

export function getSquadSuccess(data: ReportExecution[]) {
  const stats: Record<string, { total: number; success: number }> = {}
  data.forEach((d) => {
    if (!stats[d.squad]) stats[d.squad] = { total: 0, success: 0 }
    stats[d.squad].total += 1
    if (d.status === 'SUCCESS') stats[d.squad].success += 1
  })

  return Object.entries(stats).map(([name, { total, success }]) => {
    const rate = (success / total) * 100
    let fill = 'oklch(65% 0.13 9)' // Error Red
    if (rate >= 90)
      fill = 'oklch(65% 0.13 142)' // Success Green
    else if (rate >= 70) fill = 'oklch(75% 0.12 92)' // Warning Yellow

    return { name, value: total, rate, fill }
  })
}

export function getTimeTrend(data: ReportExecution[]) {
  const trend: Record<string, { total: number; count: number }> = {}

  // Pre-fill last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
    trend[dateStr] = { total: 0, count: 0 }
  }

  data.forEach((d) => {
    const dDate = new Date(d.timestamp)
    const now = new Date()
    if ((now.getTime() - dDate.getTime()) / (1000 * 60 * 60 * 24) > 7) return

    const dateStr = dDate.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
    if (trend[dateStr]) {
      trend[dateStr].total += d.duration
      trend[dateStr].count += 1
    }
  })

  return Object.entries(trend).map(([date, { total, count }]) => ({
    date,
    value: count ? +(total / count).toFixed(1) : 0,
  }))
}

export function getRankingTable(data: ReportExecution[]) {
  const stats: Record<string, { executions: number; success: number; time: number; last: string }> =
    {}

  data.forEach((d) => {
    if (!stats[d.agentId])
      stats[d.agentId] = { executions: 0, success: 0, time: 0, last: d.timestamp }
    stats[d.agentId].executions += 1
    if (d.status === 'SUCCESS') stats[d.agentId].success += 1
    stats[d.agentId].time += d.duration
    if (new Date(d.timestamp) > new Date(stats[d.agentId].last)) stats[d.agentId].last = d.timestamp
  })

  return Object.entries(stats)
    .map(([agentId, s]) => ({
      agentId,
      executions: s.executions,
      rate: (s.success / s.executions) * 100,
      avgTime: s.time / s.executions,
      lastExecution: s.last,
    }))
    .sort((a, b) => b.rate - a.rate || b.executions - a.executions)
}
