import { Presentation, Clock, Grid } from 'lucide-react'

const slides = [
  { num: '01', title: 'Portada',               color: '#009A93' },
  { num: '02', title: 'Introducción',           color: '#E37200' },
  { num: '03', title: 'Problemática',           color: '#7c3aed' },
  { num: '04', title: 'Hipótesis',              color: '#16a34a' },
  { num: '05', title: 'Marco Teórico',          color: '#00b5ad' },
  { num: '06', title: 'Arquitectura',           color: '#E37200' },
  { num: '07', title: 'Modelos ML',             color: '#009A93' },
  { num: '08', title: 'Agente IA',              color: '#7c3aed' },
  { num: '09', title: 'Stack tecnológico',      color: '#16a34a' },
  { num: '10', title: 'Resultados esperados',   color: '#b53e30' },
  { num: '11', title: 'Conclusiones',           color: '#009A93' },
  { num: '12', title: 'Preguntas',              color: '#4a8a86' },
]

export default function PresentacionPage() {
  return (
    <section className="min-h-screen py-24" style={{ background: '#f4fefd' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.05em] font-bold"
            style={{ background: 'rgba(0,154,147,0.1)', border: '1px solid rgba(0,154,147,0.3)', color: '#009A93' }}>
            <Clock size={12} />
            Láminas próximamente disponibles
          </div>
          <h1 className="font-sans font-black mb-4 text-u-white" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
            Presentación <span style={{ color: '#009A93' }}>MCD</span>
          </h1>
          <p className="text-[15px] leading-[1.8] max-w-[520px] mx-auto" style={{ color: '#4a8a86' }}>
            Láminas de la presentación final del proyecto de título ante el comité evaluador
            del Magíster en Ciencia de Datos de la USACH.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mb-12 p-6 rounded-[14px] card-shadow"
          style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)' }}>
          {[
            { icon: <Presentation size={18} />, val: '12', label: 'Láminas planificadas' },
            { icon: <Grid size={18} />,         val: '6',  label: 'Secciones temáticas' },
            { icon: <Clock size={18} />,        val: '15', label: 'Minutos estimados' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3">
              <div style={{ color: '#009A93' }}>{s.icon}</div>
              <div>
                <div className="font-sans text-[24px] font-black text-u-white leading-none">{s.val}</div>
                <div className="text-[11px] font-medium" style={{ color: '#4a8a86' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {slides.map(slide => (
            <div key={slide.num}
              className="aspect-[16/9] rounded-[12px] flex flex-col items-center justify-center gap-2 cursor-default transition-all duration-200 hover:-translate-y-0.5 card-shadow"
              style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.12)', borderTop: `3px solid ${slide.color}` }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,154,147,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
              <div className="font-mono text-[10px] font-bold" style={{ color: slide.color }}>{slide.num}</div>
              <div className="text-[12px] text-center px-3 leading-[1.3] font-semibold" style={{ color: '#4a8a86' }}>{slide.title}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] mt-8 font-mono font-medium" style={{ color: '#4a8a86' }}>
          Las láminas serán cargadas una vez finalizadas
        </p>
      </div>
    </section>
  )
}
