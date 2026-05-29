import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const UsachShield = () => (
  <svg width="34" height="38" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M18 2L34 8V22C34 30 18 38 18 38C18 38 2 30 2 22V8L18 2Z" fill="#0c1d1c" stroke="#009A93" strokeWidth="1.5"/>
    <path d="M18 6L30 10.5V22C30 28 18 34 18 34C18 34 6 28 6 22V10.5L18 6Z" fill="#0a1918"/>
    <rect x="9" y="13" width="8" height="8" rx="1" fill="#009A93" opacity="0.9"/>
    <rect x="19" y="13" width="8" height="8" rx="1" fill="#E37200" opacity="0.7"/>
    <rect x="9" y="23" width="8" height="5" rx="1" fill="#E37200" opacity="0.7"/>
    <rect x="19" y="23" width="8" height="5" rx="1" fill="#009A93" opacity="0.9"/>
    <line x1="18" y1="13" x2="18" y2="28" stroke="#009A93" strokeWidth="0.8" opacity="0.6"/>
    <line x1="9" y1="21" x2="27" y2="21" stroke="#009A93" strokeWidth="0.8" opacity="0.6"/>
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
      {/* Teal top stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[200]"
        style={{ background: 'linear-gradient(90deg,#009A93,#00b5ad,#E37200,#00b5ad,#009A93)' }} />

      {/* Nav bar */}
      <nav className="fixed top-1 left-0 right-0 z-[100] h-[58px] flex items-center px-6 justify-between"
        style={{ background: 'rgba(12,29,28,0.93)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>

        {/* Brand */}
        <div className="flex items-center gap-3">
          <UsachShield />
          <div className="flex flex-col gap-px">
            <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-u-gold leading-none">USACH</span>
            <span className="hidden sm:block text-[11px] text-u-muted tracking-[0.04em] leading-none">Magíster en Ciencia de Datos</span>
          </div>
        </div>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-4">
          {isHome && (
            <div className="flex gap-px">
              {sectionLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-u-muted text-[12px] px-2.5 py-1.5 rounded-md hover:text-u-white transition-all duration-150 tracking-[0.02em]"
                  onMouseEnter={e => (e.currentTarget.style.background = '#163330')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.15)' }}>
            {pageTabs.map(t => (
              <NavLink key={t.to} to={t.to} end={t.end}
                className={({ isActive }) =>
                  `text-[12px] px-3 py-1.5 rounded-md transition-all duration-150 font-semibold ${
                    isActive ? 'text-navy' : 'text-u-muted hover:text-u-white'
                  }`
                }
                style={({ isActive }) => isActive ? { background: '#009A93' } : {}}>
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
          style={{ background: '#112624', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
          {pageTabs.map(t => (
            <NavLink key={t.to} to={t.to} end={t.end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-lg transition-all font-semibold ${
                  isActive ? 'text-navy' : 'text-u-muted hover:text-u-white'
                }`
              }
              style={({ isActive }) => isActive ? { background: '#009A93' } : {}}>
              {t.label}
            </NavLink>
          ))}
          {isHome && (
            <>
              <div className="my-1 border-t" style={{ borderColor: 'rgba(0,154,147,0.12)' }} />
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
