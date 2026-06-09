import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { NavBar } from './NavBar'
import { AgentModal } from './AgentModal'
import { MainProvider } from '@/stores/main'
import { Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const isDiscovery = location.pathname === '/dashboard' || location.pathname === '/'
  return (
    <MainProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background text-foreground font-sans selection:bg-[oklch(48%_0.15_242)]/20 selection:text-[oklch(48%_0.15_242)]">
          {isDiscovery && <AppSidebar />}
          <SidebarInset className="flex flex-col flex-1 w-full min-w-0 bg-[oklch(95%_0_0)] dark:bg-[oklch(15%_0_0)] transition-colors duration-300">
            <Header />
            <NavBar />
            <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
              <Outlet />
            </main>
            <footer className="flex h-[48px] shrink-0 items-center justify-between px-6 border-t border-border/40 bg-background/50 text-sm text-muted-foreground">
              <p>&copy; 2026 AIOX Dashboard</p>
              <div className="flex gap-4">
                <Link to="/settings" className="hover:text-[oklch(48%_0.15_242)] transition-colors">
                  Terms
                </Link>
                <Link to="/settings" className="hover:text-[oklch(48%_0.15_242)] transition-colors">
                  Privacy
                </Link>
                <Link to="/settings" className="hover:text-[oklch(48%_0.15_242)] transition-colors">
                  Support
                </Link>
              </div>
            </footer>
          </SidebarInset>
        </div>
        <AgentModal />
      </SidebarProvider>
    </MainProvider>
  )
}
