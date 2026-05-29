interface BarProps { label: string; value: string; percent: number; color: string }

const Bar = ({ label, value, percent, color }: BarProps) => (
  <div className="mt-3">
    <div className="flex justify-between font-mono text-[10px] text-u-muted mb-1">
      <span>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
    <div className="h-0.5 rounded-full" style={{ background: '#16233a' }}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
    </div>
  </div>
)

const models = [
  {
    num: '01', name: 'LSTM', nameColor: '#e8a400',
    role: 'Long Short-Term Memory Network',
    desc: 'Red neuronal para series temporales. Aprende patrones históricos de precio y predice el valor futuro de un activo. Captura dependencias a largo plazo en datos del mercado.',
    target: '→ Predice precio futuro', targetColor: '#e8a400',
    bars: [
      { label: 'Complejidad',      value: 'Alta',  percent: 88, color: '#e8a400' },
      { label: 'Interpretabilidad', value: 'Baja',  percent: 22, color: '#c0392b' },
    ],
  },
  {
    num: '02', name: 'XGBoost', nameColor: '#7aadff',
    role: 'Extreme Gradient Boosting',
    desc: 'Árboles de decisión potenciados. Trabaja con variables mixtas: precio, volumen, volatilidad e indicadores técnicos. Rápido, robusto y con gran rendimiento en datasets financieros.',
    target: '→ Señal compra / venta', targetColor: '#7aadff',
    bars: [
      { label: 'Complejidad',      value: 'Media', percent: 58, color: '#1a56c8' },
      { label: 'Interpretabilidad', value: 'Media', percent: 62, color: '#1a56c8' },
    ],
  },
  {
    num: '03', name: 'Prophet', nameColor: '#4ade80',
    role: 'Time Series Forecasting — Meta AI',
    desc: 'Desarrollado por Meta para series temporales con estacionalidad y tendencias. Detecta ciclos del mercado y proyecta tendencias a mediano plazo. Muy fácil de interpretar y explicar al comité.',
    target: '→ Tendencia y estacionalidad', targetColor: '#4ade80',
    bars: [
      { label: 'Complejidad',      value: 'Baja-Media', percent: 38, color: '#16a34a' },
      { label: 'Interpretabilidad', value: 'Alta',       percent: 87, color: '#22c55e' },
    ],
  },
  {
    num: '04', name: 'Random Forest', nameColor: '#c084fc',
    role: 'Ensemble Classification',
    desc: 'Clasifica el nivel de riesgo del activo (bajo / medio / alto) evaluando múltiples variables en paralelo. Genera señales de zona: compra, venta o mantener, considerando el perfil de riesgo.',
    target: '→ Nivel de riesgo del activo', targetColor: '#c084fc',
    bars: [
      { label: 'Complejidad',      value: 'Media', percent: 50, color: '#7c3aed' },
      { label: 'Interpretabilidad', value: 'Alta',  percent: 82, color: '#a855f7' },
    ],
  },
]

export default function MLModels() {
  return (
    <section id="ml" className="py-24" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">03 — Machine Learning</div>
        <h2 className="font-cond font-semibold mb-3.5" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Cuatro modelos, una decisión
        </h2>
        <p className="text-u-muted text-[15px] leading-[1.75] max-w-[660px] mb-10">
          Cada modelo aporta una perspectiva diferente. FastAPI consolida las 4 predicciones y OpenClaw
          las pondera para generar la recomendación final.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map(m => (
            <div key={m.num} className="rounded-[14px] p-6 cursor-default transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#101929', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
              <div className="font-cond text-[48px] font-bold leading-none mb-1" style={{ color: 'rgba(255,255,255,0.06)' }}>{m.num}</div>
              <div className="text-[17px] font-semibold mb-0.5" style={{ color: m.nameColor }}>{m.name}</div>
              <div className="font-mono text-[10px] text-u-muted mb-3 tracking-[0.07em]">{m.role}</div>
              <p className="text-[13px] text-u-muted leading-[1.65]">{m.desc}</p>
              <p className="mt-3.5 text-[12px] font-medium" style={{ color: m.targetColor }}>{m.target}</p>
              {m.bars.map(b => <Bar key={b.label} {...b} />)}
            </div>
          ))}
        </div>

        {/* Flow summary */}
        <div className="mt-6 rounded-[14px] p-6" style={{ background: 'rgba(232,164,0,0.04)', border: '1px solid rgba(232,164,0,0.15)' }}>
          <h3 className="text-[17px] font-semibold mb-3">Flujo de consolidación de predicciones</h3>
          <p className="font-mono text-[13px] text-u-muted leading-[2]">
            Yahoo Finance (datos históricos) → entrenamiento de los 4 modelos<br />
            LSTM → precio futuro &nbsp;|&nbsp; XGBoost → señal compra/venta &nbsp;|&nbsp; Prophet → tendencia &nbsp;|&nbsp; Random Forest → riesgo<br />
            FastAPI consolida las 4 predicciones → OpenClaw (IA) pondera y genera recomendación<br />
            App Web muestra resultado + confianza → usuario ejecuta en Alpaca
          </p>
        </div>
      </div>
    </section>
  )
}
