export type ExecutionStatus = 'Sucesso' | 'Erro'

export interface Execution {
  id: string
  agent_id: string
  squad: string
  instruction: string
  result: string
  status: ExecutionStatus
  duration_ms: number
  timestamp: string
  tokens_in: number
  tokens_out: number
  model: string
  logs: string
}

const AGENTS = ['@orquestrador-sindico', '@financeiro', '@juridico', '@atendimento', '@auditoria']
const SQUADS = ['Core', 'Finanças', 'Legal', 'Suporte', 'Compliance']
const MODELS = ['gpt-4-turbo', 'claude-3-opus', 'mistral-large']
const STATUSES: ExecutionStatus[] = ['Sucesso', 'Erro']

const generateMockData = (): Execution[] => {
  const data: Execution[] = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const isSuccess = Math.random() < 0.85
    const agentIdx = Math.floor(Math.random() * AGENTS.length)
    const timestamp = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))

    data.push({
      id: `exec_${Math.random().toString(36).substr(2, 9)}`,
      agent_id: AGENTS[agentIdx],
      squad: SQUADS[agentIdx],
      instruction: `Analisar os dados recentes e fornecer um relatório detalhado. Incluir métricas de ${
        Math.random() > 0.5 ? 'desempenho' : 'vendas'
      } e destacar anomalias.`,
      result: isSuccess
        ? JSON.stringify(
            { status: 'ok', confidence: 0.98, summary: 'Análise concluída com sucesso.' },
            null,
            2,
          )
        : 'Error: Context length exceeded. Please reduce the input size.',
      status: isSuccess ? 'Sucesso' : 'Erro',
      duration_ms: Math.floor(Math.random() * 4000) + 500,
      timestamp: timestamp.toISOString(),
      tokens_in: Math.floor(Math.random() * 2000) + 100,
      tokens_out: Math.floor(Math.random() * 800) + 50,
      model: MODELS[Math.floor(Math.random() * MODELS.length)],
      logs: `[INFO] Initializing agent ${AGENTS[agentIdx]}...\n[INFO] Loading context...\n${isSuccess ? '[INFO] Processing...\n[SUCCESS] Operation completed.' : '[WARN] High memory usage detected.\n[ERROR] Process terminated unexpectedly.'}`,
    })
  }

  return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const MOCK_HISTORY = generateMockData()
