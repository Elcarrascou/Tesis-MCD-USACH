export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center py-24 sm:py-28 overflow-hidden"
      style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,154,147,0.15)' }}>
      <div className="absolute pointer-events-none" style={{
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,154,147,0.07) 0%, transparent 65%)',
        top: -150, right: -100,
      }} />

      <div className="wrap relative z-10 w-full">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 mb-8 rounded-full px-4 sm:px-5 py-2 font-mono text-[12px] sm:text-[13px] tracking-[0.05em] font-bold"
          style={{ background: 'rgba(0,154,147,0.08)', border: '1px solid rgba(0,154,147,0.3)', color: '#009A93' }}>
          <div className="w-2 h-2 rounded-full animate-blink flex-shrink-0" style={{ background: '#009A93' }} />
          Proyecto de Título — MCD 2026
        </div>

        {/* Title */}
        <h1 className="font-sans font-black leading-[1.05] tracking-tight mb-6"
          style={{ fontSize: 'clamp(36px,6vw,76px)', color: '#333333' }}>
          Portafolio de Inversiones<br />
          <span style={{ color: '#009A93' }}>Gestionado por IA</span>
        </h1>

        {/* Subtitle */}
        <p className="leading-[1.8] max-w-[600px] mb-12" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
          Aplicación web que integra un agente de inteligencia artificial con modelos de machine learning
          para analizar, predecir y apoyar la toma de decisiones en un portafolio de acciones bursátiles en tiempo real.
        </p>

        {/* Stats */}
        <div className="flex gap-8 sm:gap-12 flex-wrap pt-8 sm:pt-10" style={{ borderTop: '2px solid rgba(0,154,147,0.15)' }}>
          {[
            { val: '4',     label: 'Modelos ML',        color: '#009A93' },
            { val: '3',     label: 'Motores de IA',      color: '#E37200' },
            { val: '2',     label: 'Ámbitos académicos', color: '#333333' },
            { val: '~$136', label: 'USD / mes',          color: '#009A93' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-sans font-black tracking-tight leading-none" style={{ fontSize: 'clamp(28px,4vw,42px)', color: s.color }}>{s.val}</div>
              <div className="text-[12px] sm:text-[13px] tracking-[0.05em] mt-1 font-mono font-bold uppercase" style={{ color: '#4f4f4f' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

