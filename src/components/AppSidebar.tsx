import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'
import useMainStore from '@/stores/main'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AGENTS } from '@/data/agents'

export function AppSidebar() {
  const {
    search,
    setSearch,
    selectedSquads,
    toggleSquad,
    selectedTypes,
    toggleType,
    clearFilters,
    availableSquads,
    availableTypes,
    filteredAgents,
  } = useMainStore()

  const hasFilters = search || selectedSquads.length > 0 || selectedTypes.length > 0

  return (
    <Sidebar variant="inset" className="border-r border-border/60">
      <SidebarHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm tracking-tight">Filtros de Busca</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar agentes..."
            className="pl-9 h-9 bg-background/50 focus-visible:ring-primary/50 transition-shadow text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-170px)]">
          <SidebarGroup className="pt-4">
            <SidebarGroupLabel className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">
              Squads
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3">
              {availableSquads.map((squad) => (
                <div key={squad} className="flex items-start space-x-3 px-2 group">
                  <Checkbox
                    id={`squad-${squad}`}
                    checked={selectedSquads.includes(squad)}
                    onCheckedChange={() => toggleSquad(squad)}
                    className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                  />
                  <Label
                    htmlFor={`squad-${squad}`}
                    className="text-sm cursor-pointer select-none font-medium leading-none group-hover:text-primary transition-colors"
                  >
                    {squad}
                  </Label>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4 pb-4">
            <SidebarGroupLabel className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">
              Tipos de Agentes
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3">
              {availableTypes.map((type) => (
                <div key={type} className="flex items-start space-x-3 px-2 group">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => toggleType(type)}
                    className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm cursor-pointer select-none font-medium leading-none group-hover:text-primary transition-colors"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <div className="p-4 border-t border-border/40 mt-auto bg-sidebar">
        <div className="flex flex-col gap-3">
          <span className="text-xs text-muted-foreground text-center">
            Exibindo <strong className="text-foreground">{filteredAgents.length}</strong> de{' '}
            {AGENTS.length} agentes
          </span>
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full text-xs h-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              <X className="w-3 h-3 mr-1" /> Limpar filtros
            </Button>
          )}
        </div>
      </div>
    </Sidebar>
  )
}
