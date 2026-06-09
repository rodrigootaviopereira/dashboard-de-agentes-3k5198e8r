import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, TerminalSquare, Layers, Tag } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import { AGENTS } from '@/data/agents'

export function AgentModal() {
  const { selectedAgent, setSelectedAgent, setExecutingAgent } = useMainStore()
  const { toast } = useToast()

  if (!selectedAgent) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(`${selectedAgent.id} `)
    toast({
      title: 'Copiado!',
      description: 'Comando base copiado para a área de transferência.',
      duration: 2000,
    })
  }

  const relatedAgents = AGENTS.filter(
    (a) => a.squad === selectedAgent.squad && a.id !== selectedAgent.id,
  ).slice(0, 3)

  return (
    <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
      <DialogContent className="sm:max-w-2xl gap-6 overflow-hidden border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl p-0">
        <div className="p-6 pb-0">
          <DialogHeader className="text-left space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="default"
                className="bg-primary hover:bg-primary text-primary-foreground font-medium shadow-sm"
              >
                <Layers className="w-3 h-3 mr-1" />
                {selectedAgent.squad}
              </Badge>
              <Badge
                variant="outline"
                className="text-muted-foreground border-muted-foreground/30 bg-muted/20"
              >
                <Tag className="w-3 h-3 mr-1" />
                {selectedAgent.type}
              </Badge>
            </div>
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-foreground">
                {selectedAgent.name}
              </DialogTitle>
              <div className="inline-flex items-center text-sm font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                <TerminalSquare className="w-4 h-4 mr-2" />
                {selectedAgent.id}
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-8 animate-fade-in">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Descrição
            </h4>
            <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
              {selectedAgent.description}
            </p>
          </div>

          <div className="bg-muted/40 rounded-xl p-5 border border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-3">Como usar</h4>
            <div className="flex items-center justify-between bg-background border border-border/80 rounded-lg p-3 font-mono text-sm shadow-sm group">
              <span className="text-primary">
                {selectedAgent.id}{' '}
                <span className="text-muted-foreground">[seu comando ou requisição aqui]</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 active:scale-95 transition-all"
                title="Copiar comando"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground leading-relaxed flex-1 pr-4">
                Copie o snippet acima ou execute o agente diretamente no ambiente integrado.
              </p>
              <Button
                onClick={() => setExecutingAgent(selectedAgent)}
                className="bg-[oklch(48%_0.15_242)] hover:bg-[oklch(45%_0.15_242)] text-white shadow-md active:scale-95 transition-all h-9"
              >
                <TerminalSquare className="w-4 h-4 mr-2" />
                Executar
              </Button>
            </div>
          </div>

          {relatedAgents.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 mt-4">
                Agentes Relacionados
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col p-3 rounded-lg border border-border/50 bg-card hover:border-primary/40 hover:bg-accent/50 cursor-pointer transition-all active:scale-[0.98]"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <span className="font-semibold text-sm text-foreground line-clamp-1">
                      {agent.name}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground mt-1 truncate">
                      {agent.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
