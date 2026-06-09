export type ExecutionStatus = 'success' | 'error'

export interface ExecutionLog {
  id: string
  agent_id: string
  instruction: string
  result: string
  status: ExecutionStatus
  duration_ms: number
  timestamp: string
  tokens_in: number
  tokens_out: number
  logs: string
}

const AGENTS = [
  '@orquestrador-sindico',
  '@financeiro-ai',
  '@marketing-gen',
  '@suporte-nivel1',
  '@analista-dados',
]
const STATUS_DIST = Array(85).fill('success').concat(Array(15).fill('error'))

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export const MOCK_EXECUTIONS: ExecutionLog[] = Array.from({ length: 50 }, (_, i) => {
  const isSuccess = STATUS_DIST[Math.floor(Math.random() * STATUS_DIST.length)] as ExecutionStatus
  const date = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())

  return {
    id: `exec_${Math.random().toString(36).substr(2, 9)}`,
    agent_id: AGENTS[Math.floor(Math.random() * AGENTS.length)],
    instruction: `Por favor, analise os dados mais recentes do mês de ${date.toLocaleString('default', { month: 'long' })} e forneça um relatório detalhado.`,
    result: isSuccess
      ? JSON.stringify(
          { summary: 'Análise concluída.', score: 95, details: ['Ponto A', 'Ponto B'] },
          null,
          2,
        )
      : 'Error: Connection timeout processing requested context.',
    status: isSuccess,
    duration_ms: Math.floor(Math.random() * 4000) + 500,
    timestamp: date.toISOString(),
    tokens_in: Math.floor(Math.random() * 1000) + 100,
    tokens_out: Math.floor(Math.random() * 2000) + 200,
    logs: `[${date.toISOString()}] INFO: Starting execution...
[${date.toISOString()}] DEBUG: Loading context...
[${date.toISOString()}] ${isSuccess ? 'INFO' : 'ERROR'}: Model reasoning ${isSuccess ? 'completed' : 'failed'}.
${isSuccess ? `[${date.toISOString()}] INFO: Result generated successfully.` : `[${date.toISOString()}] ERROR: Connection timeout.`}`,
  }
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
