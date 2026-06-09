import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { ThemeProvider } from './components/theme-provider'
import { ExecutionModal } from './components/ExecutionModal'
import { MainProvider } from '@/stores/main'
import History from './pages/History'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { Navigate } from 'react-router-dom'

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="agents-theme">
    <MainProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ExecutionModal />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/history" element={<History />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </MainProvider>
  </ThemeProvider>
)

export default App
