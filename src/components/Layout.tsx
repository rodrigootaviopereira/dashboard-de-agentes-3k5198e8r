import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { AgentModal } from './AgentModal'
import { MainProvider } from '@/stores/main'

export default function Layout() {
  return (
    <MainProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
          <AppSidebar />
          <SidebarInset className="flex flex-col flex-1 w-full min-w-0 bg-slate-50/30 dark:bg-slate-950/30 transition-colors duration-300">
            <Header />
            <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
              <Outlet />
            </main>
            <footer className="py-6 border-t border-border/40 bg-background/50 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Agents Discovery Dashboard. Clean Version.</p>
            </footer>
          </SidebarInset>
        </div>
        <AgentModal />
      </SidebarProvider>
    </MainProvider>
  )
}
