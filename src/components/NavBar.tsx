import { NavLink } from 'react-router-dom'
import { Home, ClipboardList, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NavBar() {
  const navItems = [
    { name: 'Discovery', path: '/dashboard', icon: Home, emoji: '🏠' },
    { name: 'History', path: '/history', icon: ClipboardList, emoji: '📋' },
    { name: 'Reports', path: '/reports', icon: BarChart2, emoji: '📊' },
    { name: 'Settings', path: '/settings', icon: Settings, emoji: '⚙️' },
  ]

  return (
    <nav className="sticky top-[64px] z-20 w-full h-[48px] bg-background/95 backdrop-blur border-b border-border/40 px-4 md:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-sm">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 h-full px-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2',
              isActive
                ? 'border-[oklch(48%_0.15_242)] text-[oklch(48%_0.15_242)]'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )
          }
        >
          <span className="mr-1">{item.emoji}</span>
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}
