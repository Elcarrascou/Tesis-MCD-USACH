const Tag = ({ label }: { label: string }) => (
  <span className="inline-block font-mono text-[11px] px-2 py-0.5 rounded mr-1 mb-1 text-u-muted"
    style={{ background: '#163330', border: '1px solid rgba(0,154,147,0.18)' }}>
    {label}
  </span>
)

const appViews = [
  { icon: '📈', title: 'Portafolio',         desc: 'Posiciones actuales, valor total y distribución de activos desde Alpaca en tiempo real.', accent: '#009A93' },
  { icon: '🔄', title: 'Movimientos',        desc: 'Historial completo de transacciones sincronizadas desde Alpaca.' },
  { icon: '🧠', title: 'Decisiones IA',      desc: 'Registro de recomendaciones del agente OpenClaw con su justificación.' },
  { icon: '💰', title: 'Ganancias',          desc: 'Rendimiento del portafolio en el tiempo comparado con benchmarks del mercado.' },
  { icon: '🔬', title: 'Modelos ML',         desc: 'Predicciones actualizadas periódicamente de los 4 modelos con métricas de confianza.' },
  { icon: '↗',  title: 'Ejecutar en Alpaca', desc: 'La IA sugiere la operación. El usuario la ejecuta en Alpaca con un click directo.', special: true },
]

export default function Overview() {
  return (
    <section id="overview" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">01 — Visión general</div>
        <h2 className="font-sans font-black mb-3.5" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>¿Qué construimos?</h2>
        <p className="text-u-muted text-[15px] leading-[1.75] max-w-[680px] mb-10">
          Una plataforma inteligente que conecta datos del mercado bursátil con modelos predictivos y un agente de IA,
          permitiendo monitorear y tomar decisiones de inversión asistidas desde cualquier dispositivo.
        </p>

        {/* Two main cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="rounded-[14px] p-6" style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.12)', borderLeft: '3px solid #009A93' }}>
            <div className="section-tag">Ámbito 1</div>
            <h3 className="text-[17px] font-bold mb-3">🤖 Inteligencia Artificial</h3>
            <p className="text-u-muted text-[14px] leading-[1.7]">
              Agente OpenClaw hosteado en Hostinger que analiza el portafolio diariamente, interpreta eventos de mercado
              y genera recomendaciones en lenguaje natural via Telegram o WhatsApp.
            </p>
            <div className="mt-5">
              {['OpenClaw','Claude','OpenAI','Ollama','Qwen'].map(t => <Tag key={t} label={t} />)}
            </div>
          </div>
          <div className="rounded-[14px] p-6" style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.12)', borderLeft: '3px solid #E37200' }}>
            <div className="section-tag" style={{ color: '#E37200' }}>Ámbito 2</div>
            <h3 className="text-[17px] font-bold mb-3">📊 Machine Learning</h3>
            <p className="text-u-muted text-[14px] leading-[1.7]">
              Cuatro modelos entrenados con datos históricos de Yahoo Finance que predicen precios, generan señales
              de compra/venta, detectan tendencias y clasifican el riesgo del portafolio.
            </p>
            <div className="mt-5">
              {['LSTM','XGBoost','Prophet','Random Forest'].map(t => <Tag key={t} label={t} />)}
            </div>
          </div>
        </div>

        <div className="h-px my-11" style={{ background: 'rgba(0,154,147,0.12)' }} />

        <h3 className="text-[17px] font-bold mb-5">Vistas de la aplicación web</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {appViews.map(v => (
            <div key={v.title} className="rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: v.special ? 'rgba(0,154,147,0.05)' : '#112624',
                border: v.special ? '1px solid rgba(0,154,147,0.25)' : '1px solid rgba(0,154,147,0.1)',
                borderTop: v.accent && !v.special ? `2px solid ${v.accent}` : undefined,
              }}>
              <div className="text-[22px] mb-2.5">{v.icon}</div>
              <h3 className="text-[15px] font-bold mb-1.5">{v.title}</h3>
              <p className="text-u-muted text-[13px] leading-[1.65]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
