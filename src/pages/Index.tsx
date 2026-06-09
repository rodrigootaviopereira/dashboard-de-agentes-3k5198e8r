import { AgentCard } from '@/components/AgentCard'
import useMainStore from '@/stores/main'
import { Bot, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Index() {
  const { filteredAgents, clearFilters } = useMainStore()

  return (
    <div className="max-w-[1400px] mx-auto w-full animate-fade-in">
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
          Descubra o Agente Ideal
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
          Explore nossa biblioteca de inteligências especializadas. Filtre por squad, tipo ou busque
          rapidamente pelo nome ou ID.
        </p>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-card rounded-2xl border border-dashed border-border/80 animate-fade-in-up shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5 border border-border/50">
            <Bot className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2 tracking-tight">Nenhum agente encontrado</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-sm md:text-base">
            Não encontramos nenhum agente que corresponda aos filtros atuais. Tente buscar por
            outros termos ou limpe os filtros para recomeçar.
          </p>
          <Button
            onClick={clearFilters}
            variant="default"
            className="gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredAgents.map((agent, i) => (
            <div
              key={agent.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 30, 400)}ms`, animationFillMode: 'both' }}
            >
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
