import { Presentation, Clock, Grid } from 'lucide-react'

const slides = [
  { num: '01', title: 'Portada',               color: '#009A93' },
  { num: '02', title: 'Introducción',           color: '#E37200' },
  { num: '03', title: 'Problemática',           color: '#c084fc' },
  { num: '04', title: 'Hipótesis',              color: '#4ade80' },
  { num: '05', title: 'Marco Teórico',          color: '#00b5ad' },
  { num: '06', title: 'Arquitectura',           color: '#E37200' },
  { num: '07', title: 'Modelos ML',             color: '#009A93' },
  { num: '08', title: 'Agente IA',              color: '#c084fc' },
  { num: '09', title: 'Stack tecnológico',      color: '#4ade80' },
  { num: '10', title: 'Resultados esperados',   color: '#f08070' },
  { num: '11', title: 'Conclusiones',           color: '#009A93' },
  { num: '12', title: 'Preguntas',              color: '#6a9f9c' },
]

export default function PresentacionPage() {
  return (
    <section className="min-h-screen py-24">
      <div className="max-w-5xl mx-auto px-9">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.05em]"
            style={{ background: 'rgba(0,154,147,0.1)', border: '1px solid rgba(0,154,147,0.25)', color: '#00b5ad' }}>
            <Clock size={12} />
            Láminas próximamente disponibles
          </div>
          <h1 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
            Presentación <span style={{ color: '#009A93' }}>MCD</span>
          </h1>
          <p className="text-u-muted text-[15px] leading-[1.75] max-w-[520px] mx-auto">
            Láminas de la presentación final del proyecto de título ante el comité evaluador
            del Magíster en Ciencia de Datos de la USACH.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mb-12 p-5 rounded-[14px]"
          style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.12)' }}>
          {[
            { icon: <Presentation size={16} />, val: '12', label: 'Láminas planificadas' },
            { icon: <Grid size={16} />,         val: '6',  label: 'Secciones temáticas' },
            { icon: <Clock size={16} />,        val: '15', label: 'Minutos estimados' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3">
              <div style={{ color: '#009A93' }}>{s.icon}</div>
              <div>
                <div className="font-sans text-[22px] font-black text-u-white leading-none">{s.val}</div>
                <div className="text-[11px] text-u-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {slides.map(slide => (
            <div key={slide.num}
              className="aspect-[16/9] rounded-[10px] flex flex-col items-center justify-center gap-2 cursor-default transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${slide.color}40`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,154,147,0.1)')}>
              <div className="font-mono text-[10px]" style={{ color: slide.color }}>{slide.num}</div>
              <div className="text-[12px] text-center text-u-muted px-3 leading-[1.3]">{slide.title}</div>
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
