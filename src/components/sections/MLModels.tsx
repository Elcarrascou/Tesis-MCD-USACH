interface BarProps { label: string; value: string; percent: number; color: string }

const Bar = ({ label, value, percent, color }: BarProps) => (
  <div className="mt-3">
    <div className="flex justify-between font-mono text-[10px] mb-1" style={{ color: '#4a8a86' }}>
      <span>{label}</span><span style={{ color }}>{value}</span>
    </div>
    <div className="h-1 rounded-full" style={{ background: '#e8faf8' }}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
    </div>
  </div>
)

const models = [
  {
    num: '01', name: 'LSTM', nameColor: '#009A93',
    role: 'Long Short-Term Memory Network',
    desc: 'Red neuronal para series temporales. Aprende patrones históricos de precio y predice el valor futuro de un activo. Captura dependencias a largo plazo en datos del mercado.',
    target: '→ Predice precio futuro', targetColor: '#009A93',
    accentBorder: '#009A93',
    bars: [
      { label: 'Complejidad',       value: 'Alta', percent: 88, color: '#009A93' },
      { label: 'Interpretabilidad', value: 'Baja', percent: 22, color: '#c0392b' },
    ],
  },
  {
    num: '02', name: 'XGBoost', nameColor: '#E37200',
    role: 'Extreme Gradient Boosting',
    desc: 'Árboles de decisión potenciados. Trabaja con variables mixtas: precio, volumen, volatilidad e indicadores técnicos. Rápido, robusto y con gran rendimiento en datasets financieros.',
    target: '→ Señal compra / venta', targetColor: '#E37200',
    accentBorder: '#E37200',
    bars: [
      { label: 'Complejidad',       value: 'Media', percent: 58, color: '#E37200' },
      { label: 'Interpretabilidad', value: 'Media', percent: 62, color: '#E37200' },
    ],
  },
  {
    num: '03', name: 'Prophet', nameColor: '#16a34a',
    role: 'Time Series Forecasting — Meta AI',
    desc: 'Desarrollado por Meta para series temporales con estacionalidad y tendencias. Detecta ciclos del mercado y proyecta tendencias a mediano plazo. Muy fácil de interpretar y explicar al comité.',
    target: '→ Tendencia y estacionalidad', targetColor: '#16a34a',
    accentBorder: '#16a34a',
    bars: [
      { label: 'Complejidad',       value: 'Baja-Media', percent: 38, color: '#16a34a' },
      { label: 'Interpretabilidad', value: 'Alta',       percent: 87, color: '#22c55e' },
    ],
  },
  {
    num: '04', name: 'Random Forest', nameColor: '#7c3aed',
    role: 'Ensemble Classification',
    desc: 'Clasifica el nivel de riesgo del activo (bajo / medio / alto) evaluando múltiples variables en paralelo. Genera señales de zona: compra, venta o mantener, considerando el perfil de riesgo.',
    target: '→ Nivel de riesgo del activo', targetColor: '#7c3aed',
    accentBorder: '#7c3aed',
    bars: [
      { label: 'Complejidad',       value: 'Media', percent: 50, color: '#7c3aed' },
      { label: 'Interpretabilidad', value: 'Alta',  percent: 82, color: '#a855f7' },
    ],
  },
]

export default function MLModels() {
  return (
    <section id="ml" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)', background: '#ffffff' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">03 — Machine Learning</div>
        <h2 className="font-sans font-black mb-3.5 text-u-white" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Cuatro modelos, una decisión
        </h2>
        <p className="text-[15px] leading-[1.8] max-w-[660px] mb-10" style={{ color: '#4a8a86' }}>
          Cada modelo aporta una perspectiva diferente. FastAPI consolida las 4 predicciones y OpenClaw
          las pondera para generar la recomendación final.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map(m => (
            <div key={m.num}
              className="rounded-[14px] p-6 cursor-default transition-all duration-200 hover:-translate-y-0.5 card-shadow"
              style={{ background: '#f4fefd', border: '1px solid rgba(0,154,147,0.12)', borderTop: `3px solid ${m.accentBorder}` }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,154,147,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
              <div className="font-sans text-[48px] font-black leading-none mb-1" style={{ color: 'rgba(0,154,147,0.08)' }}>{m.num}</div>
              <div className="text-[17px] font-bold mb-0.5" style={{ color: m.nameColor }}>{m.name}</div>
              <div className="font-mono text-[10px] mb-3 tracking-[0.07em]" style={{ color: '#4a8a86' }}>{m.role}</div>
              <p className="text-[13px] leading-[1.65]" style={{ color: '#4a8a86' }}>{m.desc}</p>
              <p className="mt-3.5 text-[12px] font-bold" style={{ color: m.targetColor }}>{m.target}</p>
              {m.bars.map(b => <Bar key={b.label} {...b} />)}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[14px] p-6 card-shadow" style={{ background: '#e8faf8', border: '1px solid rgba(0,154,147,0.25)' }}>
          <h3 className="text-[17px] font-bold mb-3 text-u-white">Flujo de consolidación de predicciones</h3>
          <p className="font-mono text-[13px] leading-[2]" style={{ color: '#4a8a86' }}>
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
