import { Presentation, Clock, Grid } from 'lucide-react'
import { SLIDES, PRESENTATION_STATS } from '../data/presentation'

const STAT_ICONS = [<Presentation size={20} />, <Grid size={20} />, <Clock size={20} />]

export default function PresentacionPage() {
  return (
    <section className="min-h-screen py-20 sm:py-24" style={{ background: '#f5fffe' }}>
      <div className="wrap">
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 sm:px-5 py-2 font-mono text-[12px] sm:text-[13px] tracking-[0.05em] font-bold"
            style={{ background: 'rgba(0,154,147,0.08)', border: '1px solid rgba(0,154,147,0.3)', color: '#009A93' }}>
            <Clock size={13} />
            Láminas próximamente disponibles
          </div>
          <h1 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(32px,5vw,58px)', color: '#333333' }}>
            Presentación <span style={{ color: '#009A93' }}>MCD</span>
          </h1>
          <p className="leading-[1.8] max-w-[520px] mx-auto" style={{ fontSize: 'clamp(15px,2vw,17px)', color: '#4f4f4f' }}>
            Láminas de la presentación final del proyecto de título ante el comité evaluador
            del Magíster en Ciencia de Datos de la USACH.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 sm:gap-10 justify-center mb-10 sm:mb-12 p-5 sm:p-6 rounded-[16px] card-shadow"
          style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)' }}>
          {PRESENTATION_STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div style={{ color: '#009A93' }}>{STAT_ICONS[i]}</div>
              <div>
                <div className="font-sans font-black leading-none tabular-nums" style={{ fontSize: '26px', color: '#333333' }}>{s.val}</div>
                <div className="font-semibold mt-0.5" style={{ fontSize: '13px', color: '#4f4f4f' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {SLIDES.map(slide => (
            <div key={slide.num}
              className="aspect-[16/9] rounded-[12px] flex flex-col items-center justify-center gap-2 cursor-default card-shadow card-press"
              style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.12)', borderTop: `3px solid ${slide.color}` }}>
              <div className="font-mono text-[11px] sm:text-[12px] font-bold" style={{ color: slide.color }}>{slide.num}</div>
              <div className="text-center px-2 sm:px-3 leading-[1.3] font-semibold" style={{ fontSize: '12px', color: '#4f4f4f' }}>{slide.title}</div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 font-mono font-bold" style={{ fontSize: '13px', color: '#4f4f4f' }}>
          Las láminas serán cargadas una vez finalizadas
        </p>
      </div>
    </section>
  )
}

