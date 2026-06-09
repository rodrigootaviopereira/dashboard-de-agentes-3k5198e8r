import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, TerminalSquare, X, Check, FileText, Activity } from 'lucide-react'
import { ExecutionLog } from '@/data/mockExecutions'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export function ExecutionDetailsModal({
  execution,
  onClose,
}: {
  execution: ExecutionLog | null
  onClose: () => void
}) {
  const { toast } = useToast()
  const [copiedType, setCopiedType] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    toast({
      title: 'Copiado!',
      description: `${type} copiado para a área de transferência.`,
      duration: 2000,
    })
    setTimeout(() => setCopiedType(null), 2000)
  }

  if (!execution) return null

  return (
    <Dialog open={!!execution} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[800px] w-[90vw] p-0 overflow-hidden bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)] border-border/50 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Execution Details</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-[oklch(98%_0_0)] dark:bg-[oklch(20%_0_0)] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${execution.status === 'success' ? 'bg-[oklch(65%_0.13_142)]/10 text-[oklch(65%_0.13_142)]' : 'bg-[oklch(65%_0.13_9)]/10 text-[oklch(65%_0.13_9)]'}`}
            >
              <TerminalSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                {execution.agent_id}
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase h-5 px-1.5 border-transparent ${
                    execution.status === 'success'
                      ? 'bg-[oklch(65%_0.13_142)]/10 text-[oklch(65%_0.13_142)]'
                      : 'bg-[oklch(65%_0.13_9)]/10 text-[oklch(65%_0.13_9)]'
                  }`}
                >
                  {execution.status}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{execution.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="execucao" className="w-full flex flex-col min-h-[400px] max-h-[60vh]">
          <div className="px-6 border-b border-border/50 bg-[oklch(98%_0_0)] dark:bg-[oklch(20%_0_0)] pt-2 shrink-0">
            <TabsList className="bg-transparent h-10 p-0 space-x-6 justify-start">
              <TabsTrigger
                value="execucao"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[oklch(48%_0.15_242)] data-[state=active]:text-[oklch(48%_0.15_242)] rounded-none px-0 font-semibold tracking-wide uppercase text-xs text-muted-foreground"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Execução
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[oklch(48%_0.15_242)] data-[state=active]:text-[oklch(48%_0.15_242)] rounded-none px-0 font-semibold tracking-wide uppercase text-xs text-muted-foreground"
              >
                <Activity className="w-3.5 h-3.5 mr-1.5" /> Logs
              </TabsTrigger>
              <TabsTrigger
                value="metadata"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[oklch(48%_0.15_242)] data-[state=active]:text-[oklch(48%_0.15_242)] rounded-none px-0 font-semibold tracking-wide uppercase text-xs text-muted-foreground"
              >
                Metadata
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto bg-[oklch(100%_0_0)] dark:bg-[oklch(22%_0_0)]">
            <TabsContent value="execucao" className="p-6 m-0 space-y-6 outline-none">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Instrução
                </h3>
                <div className="bg-muted/40 p-4 rounded-md font-mono text-[13px] text-foreground leading-relaxed border border-border/50">
                  {execution.instruction}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Resultado
                </h3>
                <pre className="bg-card p-4 rounded-md font-mono text-[13px] text-foreground leading-relaxed border border-border/50 whitespace-pre-wrap overflow-x-auto shadow-sm">
                  {execution.result}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="p-6 m-0 outline-none h-full flex flex-col">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Raw Logs
              </h3>
              <div className="flex-1 bg-[#1E1E1E] rounded-md border border-border/50 overflow-hidden shadow-inner">
                <div className="max-h-[300px] overflow-y-auto p-4">
                  <pre className="font-mono text-[12px] leading-relaxed text-[#D4D4D4] whitespace-pre-wrap">
                    {execution.logs.split('\n').map((line, i) => {
                      if (line.includes('ERROR'))
                        return (
                          <span key={i} className="text-[#F14C4C] block">
                            {line}
                          </span>
                        )
                      if (line.includes('INFO'))
                        return (
                          <span key={i} className="text-[#4FC1FF] block">
                            {line}
                          </span>
                        )
                      if (line.includes('DEBUG'))
                        return (
                          <span key={i} className="text-[#858585] block">
                            {line}
                          </span>
                        )
                      return (
                        <span key={i} className="block">
                          {line}
                        </span>
                      )
                    })}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="p-6 m-0 outline-none">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Technical Details
              </h3>
              <div className="border border-border/50 rounded-lg overflow-hidden bg-card shadow-sm">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground bg-muted/20 w-1/3">
                        Execution ID
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground">{execution.id}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground bg-muted/20">
                        Agent ID
                      </td>
                      <td className="py-3 px-4 font-mono text-[oklch(48%_0.15_242)] font-medium">
                        {execution.agent_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground bg-muted/20">
                        Date / Time
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {format(new Date(execution.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground bg-muted/20">
                        Duration
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground">
                        {(execution.duration_ms / 1000).toFixed(2)}s
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground bg-muted/20">
                        Tokens (In / Out)
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        <span className="inline-flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-md text-xs font-mono border border-border/50">
                          <span className="text-muted-foreground">IN:</span> {execution.tokens_in}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-md text-xs font-mono ml-2 border border-border/50">
                          <span className="text-muted-foreground">OUT:</span> {execution.tokens_out}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground bg-muted/20">
                        Model Used
                      </td>
                      <td className="py-3 px-4 text-foreground">gpt-4-turbo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-4 border-t border-border/50 bg-[oklch(98%_0_0)] dark:bg-[oklch(20%_0_0)] shrink-0 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(execution.instruction, 'Instrução')}
            className="text-xs font-semibold"
          >
            {copiedType === 'Instrução' ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-[oklch(65%_0.13_142)]" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            Copiar Instrução
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(execution.result, 'Resultado')}
            className="text-xs font-semibold"
          >
            {copiedType === 'Resultado' ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-[oklch(65%_0.13_142)]" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            Copiar Resultado
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleCopy(execution.logs, 'Logs')}
            className="bg-[oklch(48%_0.15_242)] hover:bg-[oklch(48%_0.15_242)]/90 text-white text-xs font-semibold shadow-sm"
          >
            {copiedType === 'Logs' ? (
              <Check className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            Copiar Logs
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
