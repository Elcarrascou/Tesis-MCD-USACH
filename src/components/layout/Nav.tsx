import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ExternalLink } from 'lucide-react'
import logoUsach from '../../assets/logoUsach.webp'

const sectionLinks = [
  { href: '#overview',      label: 'Proyecto' },
  { href: '#portal-promo',  label: 'Demo' },
  { href: '#architecture',  label: 'Arquitectura' },
  { href: '#ml',            label: 'Modelos ML' },
  { href: '#marco-teorico', label: 'Marco Teórico' },
  { href: '#stack',         label: 'Stack' },
  { href: '#budget',        label: 'Presupuesto' },
  { href: '#roadmap',       label: 'Roadmap' },
]

const pageTabs = [
  { to: '/',             label: 'Proyecto',     end: true },
  { to: '/solucion',     label: 'Sistema',      end: false },
  { to: '/anteproyecto', label: 'Anteproyecto', end: false },
  { to: '/presentacion', label: 'Presentación', end: false },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      {/* Teal + orange top stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[200]"
        style={{ background: 'linear-gradient(90deg,#009A93,#1ab0a8,#E37200,#1ab0a8,#009A93)' }} />

      {/* Nav — Onyx Black */}
      <nav className="fixed top-1 left-0 right-0 z-[100] h-[62px] flex items-center px-6 justify-between"
        style={{ background: '#333333', borderBottom: '2px solid #009A93', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3.5">
          <img src={logoUsach} alt="USACH" className="h-9 w-auto object-contain" />
          <div className="hidden sm:flex flex-col gap-0.5 border-l border-white/20 pl-3.5">
            <span className="text-[13px] font-bold tracking-[0.08em] uppercase leading-none" style={{ color: '#009A93' }}>
              Magíster en Ciencia de Datos
            </span>
            <span className="text-[11px] leading-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Proyecto de Título · 2026
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5">
          {isHome && (
            <div className="flex gap-0.5">
              {sectionLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-[13px] px-3 py-1.5 rounded-md transition-all duration-150 font-semibold"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,154,147,0.18)'; e.currentTarget.style.color = '#1ab0a8' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,154,147,0.3)' }}>
            {pageTabs.map(t => (
              <NavLink key={t.to} to={t.to} end={t.end}
                className="text-[13px] px-4 py-1.5 rounded-lg transition-all duration-150 font-bold"
                style={({ isActive }) => isActive
                  ? { background: '#009A93', color: '#ffffff' }
                  : { color: 'rgba(255,255,255,0.5)' }}>
                {t.label}
              </NavLink>
            ))}
          </div>

          {/* CTA: abre el portal operacional en ventana nueva */}
          <a href="/portal" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] px-4 py-2 rounded-lg font-bold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: '#E37200', color: '#ffffff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5a050')}
            onMouseLeave={e => (e.currentTarget.style.background = '#E37200')}>
            <ExternalLink size={14} aria-hidden="true" /> Portal IA
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden p-1 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu">
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="fixed top-[64px] left-0 right-0 z-[99] p-4 flex flex-col gap-1.5 lg:hidden"
          style={{ background: '#333333', borderBottom: '2px solid #009A93' }}>
          {pageTabs.map(t => (
            <NavLink key={t.to} to={t.to} end={t.end} onClick={() => setOpen(false)}
              className="text-[14px] px-3 py-2.5 rounded-lg transition-all font-bold"
              style={({ isActive }) => isActive
                ? { background: '#009A93', color: '#ffffff' }
                : { color: 'rgba(255,255,255,0.6)' }}>
              {t.label}
            </NavLink>
          ))}
          <a href="/portal" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 text-[14px] px-3 py-2.5 rounded-lg font-bold"
            style={{ background: '#E37200', color: '#ffffff' }}>
            <ExternalLink size={15} aria-hidden="true" /> Portal IA
          </a>
          {isHome && (
            <>
              <div className="my-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              {sectionLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="text-[14px] px-3 py-2 rounded-lg font-semibold transition-all"
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
