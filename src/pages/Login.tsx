import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Bot } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const storedEmail = localStorage.getItem('aiox_remembered_email')
    if (storedEmail) {
      setEmail(storedEmail)
      setRememberMe(true)
    }
  }, [])

  const validateForm = () => {
    let isValid = true
    if (!email) {
      setEmailError('Email é obrigatório')
      isValid = false
    } else if (!email.includes('@')) {
      setEmailError('Email inválido')
      isValid = false
    } else {
      setEmailError('')
    }

    if (!password) {
      setPasswordError('Senha é obrigatória')
      isValid = false
    } else if (password.length < 3) {
      setPasswordError('Senha deve ter no mínimo 3 caracteres')
      isValid = false
    } else {
      setPasswordError('')
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    // Mock network request
    setTimeout(() => {
      setIsLoading(false)

      if (rememberMe) {
        localStorage.setItem('aiox_remembered_email', email)
      } else {
        localStorage.removeItem('aiox_remembered_email')
      }

      localStorage.setItem(
        'aiox_user',
        JSON.stringify({
          email,
          logged_in: true,
          login_time: Date.now(),
        }),
      )

      toast({
        title: `Bem-vindo, ${email}!`,
        duration: 2000,
      })

      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }, 1500)
  }

  const isSubmitDisabled = !email || !password || isLoading

  return (
    <div className="min-h-screen w-full flex bg-[oklch(95%_0_0)] dark:bg-[oklch(15%_0_0)] text-[oklch(20%_0_0)] dark:text-[oklch(90%_0_0)]">
      {/* Desktop Branding Side (xl+) */}
      <div className="hidden xl:flex xl:w-1/2 bg-[oklch(48%_0.15_242)] text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="z-10 flex flex-col items-center text-center max-w-lg animate-fade-in-up">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm shadow-elevation">
            <Bot size={40} className="text-white" />
          </div>
          <h1 className="text-[32px] font-semibold mb-4 leading-tight">
            Dashboard de Agentes AIOX
          </h1>
          <p className="text-xl text-white/80">Descubra e execute agentes em um só lugar</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full xl:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        {/* Tablet Branding (md to xl) */}
        <div className="hidden md:flex xl:hidden flex-col items-center mb-8 text-center animate-fade-in-down">
          <div className="w-16 h-16 bg-[oklch(48%_0.15_242)] rounded-2xl flex items-center justify-center mb-6 shadow-elevation">
            <Bot size={32} className="text-white" />
          </div>
          <h1 className="text-[32px] font-semibold mb-2">Dashboard de Agentes AIOX</h1>
          <p className="text-muted-foreground">Descubra e execute agentes em um só lugar</p>
        </div>

        {/* Mobile Branding (< md) */}
        <div className="flex md:hidden flex-col items-center mb-8 text-center animate-fade-in-down">
          <div className="w-12 h-12 bg-[oklch(48%_0.15_242)] rounded-xl flex items-center justify-center mb-4 shadow-elevation">
            <Bot size={24} className="text-white" />
          </div>
          <h1 className="text-[32px] font-semibold leading-tight">AIOX</h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md bg-white dark:bg-[oklch(22%_0_0)] p-8 rounded-xl shadow-elevation border border-[oklch(85%_0_0)] dark:border-[oklch(25%_0_0)] animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[14px] font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                onBlur={validateForm}
                className={`font-mono text-[14px] h-12 ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {emailError && <p className="text-sm text-red-500 animate-fade-in">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[14px] font-semibold">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      'Recuperação não implementada ainda. Use qualquer email/senha para testar.',
                    )
                  }
                  className="text-sm font-medium text-[oklch(48%_0.15_242)] hover:text-[oklch(65%_0.09_242)] transition-colors"
                >
                  Esqueci a Senha?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) setPasswordError('')
                }}
                onBlur={validateForm}
                className={`font-mono text-[14px] h-12 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {passwordError && (
                <p className="text-sm text-red-500 animate-fade-in">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="rememberMe"
                className="text-[14px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Lembrar de mim
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full h-12 bg-[oklch(48%_0.15_242)] hover:bg-[oklch(65%_0.09_242)] text-white font-semibold text-base transition-colors duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Não tem conta? </span>
            <button
              type="button"
              onClick={() =>
                alert('Signup não implementado. Use /dashboard para acessar direto (teste).')
              }
              className="font-medium text-[oklch(48%_0.15_242)] hover:text-[oklch(65%_0.09_242)] transition-colors"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
