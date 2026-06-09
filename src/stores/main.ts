import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { Agent, AGENTS } from '@/data/agents'

interface MainStore {
  search: string
  setSearch: (v: string) => void
  selectedSquads: string[]
  toggleSquad: (s: string) => void
  selectedTypes: string[]
  toggleType: (t: string) => void
  clearFilters: () => void
  filteredAgents: Agent[]
  selectedAgent: Agent | null
  setSelectedAgent: (a: Agent | null) => void
  availableSquads: string[]
  availableTypes: string[]
}

const MainContext = createContext<MainStore | null>(null)

export function MainProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('')
  const [selectedSquads, setSelectedSquads] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const availableSquads = useMemo(() => Array.from(new Set(AGENTS.map((a) => a.squad))).sort(), [])
  const availableTypes = useMemo(() => Array.from(new Set(AGENTS.map((a) => a.type))).sort(), [])

  const filteredAgents = useMemo(() => {
    return AGENTS.filter((a) => {
      const q = search.toLowerCase()
      const matchSearch = search
        ? a.name.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.squad.toLowerCase().includes(q)
        : true
      const matchSquad = selectedSquads.length > 0 ? selectedSquads.includes(a.squad) : true
      const matchType = selectedTypes.length > 0 ? selectedTypes.includes(a.type) : true
      return matchSearch && matchSquad && matchType
    })
  }, [search, selectedSquads, selectedTypes])

  const toggleSquad = (s: string) =>
    setSelectedSquads((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  const toggleType = (t: string) =>
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  const clearFilters = () => {
    setSearch('')
    setSelectedSquads([])
    setSelectedTypes([])
  }

  const value = {
    search,
    setSearch,
    selectedSquads,
    toggleSquad,
    selectedTypes,
    toggleType,
    clearFilters,
    filteredAgents,
    selectedAgent,
    setSelectedAgent,
    availableSquads,
    availableTypes,
  }

  return React.createElement(MainContext.Provider, { value }, children)
}

export default function useMainStore() {
  const context = useContext(MainContext)
  if (!context) throw new Error('useMainStore must be used within MainProvider')
  return context
}
