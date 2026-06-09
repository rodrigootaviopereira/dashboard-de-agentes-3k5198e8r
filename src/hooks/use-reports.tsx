import { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { MOCK_REPORTS } from '@/lib/reports-data'
import {
  FilterState,
  filterData,
  getSummaryStats,
  getTopAgents,
  getSquadSuccess,
  getTimeTrend,
  getRankingTable,
} from '@/lib/reports-processing'

interface ReportsContextData {
  filters: FilterState
  setFilters: (f: Partial<FilterState>) => void
  resetFilters: () => void
  hasFilters: boolean
  stats: ReturnType<typeof getSummaryStats>
  topAgents: ReturnType<typeof getTopAgents>
  squadSuccess: ReturnType<typeof getSquadSuccess>
  timeTrend: ReturnType<typeof getTimeTrend>
  rankingTable: ReturnType<typeof getRankingTable>
}

const ReportsContext = createContext<ReportsContextData | null>(null)

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>({
    squad: 'Todos',
    period: 'Últimos 7 dias',
    agent: 'Todos',
  })

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFiltersState({ squad: 'Todos', period: 'Todos', agent: 'Todos' })
  }

  const hasFilters =
    filters.squad !== 'Todos' || filters.period !== 'Todos' || filters.agent !== 'Todos'

  const processedData = useMemo(() => {
    const filtered = filterData(MOCK_REPORTS, filters)
    return {
      stats: getSummaryStats(filtered),
      topAgents: getTopAgents(filtered),
      squadSuccess: getSquadSuccess(filtered),
      timeTrend: getTimeTrend(filtered),
      rankingTable: getRankingTable(filtered),
    }
  }, [filters])

  return (
    <ReportsContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
        hasFilters,
        ...processedData,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const context = useContext(ReportsContext)
  if (!context) throw new Error('useReports must be used within a ReportsProvider')
  return context
}
