const phases = [
  { phase: 'Fase 1', title: 'Setup & Configuración',         color: '#009A93', status: 'En progreso',
    desc: 'Inicialización del repositorio, configuración de Supabase, Alpaca API y entorno de desarrollo. Diseño del esquema de base de datos y arquitectura del sistema.' },
  { phase: 'Fase 2', title: 'Modelos de Machine Learning',   color: '#E37200', status: 'Próximo',
    desc: 'Extracción de datos históricos con Yahoo Finance. Entrenamiento y validación de los 4 modelos: LSTM, XGBoost, Prophet y Random Forest. Implementación del endpoint FastAPI.' },
  { phase: 'Fase 3', title: 'Integración del Agente IA',     color: '#6b21a8', status: 'Próximo',
    desc: 'Configuración de OpenClaw en Hostinger. Desarrollo de skills personalizadas para análisis de portafolio. Integración con Telegram/WhatsApp y conexión con los modelos ML.' },
  { phase: 'Fase 4', title: 'Desarrollo Frontend',           color: '#1a7a3c', status: 'Próximo',
    desc: 'Construcción de la aplicación web con React + Tailwind. Implementación de todas las vistas: Portafolio, Movimientos, Decisiones IA, Ganancias y Modelos ML.' },
  { phase: 'Fase 5', title: 'Testing & Optimización',        color: '#009A93', status: 'Próximo',
    desc: 'Backtesting de los modelos ML con datos históricos. Evaluación de rendimiento del agente IA. Ajuste de hiperparámetros y métricas de comparación.' },
  { phase: 'Fase 6', title: 'Documentación & Presentación',  color: '#E37200', status: 'Final',
    desc: 'Redacción del informe final de tesis. Preparación de láminas para la presentación ante el comité evaluador del Magíster en Ciencia de Datos.' },
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24" style={{ background: '#ffffff' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">06 — Roadmap</div>
        <h2 className="font-sans font-black mb-12" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#333333' }}>
          Fases de desarrollo
        </h2>

        <div className="relative pl-6">
          <div className="absolute left-[6px] top-2 bottom-2 w-0.5" style={{ background: 'rgba(0,154,147,0.25)' }} />
          {phases.map(p => (
            <div key={p.phase} className="relative pl-7 pb-10 last:pb-0">
              <div className="absolute left-[-17px] top-1.5 w-3.5 h-3.5 rounded-full border-2"
                style={{ borderColor: p.color, background: '#ffffff' }} />
              <div className="font-mono text-[11px] mb-1.5 tracking-[0.12em] uppercase font-bold" style={{ color: '#777777' }}>{p.phase}</div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[19px] font-bold" style={{ color: '#333333' }}>{p.title}</h3>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full font-bold"
                  style={{ background: `${p.color}12`, border: `1.5px solid ${p.color}40`, color: p.color }}>
                  {p.status}
                </span>
              </div>
              <p className="leading-[1.75] max-w-[660px]" style={{ fontSize: '15px', color: '#777777' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
