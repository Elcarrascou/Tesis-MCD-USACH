import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/** Protege rutas del portal: redirige a login si no hay sesión. */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5fffe' }}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full animate-blink" style={{ background: '#009A93' }} />
          <span className="font-mono text-[14px] font-bold" style={{ color: '#4f4f4f' }}>Verificando sesión…</span>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/portal/login" replace />
  return <>{children}</>
}
