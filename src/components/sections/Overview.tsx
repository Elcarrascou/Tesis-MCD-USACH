import { APP_VIEWS } from '../../data/architecture'
import Reveal from '../ui/Reveal'

const Tag = ({ label }: { label: string }) => (
  <span className="inline-block font-mono text-[12px] px-2.5 py-1 rounded mr-1.5 mb-1.5 font-bold"
    style={{ background: 'rgba(0,154,147,0.1)', border: '1px solid rgba(0,154,147,0.3)', color: '#009A93' }}>
    {label}
  </span>
)

export default function Overview() {
  return (
    <section id="overview" className="py-20 sm:py-24" style={{ background: '#f5fffe', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <Reveal><div className="section-tag">01 — Visión general</div></Reveal>
        <Reveal delay={50}><h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>¿Qué construimos?</h2></Reveal>
        <Reveal delay={100}>
          <p className="leading-[1.8] max-w-[700px] mb-10 sm:mb-12" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
            Una plataforma inteligente que conecta datos del mercado bursátil con modelos predictivos y un agente de IA,
            permitiendo monitorear y tomar decisiones de inversión asistidas desde cualquier dispositivo.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-12">
          <Reveal delay={0}>
            <div className="h-full rounded-[16px] p-6 sm:p-7 card-shadow" style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', borderLeft: '4px solid #009A93' }}>
              <div className="section-tag">Ámbito 1</div>
              <h3 className="font-bold mb-3.5" style={{ fontSize: '18px', color: '#333333' }}>🤖 Inteligencia Artificial</h3>
              <p className="leading-[1.75]" style={{ fontSize: '17px', color: '#4f4f4f' }}>
                Agente OpenClaw hosteado en Hostinger que analiza el portafolio diariamente, interpreta eventos de mercado
                y genera recomendaciones en lenguaje natural via Telegram o WhatsApp.
              </p>
              <div className="mt-5">{['OpenClaw','Claude','OpenAI','Ollama','Qwen'].map(t => <Tag key={t} label={t} />)}</div>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="h-full rounded-[16px] p-6 sm:p-7 card-shadow" style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', borderLeft: '4px solid #E37200' }}>
              <div className="section-tag" style={{ color: '#E37200' }}>Ámbito 2</div>
              <h3 className="font-bold mb-3.5" style={{ fontSize: '18px', color: '#333333' }}>📊 Machine Learning</h3>
              <p className="leading-[1.75]" style={{ fontSize: '17px', color: '#4f4f4f' }}>
                Cuatro modelos entrenados con datos históricos de Yahoo Finance que predicen precios, generan señales
                de compra/venta, detectan tendencias y clasifican el riesgo del portafolio.
              </p>
              <div className="mt-5">{['LSTM','XGBoost','Prophet','Random Forest'].map(t => <Tag key={t} label={t} />)}</div>
            </div>
          </Reveal>
        </div>

        <div className="h-px my-8 sm:my-10" style={{ background: 'rgba(0,154,147,0.15)' }} />

        <Reveal><h3 className="font-bold mb-5 sm:mb-6" style={{ fontSize: '20px', color: '#333333' }}>Vistas de la aplicación web</h3></Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APP_VIEWS.map((v, i) => (
            <Reveal key={v.title} delay={i * 50}>
              <div
                className="h-full rounded-[16px] p-5 sm:p-6 card-shadow card-press"
                style={{
                  background: '#ffffff',
                  border: v.special ? '2px solid rgba(0,154,147,0.3)' : '1px solid rgba(0,154,147,0.12)',
                  borderTop: v.top ? `3px solid ${v.top}` : undefined,
                }}>
                <div className="text-[24px] mb-3">{v.icon}</div>
                <h3 className="font-bold mb-2" style={{ fontSize: '18px', color: '#333333' }}>{v.title}</h3>
                <p className="leading-[1.65]" style={{ fontSize: '16px', color: '#4f4f4f' }}>{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

