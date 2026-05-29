const phases = [
  { phase: 'Fase 1', title: 'Setup & Configuración',         color: '#009A93', status: 'En progreso',
    desc: 'Inicialización del repositorio, configuración de Supabase, Alpaca API y entorno de desarrollo. Diseño del esquema de base de datos y arquitectura del sistema.' },
  { phase: 'Fase 2', title: 'Modelos de Machine Learning',   color: '#E37200', status: 'Próximo',
    desc: 'Extracción de datos históricos con Yahoo Finance. Entrenamiento y validación de los 4 modelos: LSTM, XGBoost, Prophet y Random Forest. Implementación del endpoint FastAPI.' },
  { phase: 'Fase 3', title: 'Integración del Agente IA',     color: '#7c3aed', status: 'Próximo',
    desc: 'Configuración de OpenClaw en Hostinger. Desarrollo de skills personalizadas para análisis de portafolio. Integración con Telegram/WhatsApp y conexión con los modelos ML.' },
  { phase: 'Fase 4', title: 'Desarrollo Frontend',           color: '#16a34a', status: 'Próximo',
    desc: 'Construcción de la aplicación web con React + Tailwind. Implementación de todas las vistas: Portafolio, Movimientos, Decisiones IA, Ganancias y Modelos ML.' },
  { phase: 'Fase 5', title: 'Testing & Optimización',        color: '#00b5ad', status: 'Próximo',
    desc: 'Backtesting de los modelos ML con datos históricos. Evaluación de rendimiento del agente IA. Ajuste de hiperparámetros y métricas de comparación.' },
  { phase: 'Fase 6', title: 'Documentación & Presentación',  color: '#b53e30', status: 'Final',
    desc: 'Redacción del informe final de tesis. Preparación de láminas para la presentación ante el comité evaluador del Magíster en Ciencia de Datos.' },
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24" style={{ background: '#f4fefd' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">06 — Roadmap</div>
        <h2 className="font-sans font-black mb-10 text-u-white" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Fases de desarrollo
        </h2>

        <div className="relative pl-5">
          <div className="absolute left-[5px] top-2 bottom-2 w-px" style={{ background: 'rgba(0,154,147,0.25)' }} />
          {phases.map(p => (
            <div key={p.phase} className="relative pl-6 pb-8 last:pb-0">
              <div className="absolute left-[-17px] top-1 w-3 h-3 rounded-full border-2"
                style={{ borderColor: p.color, background: '#ffffff' }} />
              <div className="font-mono text-[10px] mb-1 tracking-[0.12em] uppercase" style={{ color: '#4a8a86' }}>{p.phase}</div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h3 className="text-[17px] font-bold text-u-white">{p.title}</h3>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                  style={{ background: `${p.color}15`, border: `1px solid ${p.color}40`, color: p.color }}>
                  {p.status}
                </span>
              </div>
              <p className="text-[13px] leading-[1.65] max-w-[640px]" style={{ color: '#4a8a86' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
