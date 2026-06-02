import type { ModelBar } from '../../types'
import { ML_MODELS } from '../../data/models'
import Reveal from '../ui/Reveal'

// Emil: animamos con transform (no width) — GPU, sin layout reflow
// overflow-hidden en el track para clip limpio del fill
const Bar = ({ label, value, percent, color, cardDelay = 0 }: ModelBar & { cardDelay?: number }) => (
  <div className="mt-3.5">
    <div className="flex justify-between font-mono text-[12px] mb-1.5 font-bold" style={{ color: '#4f4f4f' }}>
      <span>{label}</span><span style={{ color }}>{value}</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,154,147,0.1)' }}>
      <div
        className="h-full rounded-full bar-fill"
        style={{ width: `${percent}%`, background: color, animationDelay: `${cardDelay + 350}ms` }}
      />
    </div>
  </div>
)

export default function MLModels() {
  return (
    <section id="ml" className="py-20 sm:py-24" style={{ background: '#f5fffe', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <Reveal><div className="section-tag">03 — Machine Learning</div></Reveal>
        <Reveal delay={50}>
          <h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
            Cuatro modelos, una decisión
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="leading-[1.8] max-w-[680px] mb-10 sm:mb-12" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
            Cada modelo aporta una perspectiva diferente. FastAPI consolida las 4 predicciones y OpenClaw
            las pondera para generar la recomendación final.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {ML_MODELS.map((m, i) => {
            const cardDelay = i * 70
            return (
              <Reveal key={m.num} delay={cardDelay}>
                <div
                  className="h-full rounded-[16px] p-6 sm:p-7 card-shadow card-press"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.1)', borderTop: `3px solid ${m.color}` }}>
                  <div className="font-sans font-black leading-none mb-2" style={{ fontSize: '52px', color: 'rgba(0,154,147,0.07)' }}>{m.num}</div>
                  <div className="font-bold mb-0.5" style={{ fontSize: '19px', color: m.color }}>{m.name}</div>
                  <div className="font-mono text-[14px] mb-4 tracking-[0.05em] font-bold uppercase" style={{ color: '#4f4f4f' }}>{m.role}</div>
                  <p className="leading-[1.7]" style={{ fontSize: '17px', color: '#4f4f4f' }}>{m.shortDesc}</p>
                  <p className="mt-4 font-bold" style={{ fontSize: '17px', color: m.color }}>{m.target}</p>
                  {m.bars.map(b => <Bar key={b.label} {...b} cardDelay={cardDelay} />)}
                </div>
              </Reveal>
            )
          })}
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

