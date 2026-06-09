import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, TerminalSquare, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Execution } from '@/data/mock-history'

interface ExecutionHistoryModalProps {
  execution: Execution | null
  onClose: () => void
}

export function ExecutionHistoryModal({ execution, onClose }: ExecutionHistoryModalProps) {
  const { toast } = useToast()

  if (!execution) return null

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copiado!',
      description: `${label} copiado para a área de transferência.`,
      duration: 2000,
    })
  }

  return (
    <Dialog open={!!execution} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] border-border/50 shadow-2xl gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-[oklch(95%_0_0)] dark:bg-[oklch(15%_0_0)]">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <TerminalSquare className="w-5 h-5 text-muted-foreground" />
              <span>Detalhes da Execução</span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Visualizar detalhes de uma execução passada.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Tabs defaultValue="execucao" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 py-2 border-b border-border/50 bg-background/50">
            <TabsList className="h-9">
              <TabsTrigger value="execucao" className="text-xs font-semibold">
                EXECUÇÃO
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-xs font-semibold">
                LOGS
              </TabsTrigger>
              <TabsTrigger value="metadata" className="text-xs font-semibold">
                METADATA
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-background">
            <TabsContent value="execucao" className="m-0 space-y-6 outline-none">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">Status:</span>
                <Badge
                  variant="outline"
                  className={
                    execution.status === 'Sucesso'
                      ? 'border-[oklch(65%_0.13_142)] text-[oklch(65%_0.13_142)] bg-[oklch(65%_0.13_142)]/10'
                      : 'border-[oklch(65%_0.13_9)] text-[oklch(65%_0.13_9)] bg-[oklch(65%_0.13_9)]/10'
                  }
                >
                  {execution.status === 'Sucesso' ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {execution.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Instrução Original</h4>
                <div className="bg-muted p-4 rounded-md border border-border/50">
                  <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                    {execution.instruction}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Resultado</h4>
                <div className="bg-muted p-4 rounded-md border border-border/50">
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto text-foreground/90">
                    {execution.result}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="m-0 outline-none">
              <div className="bg-slate-950 p-4 rounded-md border border-slate-800 h-[300px] overflow-y-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300 leading-relaxed">
                  {execution.logs}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="m-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Execution ID', value: execution.id },
                  { label: 'Agent ID', value: execution.agent_id },
                  { label: 'Squad', value: execution.squad },
                  { label: 'Model', value: execution.model },
                  { label: 'Duration', value: `${(execution.duration_ms / 1000).toFixed(1)}s` },
                  {
                    label: 'Tokens In/Out',
                    value: `${execution.tokens_in} / ${execution.tokens_out}`,
                  },
                  { label: 'Timestamp', value: new Date(execution.timestamp).toLocaleString() },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col p-3 bg-muted/40 rounded-md border border-border/50"
                  >
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {item.label}
                    </span>
                    <span className="text-sm font-mono text-foreground font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>

          <div className="border-t border-border/50 px-6 py-4 bg-[oklch(95%_0_0)] dark:bg-[oklch(15%_0_0)] flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(execution.instruction, 'Instrução')}
            >
              <Copy className="w-3.5 h-3.5 mr-2" /> Copiar Instrução
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCopy(execution.logs, 'Logs')}>
              <Copy className="w-3.5 h-3.5 mr-2" /> Copiar Logs
            </Button>
            <Button
              size="sm"
              onClick={() => handleCopy(execution.result, 'Resultado')}
              className="bg-[oklch(48%_0.15_242)] hover:bg-[oklch(48%_0.15_242)]/90 text-white"
            >
              <Copy className="w-3.5 h-3.5 mr-2" /> Copiar Resultado
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
