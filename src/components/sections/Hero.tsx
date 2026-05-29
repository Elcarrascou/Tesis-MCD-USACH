export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center py-28 overflow-hidden"
      style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      {/* Teal glow */}
      <div className="absolute pointer-events-none" style={{
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,154,147,0.15) 0%, transparent 70%)',
        top: -100, right: -100,
      }} />
      {/* Orange glow */}
      <div className="absolute pointer-events-none" style={{
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(227,114,0,0.08) 0%, transparent 70%)',
        bottom: 0, left: 200,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-9 w-full">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 mb-7 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.05em]"
          style={{ background: 'rgba(0,154,147,0.1)', border: '1px solid rgba(0,154,147,0.25)', color: '#00b5ad' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: '#009A93' }} />
          Proyecto de Título — MCD 2026
        </div>

        {/* Title */}
        <h1 className="font-sans font-black leading-[1.05] tracking-tight mb-5"
          style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
          Portafolio de Inversiones<br />
          <span style={{ color: '#009A93' }}>Gestionado por IA</span>
        </h1>

        {/* Subtitle */}
        <p className="text-u-muted text-base leading-[1.75] max-w-[580px] mb-12">
          Aplicación web que integra un agente de inteligencia artificial con modelos de machine learning
          para analizar, predecir y apoyar la toma de decisiones en un portafolio de acciones bursátiles en tiempo real.
        </p>

        {/* Stats */}
        <div className="flex gap-11 flex-wrap pt-9" style={{ borderTop: '1px solid rgba(0,154,147,0.15)' }}>
          {[
            { val: '4',     label: 'Modelos ML',          color: '#009A93' },
            { val: '3',     label: 'Motores de IA',        color: '#E37200' },
            { val: '2',     label: 'Ámbitos académicos',   color: '#e8f5f4' },
            { val: '~$136', label: 'USD / mes',            color: '#009A93' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-sans text-[34px] font-black tracking-tight leading-none" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[11px] text-u-muted tracking-[0.05em] mt-0.5 font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
