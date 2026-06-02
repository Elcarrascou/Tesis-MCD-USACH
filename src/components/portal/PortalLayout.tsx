import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BrainCircuit, TrendingUp, FlaskConical, BarChart3, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRealtimeStatus } from '../../context/RealtimeContext'
import RealtimeBadge from './RealtimeBadge'
import logoUsach from '../../assets/logoUsach.webp'

const NAV = [
  { to: '/portal',             label: 'Portafolio',    icon: LayoutDashboard, end: true },
  { to: '/portal/movimientos', label: 'Movimientos',   icon: ArrowLeftRight,  end: false },
  { to: '/portal/decisiones',  label: 'Decisiones IA', icon: BrainCircuit,    end: false },
  { to: '/portal/ganancias',   label: 'Ganancias',     icon: TrendingUp,      end: false },
  { to: '/portal/modelos',     label: 'Modelos ML',    icon: FlaskConical,    end: false },
  { to: '/portal/analytics',   label: 'Analytics',     icon: BarChart3,       end: false },
]

const ALPACA_URL = 'https://app.alpaca.markets/'

interface SidebarProps {
  email: string | undefined
  onSignOut: () => void
  onNavigate: () => void
  realtimeStatus: ReturnType<typeof useRealtimeStatus>['aggregate']
}

function Sidebar({ email, onSignOut, onNavigate, realtimeStatus }: SidebarProps) {
  return (
    <>
      {/* Brand */}
      <div className="flex flex-col gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <img src={logoUsach} alt="USACH" className="h-8 w-auto object-contain" />
          <div className="border-l border-white/20 pl-3">
            <div className="font-bold text-[12px] tracking-[0.06em] uppercase leading-none" style={{ color: '#009A93' }}>Portal IA</div>
            <div className="text-[10px] mt-1 leading-none" style={{ color: 'rgba(255,255,255,0.4)' }}>Gestión de Portafolio</div>
          </div>
        </div>
        <RealtimeBadge status={realtimeStatus} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(item => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-semibold press"
              style={({ isActive }) => isActive
                ? { background: '#009A93', color: '#ffffff' }
                : { color: 'rgba(255,255,255,0.6)' }}>
              <Icon size={18} aria-hidden="true" /> {item.label}
            </NavLink>
          )
        })}

        {/* Ejecutar en Alpaca */}
        <a href={ALPACA_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 mt-2 rounded-lg text-[14px] font-semibold press"
          style={{ color: '#f5a050', border: '1px dashed rgba(227,114,0,0.45)' }}>
          <ExternalLink size={18} aria-hidden="true" /> Ejecutar en Alpaca
        </a>
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-[11px] mb-2 truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{email}</div>
        <button type="button" onClick={onSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-bold press"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}>
          <LogOut size={15} aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </>
  )
}

export default function PortalLayout() {
  const { user, signOut } = useAuth()
  const { aggregate } = useRealtimeStatus()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/portal/login', { replace: true })
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5fffe' }}>
      {/* Top accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60]"
        style={{ background: 'linear-gradient(90deg,#009A93,#1ab0a8,#E37200,#1ab0a8,#009A93)' }} />

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed top-1 left-0 bottom-0 w-64 flex-col z-50" style={{ background: '#333333' }}>
        <Sidebar email={user?.email} onSignOut={handleSignOut} onNavigate={() => setOpen(false)} realtimeStatus={aggregate} />
      </aside>

      {/* Topbar mobile */}
      <div className="lg:hidden fixed top-1 left-0 right-0 h-14 z-50 flex items-center justify-between px-4"
        style={{ background: '#333333', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <img src={logoUsach} alt="USACH" className="h-7 w-auto object-contain" />
          <span className="font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: '#009A93' }}>Portal IA</span>
        </div>
        <button type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}
          className="p-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[55]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
          <aside className="absolute top-0 left-0 bottom-0 w-64 flex flex-col" style={{ background: '#333333' }} onClick={e => e.stopPropagation()}>
            <Sidebar email={user?.email} onSignOut={handleSignOut} onNavigate={() => setOpen(false)} realtimeStatus={aggregate} />
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="lg:pl-64 pt-[60px] lg:pt-1">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
