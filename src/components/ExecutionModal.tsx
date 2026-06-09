import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Copy,
  TerminalSquare,
  Settings,
  HelpCircle,
  Loader2,
  Play,
  AlertTriangle,
  CheckCircle2,
  StopCircle,
  UploadCloud,
  X,
  RefreshCw,
  Check,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import { cn } from '@/lib/utils'

function syntaxHighlightJSON(json: string) {
  const safeStr = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return safeStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      let cls = 'text-foreground'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-blue-600 dark:text-blue-400 font-medium'
        } else {
          cls = 'text-green-600 dark:text-green-400'
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-orange-500'
      } else if (/null/.test(match)) {
        cls = 'text-gray-500'
      } else {
        cls = 'text-purple-600 dark:text-purple-400'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    },
  )
}

function parseMarkdown(text: string) {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-foreground">$1</h3>')
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold mt-5 mb-3 text-foreground border-b border-border/50 pb-1">$1</h2>',
    )
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-extrabold mt-6 mb-4 text-foreground border-b border-border/50 pb-2">$1</h1>',
    )
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(
      /`(.*?)`/g,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-[13px] text-primary font-mono">$1</code>',
    )
    .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc my-1">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc my-1">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal my-1">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n(?!\s*<)/g, '<br/>')

  return html
}

const getMockResponse = (format: string) => {
  if (format === 'json') {
    return JSON.stringify(
      {
        id: 'req_' + Math.random().toString(36).substr(2, 6),
        status: 'success',
        metadata: {
          confidence: 0.98,
          processingTime: '1.2s',
          model: 'gpt-4-turbo',
        },
        results: [
          { type: 'anomaly_detected', count: 12, severity: 'high', action: 'block_ip' },
          { type: 'login_success', count: 450, severity: 'low', action: 'none' },
        ],
        summary: 'Análise concluída. 12 anomalias encontradas.',
      },
      null,
      2,
    )
  }
  return `### Resumo da Execução

O sistema processou suas instruções e identificou os seguintes pontos principais:

1. **Eficiência Operacional**: Aumento de 15% na capacidade de resposta.
2. **Riscos Mitigados**: Todas as vulnerabilidades críticas foram isoladas.

#### Próximos Passos
Recomendamos a execução de uma auditoria completa nos logs utilizando a chave \`audit_v2\`.

\`\`\`json
{
  "status": "verificado",
  "score": 98.5
}
\`\`\`

> *Nota: Esta é uma simulação de resposta gerada pelo agente em tempo real.*

Se precisar de ajustes, refine sua instrução e execute novamente.`
}

export function ExecutionModal() {
  const { executingAgent, setExecutingAgent } = useMainStore()
  const { toast } = useToast()

  const [instruction, setInstruction] = useState('')
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error' | 'cancelled'>(
    'idle',
  )
  const [result, setResult] = useState('')
  const [timer, setTimer] = useState(0)
  const [outputFormat, setOutputFormat] = useState('markdown')
  const [temp, setTemp] = useState(0.7)
  const [execId, setExecId] = useState('')
  const [copied, setCopied] = useState(false)

  const streamRef = useRef<NodeJS.Timeout | null>(null)
  const outputEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (executingAgent) {
      setInstruction('')
      setResult('')
      setStatus('idle')
      setTimer(0)
      setOutputFormat('markdown')
    } else {
      stopStream()
    }
  }, [executingAgent])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'running') {
      interval = setInterval(() => setTimer((t) => t + 1), 100)
    }
    return () => clearInterval(interval)
  }, [status])

  useEffect(() => {
    if (status === 'running') {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [result, status])

  const stopStream = () => {
    if (streamRef.current) clearInterval(streamRef.current)
  }

  const handleExecute = useCallback(() => {
    if (!instruction.trim() || status === 'running') return
    setStatus('running')
    setResult('')
    setTimer(0)
    setExecId(`exec_${Math.random().toString(36).substr(2, 9)}`)
    setCopied(false)

    const willError = instruction.toLowerCase().includes('erro')
    const targetText = getMockResponse(outputFormat)
    let currentIndex = 0

    stopStream()
    streamRef.current = setInterval(() => {
      if (currentIndex < targetText.length) {
        const chunk = Math.floor(Math.random() * 15) + 5
        setResult((prev) => prev + targetText.slice(currentIndex, currentIndex + chunk))
        currentIndex += chunk
      } else {
        stopStream()
        setStatus(willError ? 'error' : 'success')
      }
    }, 20)
  }, [instruction, status, outputFormat])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (executingAgent && status !== 'running' && instruction.trim()) {
          e.preventDefault()
          handleExecute()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [executingAgent, instruction, status, handleExecute])

  const handleCloseAttempt = (e?: Event) => {
    if (instruction.trim() || result) {
      if (!window.confirm('Você tem dados não salvos. Deseja realmente fechar?')) {
        e?.preventDefault()
        return false
      }
    }
    setExecutingAgent(null)
    return true
  }

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast({
      title: 'Copiado!',
      description: 'Resultado copiado para a área de transferência.',
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (!executingAgent) return null

  return (
    <Dialog
      open={!!executingAgent}
      onOpenChange={(open) => {
        if (!open) handleCloseAttempt()
      }}
    >
      <DialogContent
        className="max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] border-border/50 shadow-2xl gap-0 [&>button]:hidden"
        onInteractOutside={handleCloseAttempt}
        onEscapeKeyDown={handleCloseAttempt}
      >
        <DialogTitle className="sr-only">Execução do Agente {executingAgent.name}</DialogTitle>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-border/50 px-6 py-4 bg-[oklch(95%_0_0)] dark:bg-[oklch(15%_0_0)] z-10">
          <div className="flex items-center gap-4 text-sm font-medium">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => handleCloseAttempt()}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md border border-border/50 shadow-sm">
                @{executingAgent.id}
              </span>
              <span className="text-muted-foreground opacity-50">&gt;</span>
              <span className="font-semibold text-foreground">Executar</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:text-foreground"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:text-foreground"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col min-[1200px]:flex-row">
          {/* Left Panel - 40% */}
          <div className="w-full min-[1200px]:w-[40%] flex flex-col border-b min-[1200px]:border-b-0 min-[1200px]:border-r border-border/50 bg-[oklch(95%_0_0)] dark:bg-[oklch(15%_0_0)] overflow-y-auto shrink-0">
            <div className="p-6 space-y-6 flex-1 flex flex-col">
              {/* Context Box */}
              <div className="bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] rounded-xl p-4 border border-border/50 shadow-sm flex gap-4 items-start shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-[oklch(48%_0.15_242)]">
                  <TerminalSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                    {executingAgent.name}
                    <Badge variant="outline" className="text-[10px] h-5 py-0 px-1.5 bg-muted/30">
                      {executingAgent.squad}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] h-5 py-0 px-1.5">
                      {executingAgent.type}
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {executingAgent.description}
                  </p>
                </div>
              </div>

              {/* Config Parameters */}
              <div className="space-y-4 shrink-0">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Modelo
                    </Label>
                    <Select defaultValue="gpt-4-turbo">
                      <SelectTrigger className="h-9 text-xs font-medium bg-background shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Temperatura
                      </Label>
                      <span className="text-xs font-mono font-medium text-[oklch(48%_0.15_242)] bg-[oklch(48%_0.15_242)]/10 px-1.5 rounded">
                        {temp.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[temp]}
                      onValueChange={([v]) => setTemp(v)}
                      max={2}
                      step={0.1}
                      className="py-2 cursor-pointer [&>span:first-child]:bg-muted [&_[role=slider]]:bg-[oklch(48%_0.15_242)]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-card/60 rounded-lg p-3 border border-border/50 shadow-sm">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Modo de Análise Profunda</Label>
                    <p className="text-[10px] text-muted-foreground">
                      Aumenta o tempo de raciocínio lógico e precisão.
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-[oklch(48%_0.15_242)]" />
                </div>
              </div>

              {/* Instruction Field */}
              <div className="space-y-3 flex-1 flex flex-col min-h-[250px]">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Instrução
                  </Label>
                  <span
                    className={cn(
                      'text-[10px] font-mono font-medium px-2 py-0.5 rounded-full transition-colors',
                      instruction.length >= 5000
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-muted text-muted-foreground border border-border/40',
                    )}
                  >
                    {instruction.length} / 5000 chars
                  </span>
                </div>
                <Textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value.slice(0, 5000))}
                  placeholder="Digite sua instrução aqui...&#10;&#10;(Dica: pressione Cmd/Ctrl + Enter para executar)"
                  className="flex-1 font-mono text-[13px] leading-relaxed resize-none bg-background focus-visible:ring-1 focus-visible:ring-[oklch(48%_0.15_242)] focus-visible:border-[oklch(48%_0.15_242)] p-4 shadow-inner border-border/60"
                />
              </div>

              <Button
                onClick={handleExecute}
                disabled={!instruction.trim() || status === 'running'}
                className="w-full h-10 shrink-0 bg-[oklch(48%_0.15_242)] hover:bg-[oklch(45%_0.15_242)] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {status === 'running' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Executar Instrução
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Panel - 60% */}
          <div className="w-full min-[1200px]:w-[60%] flex flex-col bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] relative min-h-[50vh] min-[1200px]:min-h-0">
            <Tabs
              value={outputFormat}
              onValueChange={(v: any) => setOutputFormat(v)}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Status Bar */}
              <div className="h-14 border-b border-border/50 flex items-center justify-between px-6 bg-[oklch(98%_0_0)] dark:bg-[oklch(20%_0_0)] shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-background border border-border/60 rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm tracking-wide uppercase">
                    {status === 'idle' && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                    {status === 'running' && (
                      <div className="w-2 h-2 rounded-full bg-[oklch(85%_0.15_90)] animate-pulse shadow-[0_0_8px_oklch(85%_0.15_90)]" />
                    )}
                    {status === 'success' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(65%_0.15_150)]" />
                    )}
                    {status === 'error' && (
                      <AlertTriangle className="w-3.5 h-3.5 text-[oklch(60%_0.2_25)]" />
                    )}
                    {status === 'cancelled' && (
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    )}

                    <span className="text-foreground/80">
                      {status === 'idle' && 'Pronto'}
                      {status === 'running' && 'Processando'}
                      {status === 'success' && 'Concluído'}
                      {status === 'error' && 'Erro'}
                      {status === 'cancelled' && 'Cancelado'}
                    </span>
                  </div>
                  {status !== 'idle' && (
                    <span className="text-[11px] font-mono font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                      {status === 'running'
                        ? `⏳ ${(timer / 10).toFixed(1)}s`
                        : `Duração: ${(timer / 10).toFixed(1)}s`}
                    </span>
                  )}
                </div>
                <TabsList className="h-8 bg-background/50 border border-border/50 shadow-sm p-0.5">
                  <TabsTrigger
                    value="markdown"
                    className="text-[10px] px-3 py-1 font-bold tracking-wider data-[state=active]:bg-[oklch(48%_0.15_242)] data-[state=active]:text-white"
                  >
                    MD
                  </TabsTrigger>
                  <TabsTrigger
                    value="json"
                    className="text-[10px] px-3 py-1 font-bold tracking-wider data-[state=active]:bg-[oklch(48%_0.15_242)] data-[state=active]:text-white"
                  >
                    JSON
                  </TabsTrigger>
                  <TabsTrigger
                    value="text"
                    className="text-[10px] px-3 py-1 font-bold tracking-wider data-[state=active]:bg-[oklch(48%_0.15_242)] data-[state=active]:text-white"
                  >
                    TXT
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Output Area */}
              <div
                className={cn(
                  'flex-1 overflow-auto p-6 relative transition-colors duration-500',
                  status === 'error' && 'bg-red-500/5 dark:bg-red-500/10',
                )}
              >
                {status === 'idle' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-60 animate-fade-in pointer-events-none">
                    <UploadCloud className="w-16 h-16 mb-4 stroke-[1.5]" />
                    <p className="text-sm font-medium">
                      Execute a instrução para ver resultado aqui
                    </p>
                  </div>
                ) : status === 'error' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
                    <h3 className="text-lg font-bold text-foreground mb-2">Falha na Execução</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      Ocorreu um erro inesperado ao processar sua requisição. Verifique os
                      parâmetros e tente novamente.
                    </p>
                    <div
                      className="bg-background border border-border/80 shadow-sm rounded-md px-4 py-2 font-mono text-xs text-muted-foreground flex items-center gap-3 mb-8 cursor-pointer hover:bg-accent transition-colors active:scale-95"
                      onClick={() => {
                        navigator.clipboard.writeText(execId)
                        toast({ title: 'ID Copiado!', description: execId, duration: 2000 })
                      }}
                    >
                      ID: <span className="text-foreground">{execId}</span>{' '}
                      <Copy className="w-3.5 h-3.5 ml-1" />
                    </div>
                    <Button
                      onClick={handleExecute}
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20 shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Tentar Novamente
                    </Button>
                  </div>
                ) : (
                  <div className="min-h-full h-full relative">
                    <TabsContent
                      value="json"
                      className="m-0 h-full data-[state=inactive]:hidden outline-none"
                    >
                      <pre
                        className="font-mono text-[13px] whitespace-pre-wrap break-words leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: syntaxHighlightJSON(
                            result || '{\n  "status": "aguardando..."\n}',
                          ),
                        }}
                      />
                      {status === 'running' && (
                        <span className="inline-block w-2 h-4 bg-[oklch(48%_0.15_242)] animate-pulse ml-1 align-middle" />
                      )}
                    </TabsContent>
                    <TabsContent
                      value="text"
                      className="m-0 h-full data-[state=inactive]:hidden outline-none"
                    >
                      <pre className="font-mono text-[13px] whitespace-pre-wrap break-words text-foreground/90 leading-relaxed">
                        {result}
                        {status === 'running' && (
                          <span className="inline-block w-2 h-4 bg-[oklch(48%_0.15_242)] animate-pulse ml-1 align-middle" />
                        )}
                      </pre>
                    </TabsContent>
                    <TabsContent
                      value="markdown"
                      className="m-0 h-full data-[state=inactive]:hidden outline-none"
                    >
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}
                      />
                      {status === 'running' && (
                        <span className="inline-block w-2 h-4 bg-[oklch(48%_0.15_242)] animate-pulse ml-1 align-middle mt-2" />
                      )}
                    </TabsContent>
                    <div ref={outputEndRef} className="h-4" />
                  </div>
                )}
              </div>
            </Tabs>

            {/* Footer Actions */}
            <div className="h-14 border-t border-border/50 flex items-center justify-between px-6 bg-[oklch(98%_0_0)] dark:bg-[oklch(20%_0_0)] shrink-0 z-10">
              <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                {status === 'success' && (
                  <>
                    <span
                      className="flex items-center gap-1.5 bg-muted/50 border border-border/40 px-2.5 py-1 rounded-md shadow-sm"
                      title="Tokens Utilizados"
                    >
                      🪙 ~{Math.floor(result.length / 4)} tokens
                    </span>
                    <span
                      className="flex items-center gap-1.5 bg-muted/50 border border-border/40 px-2.5 py-1 rounded-md shadow-sm"
                      title="ID de Execução"
                    >
                      🆔 <span className="font-mono text-[10px]">{execId}</span>
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatus('cancelled')
                    stopStream()
                  }}
                  disabled={status !== 'running'}
                  className="h-8 text-xs font-semibold hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <StopCircle className="w-3.5 h-3.5 mr-1.5" /> Parar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyResult}
                  disabled={!result || status === 'running' || status === 'error'}
                  className={cn(
                    'h-8 text-xs font-bold shadow-sm transition-all',
                    copied
                      ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                      : 'bg-[oklch(48%_0.15_242)]/10 text-[oklch(48%_0.15_242)] hover:bg-[oklch(48%_0.15_242)]/20',
                  )}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {copied ? 'Copiado!' : 'Copiar Resultado'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
