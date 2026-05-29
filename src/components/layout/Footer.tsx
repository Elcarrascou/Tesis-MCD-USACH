import logoUsach from '../../assets/logoUsach.webp'

export default function Footer() {
  return (
    <footer style={{ background: '#1a2e2d', borderTop: '1px solid rgba(0,154,147,0.2)' }}>
      <div className="max-w-5xl mx-auto px-9 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={logoUsach} alt="USACH" className="h-9 w-auto object-contain" />
          <div className="border-l border-white/20 pl-4">
            <p className="text-[12px] font-bold tracking-[0.08em] uppercase leading-none mb-1" style={{ color: '#009A93' }}>
              Magíster en Ciencia de Datos
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Universidad de Santiago de Chile · 2026
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Portafolio de Inversiones Gestionado por IA
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Proyecto de Título · D. Carrasco U.
          </p>
        </div>
      </div>
      {/* Bottom accent bar */}
      <div className="h-0.5" style={{ background: 'linear-gradient(90deg,#009A93,#E37200,#009A93)' }} />
    </footer>
  )
}
