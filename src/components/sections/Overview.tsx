const Tag = ({ label }: { label: string }) => (
  <span className="inline-block font-mono text-[11px] px-2 py-0.5 rounded mr-1 mb-1 text-u-muted"
    style={{ background: '#16233a', border: '1px solid rgba(255,255,255,0.11)' }}>
    {label}
  </span>
)

const appViews = [
  { icon: '📈', title: 'Portafolio',        desc: 'Posiciones actuales, valor total y distribución de activos desde Alpaca en tiempo real.', accent: '#e8a400' },
  { icon: '🔄', title: 'Movimientos',       desc: 'Historial completo de transacciones sincronizadas desde Alpaca.' },
  { icon: '🧠', title: 'Decisiones IA',     desc: 'Registro de recomendaciones del agente OpenClaw con su justificación.' },
  { icon: '💰', title: 'Ganancias',         desc: 'Rendimiento del portafolio en el tiempo comparado con benchmarks del mercado.' },
  { icon: '🔬', title: 'Modelos ML',        desc: 'Predicciones actualizadas periódicamente de los 4 modelos con métricas de confianza.' },
  { icon: '↗',  title: 'Ejecutar en Alpaca', desc: 'La IA sugiere la operación. El usuario la ejecuta en Alpaca con un click directo.', accent: 'rgba(232,164,0,0.18)' },
]

export default function Overview() {
  return (
    <section id="overview" className="py-24" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">01 — Visión general</div>
        <h2 className="font-cond font-semibold mb-3.5" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>¿Qué construimos?</h2>
        <p className="text-u-muted text-[15px] leading-[1.75] max-w-[680px] mb-10">
          Una plataforma inteligente que conecta datos del mercado bursátil con modelos predictivos y un agente de IA,
          permitiendo monitorear y tomar decisiones de inversión asistidas desde cualquier dispositivo.
        </p>

        {/* Two main cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="rounded-[14px] p-6" style={{ background: '#101929', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #e8a400' }}>
            <div className="section-tag">Ámbito 1</div>
            <h3 className="text-[17px] font-semibold mb-3">🤖 Inteligencia Artificial</h3>
            <p className="text-u-muted text-[14px] leading-[1.7]">
              Agente OpenClaw hosteado en Hostinger que analiza el portafolio diariamente, interpreta eventos de mercado
              y genera recomendaciones en lenguaje natural via Telegram o WhatsApp.
            </p>
            <div className="mt-5">
              {['OpenClaw','Claude','OpenAI','Ollama','Qwen'].map(t => <Tag key={t} label={t} />)}
            </div>
          </div>
          <div className="rounded-[14px] p-6" style={{ background: '#101929', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #1a56c8' }}>
            <div className="section-tag" style={{ color: '#7aadff' }}>Ámbito 2</div>
            <h3 className="text-[17px] font-semibold mb-3">📊 Machine Learning</h3>
            <p className="text-u-muted text-[14px] leading-[1.7]">
              Cuatro modelos entrenados con datos históricos de Yahoo Finance que predicen precios, generan señales
              de compra/venta, detectan tendencias y clasifican el riesgo del portafolio.
            </p>
            <div className="mt-5">
              {['LSTM','XGBoost','Prophet','Random Forest'].map(t => <Tag key={t} label={t} />)}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px my-11" style={{ background: 'rgba(255,255,255,0.06)' }} />

        <h3 className="text-[17px] font-semibold mb-5">Vistas de la aplicación web</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {appViews.map(v => (
            <div key={v.title} className="rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: v.accent && v.title === 'Ejecutar en Alpaca' ? 'rgba(232,164,0,0.05)' : '#101929',
                border: v.title === 'Ejecutar en Alpaca' ? '1px solid rgba(232,164,0,0.18)' : '1px solid rgba(255,255,255,0.06)',
                borderTop: v.accent && v.title !== 'Ejecutar en Alpaca' ? `2px solid ${v.accent}` : undefined,
              }}>
              <div className="text-[22px] mb-2.5">{v.icon}</div>
              <h3 className="text-[15px] font-semibold mb-1.5">{v.title}</h3>
              <p className="text-u-muted text-[13px] leading-[1.65]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
