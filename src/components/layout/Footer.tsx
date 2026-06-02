import { NavLink } from 'react-router-dom'
import logoUsach from '../../assets/logoUsach.webp'

export default function Footer() {
  return (
    <footer style={{ background: '#333333' }}>
      <div className="wrap py-8 sm:py-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-4">
        {/* Logo → home */}
        <NavLink to="/" end aria-label="Ir al inicio" className="flex items-center gap-3 sm:gap-4 rounded-lg press p-1 -m-1">
          <img src={logoUsach} alt="USACH" className="h-9 sm:h-10 w-auto object-contain" />
          <div className="border-l border-white/20 pl-3 sm:pl-4">
            <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.08em] uppercase leading-none mb-1.5" style={{ color: '#009A93' }}>
              Magíster en Ciencia de Datos
            </p>
            <p className="text-[11px] sm:text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Universidad de Santiago de Chile · 2026
            </p>
          </div>
        </NavLink>

        <div className="sm:text-right">
          <p className="text-[13px] sm:text-[14px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Portafolio de Inversiones Gestionado por IA
          </p>
          <p className="text-[11px] sm:text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Proyecto de Título · D. Carrasco U.
          </p>
        </div>
      </div>
      <div className="h-0.5" style={{ background: 'linear-gradient(90deg,#009A93,#E37200,#009A93)' }} />
    </footer>
  )
}
