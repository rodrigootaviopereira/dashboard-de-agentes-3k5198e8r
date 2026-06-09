import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Moon, Sun, Settings, LogOut } from 'lucide-react'
import { useTheme } from './theme-provider'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('aiox_user')
      navigate('/login')
    }
  }
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden mr-2 h-9 w-9" />
        <Link
          to="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl" role="img" aria-label="logo">
            🎯
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline-block">
            Dashboard de Agentes AIOX
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-full w-9 h-9 border border-border/50 bg-background hover:bg-muted active:scale-95 transition-all"
          title="Alternar tema"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full border border-border/50"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                  alt="Avatar"
                />
                <AvatarFallback>AX</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Usuário AIOX</p>
                <p className="text-xs leading-none text-muted-foreground">usuario@aiox.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
