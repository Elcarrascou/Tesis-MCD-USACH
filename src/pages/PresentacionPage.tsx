import { Presentation, Clock, Grid } from 'lucide-react'

const placeholderSlides = [
  { num: '01', title: 'Portada',               color: '#e8a400' },
  { num: '02', title: 'Introducción',           color: '#7aadff' },
  { num: '03', title: 'Problemática',           color: '#c084fc' },
  { num: '04', title: 'Hipótesis',              color: '#4ade80' },
  { num: '05', title: 'Marco Teórico',          color: '#f5bc2e' },
  { num: '06', title: 'Arquitectura',           color: '#7aadff' },
  { num: '07', title: 'Modelos ML',             color: '#e8a400' },
  { num: '08', title: 'Agente IA',              color: '#c084fc' },
  { num: '09', title: 'Stack tecnológico',      color: '#4ade80' },
  { num: '10', title: 'Resultados esperados',   color: '#f08070' },
  { num: '11', title: 'Conclusiones',           color: '#e8a400' },
  { num: '12', title: 'Preguntas',              color: '#7b90b0' },
]

export default function PresentacionPage() {
  return (
    <section className="min-h-screen py-24">
      <div className="max-w-5xl mx-auto px-9">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.05em]"
            style={{ background: 'rgba(232,164,0,0.08)', border: '1px solid rgba(232,164,0,0.2)', color: '#f5bc2e' }}>
            <Clock size={12} />
            Láminas próximamente disponibles
          </div>
          <h1 className="font-cond font-bold mb-4" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
            Presentación <span className="text-u-gold">MCD</span>
          </h1>
          <p className="text-u-muted text-[15px] leading-[1.75] max-w-[520px] mx-auto">
            Láminas de la presentación final del proyecto de título ante el comité evaluador
            del Magíster en Ciencia de Datos de la USACH.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 justify-center mb-12 p-5 rounded-[14px]"
          style={{ background: '#101929', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { icon: <Presentation size={16} />, val: '12', label: 'Láminas planificadas' },
            { icon: <Grid size={16} />,         val: '6',  label: 'Secciones temáticas' },
            { icon: <Clock size={16} />,        val: '15', label: 'Minutos estimados' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="text-u-gold">{s.icon}</div>
              <div>
                <div className="font-cond text-[22px] font-bold text-u-white leading-none">{s.val}</div>
                <div className="text-[11px] text-u-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide grid (placeholder) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {placeholderSlides.map(slide => (
            <div key={slide.num}
              className="aspect-[16/9] rounded-[10px] flex flex-col items-center justify-center gap-2 cursor-default transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#101929', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="font-mono text-[10px]" style={{ color: slide.color }}>{slide.num}</div>
              <div className="text-[12px] text-center text-u-muted px-3 leading-[1.3]">{slide.title}</div>
              {/* Placeholder bars */}
              <div className="flex flex-col gap-1 w-3/4 mt-1">
                <div className="h-0.5 rounded-full opacity-20" style={{ background: slide.color }} />
                <div className="h-0.5 rounded-full opacity-15 w-3/4" style={{ background: slide.color }} />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] text-u-muted font-mono mt-8">
          Las láminas serán cargadas una vez finalizadas
        </p>
      </div>
    </section>
  )
}
