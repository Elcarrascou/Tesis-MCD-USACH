const Tag = ({ label }: { label: string }) => (
  <span className="inline-block font-mono text-[11px] px-2 py-0.5 rounded mr-1 mb-1 font-medium"
    style={{ background: '#e8faf8', border: '1px solid rgba(0,154,147,0.25)', color: '#009A93' }}>
    {label}
  </span>
)

const appViews = [
  { icon: '📈', title: 'Portafolio',         desc: 'Posiciones actuales, valor total y distribución de activos desde Alpaca en tiempo real.', accent: true },
  { icon: '🔄', title: 'Movimientos',        desc: 'Historial completo de transacciones sincronizadas desde Alpaca.' },
  { icon: '🧠', title: 'Decisiones IA',      desc: 'Registro de recomendaciones del agente OpenClaw con su justificación.' },
  { icon: '💰', title: 'Ganancias',          desc: 'Rendimiento del portafolio en el tiempo comparado con benchmarks del mercado.' },
  { icon: '🔬', title: 'Modelos ML',         desc: 'Predicciones actualizadas periódicamente de los 4 modelos con métricas de confianza.' },
  { icon: '↗',  title: 'Ejecutar en Alpaca', desc: 'La IA sugiere la operación. El usuario la ejecuta en Alpaca con un click directo.', special: true },
]

export default function Overview() {
  return (
    <section id="overview" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)', background: '#ffffff' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">01 — Visión general</div>
        <h2 className="font-sans font-black mb-3.5 text-u-white" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>¿Qué construimos?</h2>
        <p className="text-[15px] leading-[1.8] max-w-[680px] mb-10" style={{ color: '#4a8a86' }}>
          Una plataforma inteligente que conecta datos del mercado bursátil con modelos predictivos y un agente de IA,
          permitiendo monitorear y tomar decisiones de inversión asistidas desde cualquier dispositivo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="rounded-[14px] p-6 card-shadow" style={{ background: '#f4fefd', border: '1px solid rgba(0,154,147,0.18)', borderLeft: '4px solid #009A93' }}>
            <div className="section-tag">Ámbito 1</div>
            <h3 className="text-[17px] font-bold mb-3 text-u-white">🤖 Inteligencia Artificial</h3>
            <p className="text-[14px] leading-[1.7]" style={{ color: '#4a8a86' }}>
              Agente OpenClaw hosteado en Hostinger que analiza el portafolio diariamente, interpreta eventos de mercado
              y genera recomendaciones en lenguaje natural via Telegram o WhatsApp.
            </p>
            <div className="mt-5">{['OpenClaw','Claude','OpenAI','Ollama','Qwen'].map(t => <Tag key={t} label={t} />)}</div>
          </div>
          <div className="rounded-[14px] p-6 card-shadow" style={{ background: '#f4fefd', border: '1px solid rgba(0,154,147,0.18)', borderLeft: '4px solid #E37200' }}>
            <div className="section-tag" style={{ color: '#E37200' }}>Ámbito 2</div>
            <h3 className="text-[17px] font-bold mb-3 text-u-white">📊 Machine Learning</h3>
            <p className="text-[14px] leading-[1.7]" style={{ color: '#4a8a86' }}>
              Cuatro modelos entrenados con datos históricos de Yahoo Finance que predicen precios, generan señales
              de compra/venta, detectan tendencias y clasifican el riesgo del portafolio.
            </p>
            <div className="mt-5">{['LSTM','XGBoost','Prophet','Random Forest'].map(t => <Tag key={t} label={t} />)}</div>
          </div>
        </div>

        <div className="h-px my-10" style={{ background: 'rgba(0,154,147,0.12)' }} />

        <h3 className="text-[17px] font-bold mb-5 text-u-white">Vistas de la aplicación web</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appViews.map(v => (
            <div key={v.title}
              className="rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-0.5 card-shadow"
              style={{
                background: v.special ? '#e8faf8' : '#f4fefd',
                border: v.special ? '1px solid rgba(0,154,147,0.3)' : '1px solid rgba(0,154,147,0.15)',
                borderTop: v.accent ? '3px solid #009A93' : undefined,
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,154,147,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
              <div className="text-[22px] mb-2.5">{v.icon}</div>
              <h3 className="text-[15px] font-bold mb-1.5 text-u-white">{v.title}</h3>
              <p className="text-[13px] leading-[1.65]" style={{ color: '#4a8a86' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
