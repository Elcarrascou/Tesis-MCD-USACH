import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { RealtimeStatus } from '../hooks/useRealtimeInserts'

// ════════════════════════════════════════════════════════════
// Estado agregado de conexiones Realtime activas en el portal.
// Cada página que abre un canal reporta su status; el sidebar
// muestra el "peor" estado para reflejar conexión real.
// ════════════════════════════════════════════════════════════

interface RealtimeContextValue {
  statuses: Record<string, RealtimeStatus>
  report: (channel: string, status: RealtimeStatus) => void
  aggregate: RealtimeStatus
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined)

const PRIORITY: Record<RealtimeStatus, number> = {
  error: 0, disconnected: 1, connecting: 2, live: 3,
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, RealtimeStatus>>({})

  const report = useCallback((channel: string, status: RealtimeStatus) => {
    setStatuses(prev => prev[channel] === status ? prev : { ...prev, [channel]: status })
  }, [])

  const values = Object.values(statuses)
  const aggregate: RealtimeStatus = values.length === 0
    ? 'disconnected'
    : values.reduce((worst, s) => PRIORITY[s] < PRIORITY[worst] ? s : worst, 'live' as RealtimeStatus)

  return (
    <RealtimeContext.Provider value={{ statuses, report, aggregate }}>
      {children}
    </RealtimeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRealtimeStatus() {
  const ctx = useContext(RealtimeContext)
  if (!ctx) throw new Error('useRealtimeStatus debe usarse dentro de <RealtimeProvider>')
  return ctx
}
