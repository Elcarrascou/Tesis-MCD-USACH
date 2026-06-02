import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// ════════════════════════════════════════════════════════════
// Toast simple para notificaciones en vivo del portal.
// API: const { push } = useToast(); push({ title, body, color })
// Auto-dismiss en 6s, máx 4 toasts visibles, cierre manual.
// ════════════════════════════════════════════════════════════

export interface Toast {
  id: number
  title: string
  body?: string
  color?: string
  icon?: string
}

interface ToastContextValue {
  push: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const TIMEOUT_MS = 6000
const MAX = 4
let counter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++counter
    setToasts(prev => [...prev.slice(-MAX + 1), { ...t, id }])
  }, [])

  // Auto-dismiss
  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map(t => setTimeout(() => dismiss(t.id), TIMEOUT_MS))
    return () => { timers.forEach(clearTimeout) }
  }, [toasts, dismiss])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none" aria-live="polite" aria-atomic="false">
        {toasts.map(t => {
          const color = t.color ?? '#009A93'
          return (
            <div key={t.id}
              role="status"
              className="pointer-events-auto rounded-xl overflow-hidden card-shadow"
              style={{
                background: '#ffffff',
                border: `1px solid ${color}40`,
                borderLeft: `4px solid ${color}`,
                minWidth: 280,
                maxWidth: 380,
                animation: 'toast-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
              <div className="flex items-start gap-3 px-4 py-3">
                {t.icon && <span className="text-[20px] flex-shrink-0" aria-hidden="true">{t.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[13px] leading-tight" style={{ color: '#333333' }}>{t.title}</div>
                  {t.body && <div className="text-[12px] mt-1 leading-snug" style={{ color: '#4f4f4f' }}>{t.body}</div>}
                </div>
                <button type="button" onClick={() => dismiss(t.id)} aria-label="Cerrar notificación"
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md text-[14px] font-bold hover:bg-black/5 focus-visible:outline focus-visible:outline-2"
                  style={{ color: '#4f4f4f' }}>×</button>
              </div>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translateX(14px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) {
          [role="status"] { animation: none !important; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
