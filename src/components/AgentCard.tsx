import { Agent } from '@/data/agents'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, TerminalSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'

export function AgentCard({ agent }: { agent: Agent }) {
  const { toast } = useToast()
  const { setSelectedAgent } = useMainStore()

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(agent.id)
    toast({
      title: 'Copiado!',
      description: `${agent.id} copiado para a área de transferência.`,
      duration: 2000,
    })
  }

  return (
    <Card
      className="group cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm active:scale-[0.98] flex flex-col h-full"
      onClick={() => setSelectedAgent(agent)}
    >
      <CardHeader className="pb-3 flex-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent transition-colors text-xs font-semibold px-2.5 py-0.5"
          >
            {agent.squad}
          </Badge>
          <button
            onClick={handleCopy}
            className="text-muted-foreground/60 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-primary/10"
            title="Copiar ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
          {agent.name}
        </CardTitle>
        <div className="flex items-center text-xs font-mono text-muted-foreground mt-1.5">
          <TerminalSquare className="w-3 h-3 mr-1.5 opacity-70" />
          {agent.id}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground/90 mb-4 h-10">
          {agent.description}
        </CardDescription>
        <div className="flex items-center mt-auto">
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70 border-border/60 bg-muted/30"
          >
            {agent.type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
