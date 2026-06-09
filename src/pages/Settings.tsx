import { Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5 border border-border/50">
        <SettingsIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Configurações</h2>
      <p className="text-muted-foreground max-w-md">
        Gerencie seu perfil, preferências da plataforma e chaves de API.
      </p>
    </div>
  )
}
