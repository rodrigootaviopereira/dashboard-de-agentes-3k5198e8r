import { Bot } from 'lucide-react'

export default function Reports() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5 border border-border/50">
        <Bot className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Relatórios (Em Breve)</h2>
      <p className="text-muted-foreground max-w-md">
        Análises aprofundadas e gráficos sobre o uso dos seus agentes estarão disponíveis nesta
        seção futuramente.
      </p>
    </div>
  )
}
