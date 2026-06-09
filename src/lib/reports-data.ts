export interface ReportExecution {
  id: string
  agentId: string
  squad: string
  status: 'SUCCESS' | 'WARNING' | 'ERROR'
  duration: number
  timestamp: string
}

const SQUADS = [
  'Sindico-Squad',
  'Juridico-Squad',
  'Sales-Squad',
  'AIOX-Core',
  'Agents-Guru',
  'Claude-Code-Mastery',
]

const AGENTS_BY_SQUAD: Record<string, string[]> = {
  'Sindico-Squad': ['@orquestrador-sindico', '@sindico-helper'],
  'Juridico-Squad': ['@rag-legal', '@contratos-bot'],
  'Sales-Squad': ['@sales-bot', '@lead-gen', '@crm-sync'],
  'AIOX-Core': ['@core-optimizer', '@system-monitor'],
  'Agents-Guru': ['@guru-search', '@knowledge-base'],
  'Claude-Code-Mastery': ['@claude-reviewer', '@code-gen', '@test-runner'],
}

export function generateMockData(): ReportExecution[] {
  const data: ReportExecution[] = []
  const now = new Date()

  for (let i = 0; i < 77; i++) {
    const squad = SQUADS[i % SQUADS.length]
    const agents = AGENTS_BY_SQUAD[squad]
    const agentId = agents[i % agents.length]

    // Distribute statuses realistically
    const isError = i % 8 === 0
    const isWarning = i % 15 === 0
    const status = isError ? 'ERROR' : isWarning ? 'WARNING' : 'SUCCESS'

    // Distribute dates over the last 30 days, heavily weighted to recent
    const daysAgo = i < 20 ? 0 : i < 40 ? 1 : i < 60 ? i % 7 : i % 30
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - i * 1000 * 60 * 15)

    data.push({
      id: `exec-${1000 + i}`,
      agentId,
      squad,
      status,
      duration: Math.floor(Math.random() * 45) + 5, // 5 to 50 seconds
      timestamp: date.toISOString(),
    })
  }

  return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const MOCK_REPORTS = generateMockData()
export const AVAILABLE_AGENTS = Array.from(new Set(MOCK_REPORTS.map((d) => d.agentId))).sort()
