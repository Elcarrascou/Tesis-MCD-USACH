import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const UsachShield = () => (
  <svg width="34" height="38" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M18 2L34 8V22C34 30 18 38 18 38C18 38 2 30 2 22V8L18 2Z" fill="#0d3b8c" stroke="#e8a400" strokeWidth="1.5"/>
    <path d="M18 6L30 10.5V22C30 28 18 34 18 34C18 34 6 28 6 22V10.5L18 6Z" fill="#0a2d6e"/>
    <rect x="9" y="13" width="8" height="8" rx="1" fill="#e8a400" opacity="0.85"/>
    <rect x="19" y="13" width="8" height="8" rx="1" fill="#e8a400" opacity="0.5"/>
    <rect x="9" y="23" width="8" height="5" rx="1" fill="#e8a400" opacity="0.5"/>
    <rect x="19" y="23" width="8" height="5" rx="1" fill="#e8a400" opacity="0.85"/>
    <line x1="18" y1="13" x2="18" y2="28" stroke="#e8a400" strokeWidth="0.8" opacity="0.6"/>
    <line x1="9" y1="21" x2="27" y2="21" stroke="#e8a400" strokeWidth="0.8" opacity="0.6"/>
  </svg>
)

const sectionLinks = [
  { href: '#overview',      label: 'Proyecto' },
  { href: '#architecture',  label: 'Arquitectura' },
  { href: '#ml',            label: 'Modelos ML' },
  { href: '#stack',         label: 'Stack' },
  { href: '#budget',        label: 'Presupuesto' },
  { href: '#roadmap',       label: 'Roadmap' },
]

const pageTabs = [
  { to: '/',              label: 'Proyecto',      end: true },
  { to: '/anteproyecto',  label: 'Anteproyecto',  end: false },
  { to: '/presentacion',  label: 'Presentación',  end: false },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      {/* Gold stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[200]"
        style={{ background: 'linear-gradient(90deg,#e8a400,#f5bc2e,#e8a400)' }} />

      {/* Nav bar */}
      <nav className="fixed top-1 left-0 right-0 z-[100] h-[58px] flex items-center px-6 justify-between"
        style={{ background: 'rgba(11,17,32,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Brand */}
        <div className="flex items-center gap-3">
          <UsachShield />
          <div className="flex flex-col gap-px">
            <span className="font-cond text-[11px] font-semibold tracking-[0.12em] uppercase text-u-gold leading-none">USACH</span>
            <span className="hidden sm:block text-[11px] text-u-muted tracking-[0.04em] leading-none">Magíster en Ciencia de Datos</span>
          </div>
        </div>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Section anchors — only on home */}
          {isHome && (
            <div className="flex gap-px">
              {sectionLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-u-muted text-[12px] px-2.5 py-1.5 rounded-md hover:text-u-white transition-all duration-150 tracking-[0.02em]"
                  onMouseEnter={e => (e.currentTarget.style.background = '#16233a')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {l.label}
                </a>
              ))}
            </div>
          )}

          {/* Page tabs */}
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#101929', border: '1px solid rgba(255,255,255,0.08)' }}>
            {pageTabs.map(t => (
              <NavLink key={t.to} to={t.to} end={t.end}
                className={({ isActive }) =>
                  `text-[12px] px-3 py-1.5 rounded-md transition-all duration-150 font-medium ${
                    isActive ? 'bg-u-gold text-navy font-semibold' : 'text-u-muted hover:text-u-white'
                  }`
                }>
                {t.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden text-u-muted hover:text-u-white transition-colors p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="fixed top-[60px] left-0 right-0 z-[99] p-4 flex flex-col gap-1.5 lg:hidden"
          style={{ background: '#101929', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {pageTabs.map(t => (
            <NavLink key={t.to} to={t.to} end={t.end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-lg transition-all ${
                  isActive ? 'bg-u-gold text-navy font-semibold' : 'text-u-muted hover:text-u-white'
                }`
              }>
              {t.label}
            </NavLink>
          ))}
          {isHome && (
            <>
              <div className="my-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              {sectionLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="text-sm px-3 py-2 text-u-muted hover:text-u-white rounded-lg transition-all">
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
