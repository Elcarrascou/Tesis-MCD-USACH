import lstmImg      from '../../assets/diagrama-lstm.png'
import xgboostImg   from '../../assets/diagrama-xgboost.png'
import prophetImg   from '../../assets/diagrama-prophet.jpg'
import rfImg        from '../../assets/diagrama-random-forest.jpg'

const models = [
  {
    num: '01',
    name: 'LSTM',
    fullName: 'Long Short-Term Memory',
    color: '#009A93',
    formula: 'hₜ = oₜ ⊙ tanh(Cₜ)',
    output: 'Predicción de precio futuro',
    image: lstmImg,
    imgAlt: 'Anatomía de una Red Neuronal Recurrente LSTM — Flujo de información y compuertas',
    description: `Las redes LSTM son un tipo de red neuronal recurrente diseñada para aprender dependencias a largo plazo en datos secuenciales. Cuentan con tres compuertas: olvido (decide qué información descartar del estado anterior), entrada (guarda nueva información relevante) y salida (filtra el estado de la celda para generar el estado oculto). Esta arquitectura la hace ideal para predecir series temporales financieras, capturando patrones históricos de precio y volatilidad de las acciones del IPSA influenciadas por el Dow Jones.`,
    points: [
      'Compuerta de olvido — descarta información irrelevante del pasado',
      'Compuerta de entrada — incorpora nueva información del mercado',
      'Estado de celda — "cinta transportadora" de memoria a largo plazo',
      'Compuerta de salida — genera la predicción de precio futuro',
    ],
  },
  {
    num: '02',
    name: 'XGBoost',
    fullName: 'Extreme Gradient Boosting',
    color: '#E37200',
    formula: 'ŷ = Σₖ fₖ(xᵢ),  fₖ ∈ F',
    output: 'Señal de compra / venta',
    image: xgboostImg,
    imgAlt: 'Arquitectura XGBoost — Entrenamiento secuencial de árboles de decisión',
    description: `XGBoost construye un ensamble de árboles de decisión de forma secuencial, donde cada árbol corrige los errores residuales del modelo anterior. Trabaja con variables mixtas como precio, volumen, volatilidad e indicadores técnicos para generar una señal de trading. Su eficiencia computacional y robustez ante datos financieros ruidosos lo convierten en uno de los modelos más utilizados en predicción financiera cuantitativa.`,
    points: [
      'Entrenamiento secuencial — cada árbol corrige el error del anterior',
      'Regularización L1/L2 — evita el sobreajuste en datos financieros',
      'Variables: precio, volumen, volatilidad, indicadores técnicos',
      'Salida: probabilidad de compra o venta (señal de trading)',
    ],
  },
  {
    num: '03',
    name: 'Prophet',
    fullName: 'Time Series Forecasting — Meta AI',
    color: '#1a7a3c',
    formula: 'y(t) = g(t) + s(t) + h(t) + ε',
    output: 'Tendencia y estacionalidad del mercado',
    image: prophetImg,
    imgAlt: 'Arquitectura del Modelo Prophet — Componentes de tendencia, estacionalidad y feriados',
    description: `Prophet descompone la serie temporal en tres componentes aditivos: tendencia g(t) que modela el crecimiento a largo plazo, estacionalidad s(t) que captura patrones cíclicos del mercado (diarios, semanales, anuales) y efectos de feriados h(t) como el cierre de bolsas. Esta transparencia y facilidad de interpretación lo hace muy valioso para presentar y explicar predicciones ante el comité evaluador del MCD.`,
    points: [
      'g(t) — tendencia: modela el crecimiento general del activo',
      's(t) — estacionalidad: captura ciclos del mercado financiero',
      'h(t) — feriados: ajusta cierres de bolsa y eventos especiales',
      'ε — ruido: variabilidad residual no explicada por el modelo',
    ],
  },
  {
    num: '04',
    name: 'Random Forest',
    fullName: 'Ensemble Classification (Bosque Aleatorio)',
    color: '#6b21a8',
    formula: 'ŷ_final = Ensemble{ŷ₁, ŷ₂, … ŷₜ}',
    output: 'Nivel de riesgo del activo',
    image: rfImg,
    imgAlt: 'Arquitectura del Modelo Random Forest — Votación mayoritaria de árboles individuales',
    description: `Random Forest construye múltiples árboles de decisión usando muestreo bootstrap (remuestreo con reemplazo) y subconjuntos aleatorios de características. La predicción final se obtiene por votación mayoritaria para clasificación o promedio para regresión. Clasifica el nivel de riesgo del activo (bajo/medio/alto) evaluando simultáneamente múltiples variables financieras, entregando al agente IA una señal confiable sobre el perfil de riesgo del portafolio.`,
    points: [
      'Muestreo Bootstrap — cada árbol se entrena con datos distintos',
      'Votación mayoritaria — decisión colectiva de N árboles',
      'Clasificación: riesgo bajo / medio / alto del activo',
      'Alta interpretabilidad — importancia de variables financieras',
    ],
  },
]

export default function MarcoTeorico() {
  return (
    <section id="marco-teorico" className="py-20 sm:py-24" style={{ background: '#f5fffe', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <div className="section-tag">04 — Marco Teórico</div>
        <h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
          Fundamentos de los modelos ML
        </h2>
        <p className="leading-[1.8] max-w-[720px] mb-12 sm:mb-16" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
          Cada modelo aporta una perspectiva única para el análisis del portafolio. A continuación se presenta
          la arquitectura teórica de cada uno, con énfasis en cómo procesan los datos financieros del mercado chileno (IPSA)
          y su influencia con el índice Dow Jones.
        </p>

        <div className="space-y-10 sm:space-y-14">
          {models.map((m, idx) => (
            <div key={m.num}
              className="rounded-[20px] overflow-hidden card-shadow"
              style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', borderTop: `4px solid ${m.color}` }}>

              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 px-6 sm:px-9 pt-7 pb-5"
                style={{ borderBottom: '1px solid rgba(0,154,147,0.1)' }}>
                <div className="flex items-center gap-4">
                  <div className="font-sans font-black text-[52px] leading-none" style={{ color: `${m.color}15` }}>{m.num}</div>
                  <div>
                    <div className="font-black leading-none mb-1" style={{ fontSize: 'clamp(20px,3vw,26px)', color: m.color }}>{m.name}</div>
                    <div className="font-mono text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: '#4f4f4f' }}>{m.fullName}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {/* Fórmula */}
                  <div className="font-mono text-[13px] sm:text-[14px] font-bold px-4 py-2 rounded-xl"
                    style={{ background: `${m.color}10`, border: `1px solid ${m.color}30`, color: m.color }}>
                    {m.formula}
                  </div>
                  {/* Output */}
                  <div className="font-semibold text-[13px]" style={{ color: '#4f4f4f' }}>
                    → <span style={{ color: m.color }}>{m.output}</span>
                  </div>
                </div>
              </div>

              {/* Content: description + diagram */}
              <div className={`grid grid-cols-1 ${idx % 2 === 0 ? 'lg:grid-cols-[1fr_1.6fr]' : 'lg:grid-cols-[1.6fr_1fr]'} gap-0`}>

                {/* Text side (alternates left/right) */}
                <div className={`px-6 sm:px-9 py-7 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <p className="leading-[1.8] mb-6" style={{ fontSize: 'clamp(14px,1.8vw,16px)', color: '#555555' }}>
                    {m.description}
                  </p>
                  <div className="space-y-2.5">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: m.color }}>
                      Componentes clave
                    </div>
                    {m.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: m.color }} />
                        <span className="leading-[1.6]" style={{ fontSize: '19px', color: '#555555' }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagram side */}
                <div className={`${idx % 2 !== 0 ? 'lg:order-1' : ''}`}
                  style={{ borderTop: '1px solid rgba(0,154,147,0.1)', borderLeft: idx % 2 === 0 ? '1px solid rgba(0,154,147,0.1)' : 'none', borderRight: idx % 2 !== 0 ? '1px solid rgba(0,154,147,0.1)' : 'none' }}>
                  <div className="overflow-x-auto" style={{ background: '#fafafa' }}>
                    <img
                      src={m.image}
                      alt={m.imgAlt}
                      className="w-full h-auto object-contain block"
                      style={{ minWidth: '320px', maxHeight: '420px', objectFit: 'contain', padding: '16px' }}
                    />
                  </div>
                  <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(0,154,147,0.08)', background: '#f5fffe' }}>
                    <span className="font-mono text-[11px] font-bold" style={{ color: '#4f4f4f' }}>{m.imgAlt}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

