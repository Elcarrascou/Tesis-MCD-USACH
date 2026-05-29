import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoUsach from '../../assets/logoUsach.webp'

const sectionLinks = [
  { href: '#overview',     label: 'Proyecto' },
  { href: '#architecture', label: 'Arquitectura' },
  { href: '#ml',           label: 'Modelos ML' },
  { href: '#stack',        label: 'Stack' },
  { href: '#budget',       label: 'Presupuesto' },
  { href: '#roadmap',      label: 'Roadmap' },
]

const pageTabs = [
  { to: '/',             label: 'Proyecto',     end: true },
  { to: '/anteproyecto', label: 'Anteproyecto', end: false },
  { to: '/presentacion', label: 'Presentación', end: false },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      {/* Teal + orange accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[200]"
        style={{ background: 'linear-gradient(90deg,#009A93,#00b5ad,#E37200,#00b5ad,#009A93)' }} />

      {/* Nav — dark "plomo" */}
      <nav className="fixed top-1 left-0 right-0 z-[100] h-[58px] flex items-center px-6 justify-between"
        style={{ background: '#1a2e2d', borderBottom: '1px solid rgba(0,154,147,0.2)', boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>

        {/* Logo USACH */}
        <div className="flex items-center gap-3">
          <img src={logoUsach} alt="USACH" className="h-8 w-auto object-contain" style={{ filter: 'brightness(1)' }} />
          <div className="hidden sm:flex flex-col gap-px border-l border-white/20 pl-3">
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase leading-none" style={{ color: '#009A93' }}>Magíster en Ciencia de Datos</span>
            <span className="text-[10px] leading-none" style={{ color: 'rgba(255,255,255,0.45)' }}>Proyecto de Título · 2026</span>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {isHome && (
            <div className="flex gap-px">
              {sectionLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-[12px] px-2.5 py-1.5 rounded-md transition-all duration-150 tracking-[0.02em] font-medium"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,154,147,0.15)'; e.currentTarget.style.color = '#00b5ad' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}>
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,154,147,0.25)' }}>
            {pageTabs.map(t => (
              <NavLink key={t.to} to={t.to} end={t.end}
                className="text-[12px] px-3.5 py-1.5 rounded-lg transition-all duration-150 font-bold"
                style={({ isActive }) => isActive
                  ? { background: '#009A93', color: 'white' }
                  : { color: 'rgba(255,255,255,0.55)' }}>
                {t.label}
              </NavLink>
            ))}
          </div>
        </div>

        <button className="lg:hidden p-1 transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="fixed top-[60px] left-0 right-0 z-[99] p-4 flex flex-col gap-1.5 lg:hidden"
          style={{ background: '#1a2e2d', borderBottom: '1px solid rgba(0,154,147,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          {pageTabs.map(t => (
            <NavLink key={t.to} to={t.to} end={t.end} onClick={() => setOpen(false)}
              className="text-sm px-3 py-2 rounded-lg transition-all font-bold"
              style={({ isActive }) => isActive
                ? { background: '#009A93', color: 'white' }
                : { color: 'rgba(255,255,255,0.6)' }}>
              {t.label}
            </NavLink>
          ))}
          {isHome && (
            <>
              <div className="my-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              {sectionLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="text-sm px-3 py-2 rounded-lg transition-all font-semibold"
                  style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {l.label}
                </a>
              ))}
            </>
          )}
        </div>
      )}
    </>
  )
}
