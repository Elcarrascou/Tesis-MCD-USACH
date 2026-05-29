type NodeStyle = 'teal' | 'orange' | 'gray' | 'red'

const nodeStyles: Record<NodeStyle, React.CSSProperties> = {
  teal:   { background: 'rgba(0,154,147,0.1)',   border: '1px solid rgba(0,154,147,0.3)',   color: '#00b5ad' },
  orange: { background: 'rgba(227,114,0,0.1)',   border: '1px solid rgba(227,114,0,0.35)',  color: '#f08020' },
  gray:   { background: '#163330',               border: '1px solid rgba(0,154,147,0.18)',  color: '#e8f5f4' },
  red:    { background: 'rgba(192,57,43,0.09)',  border: '1px solid rgba(192,57,43,0.3)',   color: '#f08070' },
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
      { label: '🔮 LSTM — Precio futuro',        style: 'teal' as NodeStyle },
      { label: '⚡ XGBoost — Señal compra/venta', style: 'teal' as NodeStyle },
      { label: '📅 Prophet — Tendencia',          style: 'teal' as NodeStyle },
      { label: '🛡️ Random Forest — Riesgo',       style: 'teal' as NodeStyle },
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
  { icon: '✏️', label: 'Claude Code',        bg: 'rgba(0,154,147,0.1)',  border: 'rgba(0,154,147,0.3)',  color: '#009A93' },
  { icon: '🐙', label: 'GitHub',              bg: '#163330',              border: 'rgba(0,154,147,0.2)',  color: '#e8f5f4' },
  { icon: '▲',  label: 'Vercel Frontend',    bg: 'rgba(227,114,0,0.1)',  border: 'rgba(227,114,0,0.3)',  color: '#f08020' },
  { icon: '🚄', label: 'Railway Backend',    bg: 'rgba(192,57,43,0.1)',  border: 'rgba(192,57,43,0.3)',  color: '#f08070' },
  { icon: '🌐', label: 'App en producción',  bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', color: '#4ade80' },
]

export default function Architecture() {
  return (
    <section id="architecture" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">02 — Arquitectura</div>
        <h2 className="font-sans font-black mb-10" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Cómo fluye el sistema
        </h2>

        <div className="rounded-[18px] p-9" style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.12)' }}>
          {layers.map((layer, i) => (
            <div key={layer.label}>
              <div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-u-muted mb-2.5">{layer.label}</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {layer.nodes.map(n => <Node key={n.label} label={n.label} style={n.style} />)}
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center h-7 items-center mb-4" style={{ color: '#009A93', fontSize: 16 }}>↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-[17px] font-bold mb-4">Flujo de desarrollo y deploy</h3>
          <div className="flex items-center overflow-x-auto gap-1 py-7">
            {flowSteps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col items-center gap-2 min-w-[100px]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[19px] transition-transform duration-150 hover:-translate-y-0.5"
                    style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                    {s.icon}
                  </div>
                  <span className="text-[11px] text-center text-u-muted max-w-[85px] leading-[1.3]">{s.label}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="text-u-muted text-base mb-5 flex-shrink-0">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
