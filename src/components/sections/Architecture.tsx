type NodeStyle = 'teal' | 'orange' | 'gray'

const nodeStyles: Record<NodeStyle, React.CSSProperties> = {
  teal:   { background: 'rgba(0,154,147,0.1)',  border: '1px solid rgba(0,154,147,0.3)',  color: '#007a74' },
  orange: { background: 'rgba(227,114,0,0.1)',  border: '1px solid rgba(227,114,0,0.35)', color: '#b35900' },
  gray:   { background: '#e8faf8',              border: '1px solid rgba(0,154,147,0.2)',  color: '#1a3533' },
}

const Node = ({ label, style }: { label: string; style: NodeStyle }) => (
  <div className="flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-transform duration-150 hover:-translate-y-0.5 cursor-default"
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
  { icon: '✏️', label: 'Claude Code',       bg: 'rgba(0,154,147,0.1)',  border: 'rgba(0,154,147,0.3)',  color: '#009A93' },
  { icon: '🐙', label: 'GitHub',             bg: '#e8faf8',              border: 'rgba(0,154,147,0.2)',  color: '#1a3533' },
  { icon: '▲',  label: 'Vercel Frontend',   bg: 'rgba(227,114,0,0.1)',  border: 'rgba(227,114,0,0.3)',  color: '#b35900' },
  { icon: '🚄', label: 'Railway Backend',   bg: 'rgba(192,57,43,0.08)', border: 'rgba(192,57,43,0.25)', color: '#b53e30' },
  { icon: '🌐', label: 'App en producción', bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.3)',  color: '#16a34a' },
]

export default function Architecture() {
  return (
    <section id="architecture" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)', background: '#f4fefd' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">02 — Arquitectura</div>
        <h2 className="font-sans font-black mb-10 text-u-white" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Cómo fluye el sistema
        </h2>

        <div className="rounded-[18px] p-9 card-shadow" style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)' }}>
          {layers.map((layer, i) => (
            <div key={layer.label}>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase mb-2.5" style={{ color: '#4a8a86' }}>{layer.label}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {layer.nodes.map(n => <Node key={n.label} label={n.label} style={n.style} />)}
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center h-7 items-center mb-4 font-bold" style={{ color: '#009A93' }}>↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-[17px] font-bold mb-4 text-u-white">Flujo de desarrollo y deploy</h3>
          <div className="flex items-center overflow-x-auto gap-1 py-7">
            {flowSteps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col items-center gap-2 min-w-[100px]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[19px] transition-transform duration-150 hover:-translate-y-0.5"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    {s.icon}
                  </div>
                  <span className="text-[11px] text-center max-w-[85px] leading-[1.3] font-medium" style={{ color: '#4a8a86' }}>{s.label}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="text-base mb-5 flex-shrink-0 font-bold" style={{ color: '#009A93' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
