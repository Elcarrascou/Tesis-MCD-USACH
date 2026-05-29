type NodeStyle = 'gold' | 'blue' | 'gray' | 'red'

const nodeStyles: Record<NodeStyle, React.CSSProperties> = {
  gold: { background: 'rgba(232,164,0,0.09)',  border: '1px solid rgba(232,164,0,0.28)',  color: '#f5bc2e' },
  blue: { background: 'rgba(26,86,200,0.09)',  border: '1px solid rgba(26,86,200,0.3)',   color: '#7aadff' },
  gray: { background: '#16233a',               border: '1px solid rgba(255,255,255,0.11)', color: '#f0f4fa' },
  red:  { background: 'rgba(192,57,43,0.09)',  border: '1px solid rgba(192,57,43,0.3)',   color: '#f08070' },
}

const Node = ({ label, style }: { label: string; style: NodeStyle }) => (
  <div className="flex items-center gap-2 px-3.5 py-2 rounded-[9px] text-[12px] font-medium whitespace-nowrap transition-transform duration-150 hover:-translate-y-0.5 cursor-default"
    style={nodeStyles[style]}>
    {label}
  </div>
)

const layers = [
  {
    label: '📡 Capa de datos',
    nodes: [
      { label: '📊 Alpaca API — Datos en tiempo real + sandbox', style: 'gold' as NodeStyle },
      { label: '📉 Yahoo Finance — Datos históricos para ML',    style: 'blue' as NodeStyle },
    ],
  },
  {
    label: '⚙️ Capa de Machine Learning',
    nodes: [
      { label: '🔮 LSTM — Precio futuro',        style: 'gold' as NodeStyle },
      { label: '⚡ XGBoost — Señal compra/venta', style: 'gold' as NodeStyle },
      { label: '📅 Prophet — Tendencia',          style: 'gold' as NodeStyle },
      { label: '🛡️ Random Forest — Riesgo',       style: 'gold' as NodeStyle },
    ],
  },
  {
    label: '🧠 Capa de Inteligencia Artificial',
    nodes: [
      { label: '🤖 OpenClaw — Agente IA en Hostinger', style: 'blue' as NodeStyle },
      { label: '⚡ Claude / OpenAI — Razonamiento',    style: 'blue' as NodeStyle },
      { label: '🟢 Ollama / Qwen — Operación diaria',  style: 'blue' as NodeStyle },
      { label: '🔗 FastAPI — Backend en Railway',       style: 'blue' as NodeStyle },
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
      { label: '💬 Telegram / WhatsApp',               style: 'gold' as NodeStyle },
      { label: '🌐 React + Tailwind CSS en Vercel',    style: 'blue' as NodeStyle },
    ],
  },
]

const flowSteps = [
  { icon: '✏️', label: 'Claude Code',        color: 'rgba(232,164,0,0.1)',  border: 'rgba(232,164,0,0.3)',  text: '#e8a400' },
  { icon: '🐙', label: 'GitHub',              color: '#16233a',              border: 'rgba(255,255,255,0.11)', text: '#f0f4fa' },
  { icon: '▲',  label: 'Vercel Frontend',    color: 'rgba(26,86,200,0.1)',  border: 'rgba(26,86,200,0.3)',  text: '#7aadff' },
  { icon: '🚄', label: 'Railway Backend',    color: 'rgba(192,57,43,0.1)',  border: 'rgba(192,57,43,0.3)',  text: '#f08070' },
  { icon: '🌐', label: 'App en producción',  color: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' },
]

export default function Architecture() {
  return (
    <section id="architecture" className="py-24" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">02 — Arquitectura</div>
        <h2 className="font-cond font-semibold mb-10" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Cómo fluye el sistema
        </h2>

        {/* Layered diagram */}
        <div className="rounded-[18px] p-9" style={{ background: '#101929', border: '1px solid rgba(255,255,255,0.06)' }}>
          {layers.map((layer, i) => (
            <div key={layer.label}>
              <div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-u-muted mb-2.5">{layer.label}</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {layer.nodes.map(n => <Node key={n.label} label={n.label} style={n.style} />)}
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center h-7 items-center text-u-muted text-base mb-4">↓</div>
              )}
            </div>
          ))}
        </div>

        {/* Deploy flow */}
        <div className="mt-10">
          <h3 className="text-[17px] font-semibold mb-4">Flujo de desarrollo y deploy</h3>
          <div className="flex items-center overflow-x-auto gap-1 py-7">
            {flowSteps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col items-center gap-2 min-w-[100px]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[19px] transition-transform duration-150 hover:-translate-y-0.5"
                    style={{ background: s.color, border: `1px solid ${s.border}`, color: s.text }}>
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
