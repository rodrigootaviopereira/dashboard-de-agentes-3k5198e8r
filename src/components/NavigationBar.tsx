import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Home, ClipboardList, BarChart3, Settings } from 'lucide-react'

export function NavigationBar() {
  const location = useLocation()

  const navItems = [
    { name: 'Discovery', icon: Home, path: '/dashboard', aliases: ['/'] },
    { name: 'History', icon: ClipboardList, path: '/history' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <div className="sticky top-[64px] z-20 w-full h-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40 overflow-x-auto hide-scrollbar">
      <div className="flex h-full w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <nav className="flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path || item.aliases?.includes(location.pathname)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center h-full space-x-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/60',
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
