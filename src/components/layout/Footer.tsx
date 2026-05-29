const UsachShieldSm = () => (
  <svg width="28" height="32" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default function Footer() {
  return (
    <footer className="relative z-10" style={{ background: '#101929', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-9 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UsachShieldSm />
          <div>
            <p className="font-cond text-[12px] font-semibold tracking-[0.1em] uppercase text-u-gold leading-none mb-0.5">USACH</p>
            <p className="text-[11px] text-u-muted">Magíster en Ciencia de Datos · 2026</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-u-muted font-mono">Portafolio de Inversiones Gestionado por IA</p>
          <p className="text-[11px] text-u-muted mt-0.5">Proyecto de Título · D. Carrasco U.</p>
        </div>
      </div>
    </footer>
  )
}
