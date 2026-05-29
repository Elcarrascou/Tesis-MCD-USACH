const UsachShieldSm = () => (
  <svg width="28" height="32" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2L34 8V22C34 30 18 38 18 38C18 38 2 30 2 22V8L18 2Z" fill="#007a74" stroke="#009A93" strokeWidth="1.5"/>
    <path d="M18 6L30 10.5V22C30 28 18 34 18 34C18 34 6 28 6 22V10.5L18 6Z" fill="#006b65"/>
    <rect x="9" y="13" width="8" height="8" rx="1" fill="#009A93" opacity="0.95"/>
    <rect x="19" y="13" width="8" height="8" rx="1" fill="#E37200" opacity="0.85"/>
    <rect x="9" y="23" width="8" height="5" rx="1" fill="#E37200" opacity="0.85"/>
    <rect x="19" y="23" width="8" height="5" rx="1" fill="#009A93" opacity="0.95"/>
    <line x1="18" y1="13" x2="18" y2="28" stroke="white" strokeWidth="0.8" opacity="0.5"/>
    <line x1="9" y1="21" x2="27" y2="21" stroke="white" strokeWidth="0.8" opacity="0.5"/>
  </svg>
)

export default function Footer() {
  return (
    <footer style={{ background: '#e8faf8', borderTop: '1px solid rgba(0,154,147,0.18)' }}>
      <div className="max-w-5xl mx-auto px-9 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UsachShieldSm />
          <div>
            <p className="font-sans text-[12px] font-bold tracking-[0.1em] uppercase leading-none mb-0.5" style={{ color: '#009A93' }}>USACH</p>
            <p className="text-[11px]" style={{ color: '#4a8a86' }}>Magíster en Ciencia de Datos · 2026</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-mono font-medium" style={{ color: '#4a8a86' }}>Portafolio de Inversiones Gestionado por IA</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#4a8a86' }}>Proyecto de Título · D. Carrasco U.</p>
        </div>
      </div>
    </footer>
  )
}
