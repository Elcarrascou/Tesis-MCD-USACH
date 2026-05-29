interface BarProps { label: string; value: string; percent: number; color: string }

const Bar = ({ label, value, percent, color }: BarProps) => (
  <div className="mt-3.5">
    <div className="flex justify-between font-mono text-[12px] mb-1.5 font-bold" style={{ color: '#4f4f4f' }}>
      <span>{label}</span><span style={{ color }}>{value}</span>
    </div>
    <div className="h-1.5 rounded-full" style={{ background: 'rgba(0,154,147,0.1)' }}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
    </div>
  </div>
)

const models = [
  {
    num: '01', name: 'LSTM', nameColor: '#009A93', accentBorder: '#009A93',
    role: 'Long Short-Term Memory Network',
    desc: 'Red neuronal para series temporales. Aprende patrones históricos de precio y predice el valor futuro de un activo. Captura dependencias a largo plazo en datos del mercado.',
    target: '→ Predice precio futuro', targetColor: '#009A93',
    bars: [
      { label: 'Complejidad',       value: 'Alta', percent: 88, color: '#009A93' },
      { label: 'Interpretabilidad', value: 'Baja', percent: 22, color: '#E37200' },
    ],
  },
  {
    num: '02', name: 'XGBoost', nameColor: '#E37200', accentBorder: '#E37200',
    role: 'Extreme Gradient Boosting',
    desc: 'Árboles de decisión potenciados. Trabaja con variables mixtas: precio, volumen, volatilidad e indicadores técnicos. Rápido, robusto y con gran rendimiento en datasets financieros.',
    target: '→ Señal compra / venta', targetColor: '#E37200',
    bars: [
      { label: 'Complejidad',       value: 'Media', percent: 58, color: '#E37200' },
      { label: 'Interpretabilidad', value: 'Media', percent: 62, color: '#E37200' },
    ],
  },
  {
    num: '03', name: 'Prophet', nameColor: '#1a7a3c', accentBorder: '#1a7a3c',
    role: 'Time Series Forecasting — Meta AI',
    desc: 'Desarrollado por Meta para series temporales con estacionalidad y tendencias. Detecta ciclos del mercado y proyecta tendencias a mediano plazo. Muy fácil de interpretar y explicar al comité.',
    target: '→ Tendencia y estacionalidad', targetColor: '#1a7a3c',
    bars: [
      { label: 'Complejidad',       value: 'Baja-Media', percent: 38, color: '#1a7a3c' },
      { label: 'Interpretabilidad', value: 'Alta',       percent: 87, color: '#22c55e' },
    ],
  },
  {
    num: '04', name: 'Random Forest', nameColor: '#6b21a8', accentBorder: '#6b21a8',
    role: 'Ensemble Classification',
    desc: 'Clasifica el nivel de riesgo del activo (bajo / medio / alto) evaluando múltiples variables en paralelo. Genera señales de zona: compra, venta o mantener, considerando el perfil de riesgo.',
    target: '→ Nivel de riesgo del activo', targetColor: '#6b21a8',
    bars: [
      { label: 'Complejidad',       value: 'Media', percent: 50, color: '#7c3aed' },
      { label: 'Interpretabilidad', value: 'Alta',  percent: 82, color: '#a855f7' },
    ],
  },
]

export default function MLModels() {
  return (
    <section id="ml" className="py-20 sm:py-24" style={{ background: '#f5fffe', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <div className="section-tag">03 — Machine Learning</div>
        <h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
          Cuatro modelos, una decisión
        </h2>
        <p className="leading-[1.8] max-w-[680px] mb-10 sm:mb-12" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
          Cada modelo aporta una perspectiva diferente. FastAPI consolida las 4 predicciones y OpenClaw
          las pondera para generar la recomendación final.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {models.map(m => (
            <div key={m.num}
              className="rounded-[16px] p-6 sm:p-7 transition-all duration-200 hover:-translate-y-0.5 card-shadow"
              style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.1)', borderTop: `3px solid ${m.accentBorder}` }}>
              <div className="font-sans font-black leading-none mb-2" style={{ fontSize: '52px', color: 'rgba(0,154,147,0.07)' }}>{m.num}</div>
              <div className="font-bold mb-0.5" style={{ fontSize: '19px', color: m.nameColor }}>{m.name}</div>
              <div className="font-mono text-[11px] mb-4 tracking-[0.07em] font-bold uppercase" style={{ color: '#4f4f4f' }}>{m.role}</div>
              <p className="leading-[1.7]" style={{ fontSize: '15px', color: '#4f4f4f' }}>{m.desc}</p>
              <p className="mt-4 font-bold" style={{ fontSize: '14px', color: m.targetColor }}>{m.target}</p>
              {m.bars.map(b => <Bar key={b.label} {...b} />)}
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-7 rounded-[16px] p-6 sm:p-7 card-shadow" style={{ background: '#ffffff', border: '2px solid rgba(0,154,147,0.2)' }}>
          <h3 className="font-bold mb-4" style={{ fontSize: '18px', color: '#333333' }}>Flujo de consolidación de predicciones</h3>
          <div className="overflow-x-auto">
            <p className="font-mono leading-[2.2] whitespace-nowrap" style={{ fontSize: '13px', color: '#4f4f4f' }}>
              Yahoo Finance (datos históricos) → entrenamiento de los 4 modelos<br />
              LSTM → precio futuro &nbsp;|&nbsp; XGBoost → señal compra/venta &nbsp;|&nbsp; Prophet → tendencia &nbsp;|&nbsp; Random Forest → riesgo<br />
              FastAPI consolida las 4 predicciones → OpenClaw (IA) pondera y genera recomendación<br />
              App Web muestra resultado + confianza → usuario ejecuta en Alpaca
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

