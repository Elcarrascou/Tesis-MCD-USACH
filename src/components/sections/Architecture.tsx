type NodeStyle = 'teal' | 'orange' | 'gray'

const nodeStyles: Record<NodeStyle, React.CSSProperties> = {
  teal:   { background: 'rgba(0,154,147,0.1)',  border: '1px solid rgba(0,154,147,0.35)', color: '#007a74', fontWeight: 600 },
  orange: { background: 'rgba(227,114,0,0.08)', border: '1px solid rgba(227,114,0,0.35)', color: '#b35900', fontWeight: 600 },
  gray:   { background: '#f5fffe',              border: '1px solid rgba(0,154,147,0.2)',  color: '#333333', fontWeight: 600 },
}

const Node = ({ label, style }: { label: string; style: NodeStyle }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] whitespace-nowrap transition-transform duration-150 hover:-translate-y-0.5 cursor-default"
    style={nodeStyles[style]}>
    {label}
  </div>
)

const layers = [
  {
    label: '📡 Capa de datos',
    nodes: [
      { label: '📊 Alpaca API — Datos en tiempo real + sandbox', style: 'teal' as NodeStyle },
      { label: '📉 Yahoo Finance — Datos históricos para ML',    style: 'orange' as NodeStyle },
    ],
  },
  {
    label: '⚙️ Capa de Machine Learning',
    nodes: [
      { label: '🔮 LSTM — Precio futuro',         style: 'teal' as NodeStyle },
      { label: '⚡ XGBoost — Señal compra/venta',  style: 'teal' as NodeStyle },
      { label: '📅 Prophet — Tendencia',           style: 'teal' as NodeStyle },
      { label: '🛡️ Random Forest — Riesgo',        style: 'teal' as NodeStyle },
    ],
  },
  {
    label: '🧠 Capa de Inteligencia Artificial',
    nodes: [
      { label: '🤖 OpenClaw — Agente IA en Hostinger', style: 'orange' as NodeStyle },
      { label: '⚡ Claude / OpenAI — Razonamiento',    style: 'orange' as NodeStyle },
      { label: '🟢 Ollama / Qwen — Operación diaria',  style: 'orange' as NodeStyle },
      { label: '🔗 FastAPI — Backend en Railway',       style: 'orange' as NodeStyle },
    ],
  },
  {
    label: '🗄️ Capa de persistencia',
    nodes: [
      { label: '🐘 Supabase (PostgreSQL) — portfolio · movements · ai_decisions · ml_predictions · performance', style: 'gray' as NodeStyle },
    ],
  },
  {
    label: '📲 Capa de interacción',
    nodes: [
      { label: '💬 Telegram / WhatsApp',            style: 'teal' as NodeStyle },
      { label: '🌐 React + Tailwind CSS en Vercel', style: 'orange' as NodeStyle },
    ],
  },
]

const flowSteps = [
  { icon: '✏️', label: 'Claude Code',       bg: 'rgba(0,154,147,0.1)',  border: 'rgba(0,154,147,0.35)', color: '#009A93' },
  { icon: '🐙', label: 'GitHub',             bg: '#f5fffe',              border: 'rgba(0,154,147,0.2)',  color: '#333333' },
  { icon: '▲',  label: 'Vercel Frontend',   bg: 'rgba(227,114,0,0.08)', border: 'rgba(227,114,0,0.35)', color: '#b35900' },
  { icon: '🚄', label: 'Railway Backend',   bg: 'rgba(51,51,51,0.06)',  border: 'rgba(51,51,51,0.2)',   color: '#555555' },
  { icon: '🌐', label: 'App en producción', bg: 'rgba(0,154,147,0.12)', border: 'rgba(0,154,147,0.4)',  color: '#009A93' },
]

export default function Architecture() {
  return (
    <section id="architecture" className="py-24" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">02 — Arquitectura</div>
        <h2 className="font-sans font-black mb-12" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#333333' }}>
          Cómo fluye el sistema
        </h2>

        <div className="rounded-[18px] p-10 card-shadow" style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.18)' }}>
          {layers.map((layer, i) => (
            <div key={layer.label}>
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase mb-3 font-bold" style={{ color: '#777777' }}>{layer.label}</div>
              <div className="flex flex-wrap gap-2.5 mb-5">
                {layer.nodes.map(n => <Node key={n.label} label={n.label} style={n.style} />)}
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center h-8 items-center mb-5 text-lg font-bold" style={{ color: '#009A93' }}>↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-[20px] font-bold mb-5" style={{ color: '#333333' }}>Flujo de desarrollo y deploy</h3>
          <div className="flex items-center overflow-x-auto gap-1 py-6">
            {flowSteps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col items-center gap-2.5 min-w-[110px]">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-[20px] transition-transform duration-150 hover:-translate-y-0.5 card-shadow"
                    style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
                    {s.icon}
                  </div>
                  <span className="text-[12px] text-center max-w-[90px] leading-[1.3] font-semibold" style={{ color: '#777777' }}>{s.label}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="text-lg mb-6 flex-shrink-0 font-bold" style={{ color: '#009A93' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
