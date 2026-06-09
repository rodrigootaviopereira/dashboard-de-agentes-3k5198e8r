export interface ExecutionRecord {
  id: string
  agent_id: string
  instruction: string
  result: string
  status: 'success' | 'error'
  duration_ms: number
  timestamp: string
  tokens_in: number
  tokens_out: number
  logs: string
  squad: string
  model: string
}

const agents = ['@orquestrador-sindico', '@financeiro', '@atendimento', '@auditor', '@juridico']
const squads = ['Gestão', 'Finanças', 'Suporte', 'Compliance', 'Legal']

export const mockExecutions: ExecutionRecord[] = Array.from({ length: 50 })
  .map((_, i) => {
    const isSuccess = Math.random() < 0.85
    const agentIdx = Math.floor(Math.random() * agents.length)
    const now = new Date()
    // distribute them mostly in the last 48 hours, some older
    now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 4000))

    return {
      id: `exec_${Math.random().toString(36).substr(2, 9)}`,
      agent_id: agents[agentIdx],
      squad: squads[agentIdx],
      instruction: isSuccess
        ? `Analisar o relatório financeiro do mês e identificar as 3 principais despesas que fugiram do padrão. Retornar em formato JSON estruturado com os valores consolidados.`
        : `Processar o documento PDF gigante com 400 páginas e extrair todas as entidades nomeadas, estruturando por categoria e risco jurídico.`,
      result: isSuccess
        ? JSON.stringify(
            {
              status: 'success',
              data: {
                despesas: [
                  'Manutenção Preventiva',
                  'Licenças de Software Cloud',
                  'Campanha de Marketing B2B',
                ],
              },
              score: 0.92,
            },
            null,
            2,
          )
        : 'Error 504: Timeout exception while processing document. Model failed to respond within the allowed 30000ms execution window. Please reduce input context or retry.',
      status: isSuccess ? 'success' : 'error',
      duration_ms: isSuccess
        ? Math.floor(Math.random() * 3000) + 500
        : Math.floor(Math.random() * 10000) + 5000,
      timestamp: now.toISOString(),
      tokens_in: Math.floor(Math.random() * 2000) + 100,
      tokens_out: isSuccess ? Math.floor(Math.random() * 1000) + 50 : 0,
      logs: `[INFO] Initializing agent ${agents[agentIdx]}
[INFO] Establishing secure session...
[INFO] Loading context and prompt directives...
[INFO] Execution ID allocated: exec_${Math.random().toString(36).substr(2, 6)}
[INFO] Analyzing instruction constraints.
[INFO] Streaming input to inference endpoint (gpt-4-turbo)...
[INFO] Tokens mapped in request: ${Math.floor(Math.random() * 2000) + 100}
${
  isSuccess
    ? `[INFO] Stream completed successfully.\n[INFO] Validating output format (JSON Schema).\n[INFO] Tokens generated: ${Math.floor(Math.random() * 1000) + 50}\n[INFO] Processing complete.`
    : `[WARN] Inference taking longer than expected...\n[ERROR] Request aborted by timeout supervisor.\n[ERROR] Traceback: Timeout exception.`
}`,
      model: 'gpt-4-turbo',
    }
  })
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
