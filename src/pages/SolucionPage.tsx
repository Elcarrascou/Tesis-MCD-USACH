import { useState } from 'react'

/* ─────────────────────────────────────────────
   DATOS DEL DIAGRAMA
───────────────────────────────────────────── */
const NW = 112  // node width
const NH = 52   // node height
const R  = 10   // corner radius

interface NodeDef {
  id: string; label: string; sub: string
  x: number;  y: number;   color: string
  desc: string; tech: string
}

const NODES: NodeDef[] = [
  // — Datos —
  { id:'yahoo',   label:'Yahoo Finance',       sub:'Datos históricos',    x:90,  y:150, color:'#E37200',
    desc:'Proporciona series históricas de precios del IPSA y Dow Jones para entrenar los 4 modelos ML.',   tech:'Python · yfinance' },
  { id:'alpaca',  label:'Alpaca API',          sub:'Tiempo real + broker', x:90,  y:350, color:'#009A93',
    desc:'Broker API-first con paper trading global y datos de mercado en tiempo real para ejecutar órdenes.', tech:'Alpaca Trade API' },

  // — ML —
  { id:'lstm',    label:'LSTM',                sub:'Precio futuro',        x:290, y:70,  color:'#009A93',
    desc:'Red neuronal recurrente que aprende dependencias temporales y predice el precio futuro del activo.',  tech:'TensorFlow · Keras' },
  { id:'xgb',     label:'XGBoost',             sub:'Señal compra/venta',   x:290, y:195, color:'#E37200',
    desc:'Gradient boosting con indicadores técnicos, precio y volumen para generar la señal de trading.',       tech:'XGBoost · Python' },
  { id:'prophet', label:'Prophet',             sub:'Tendencia IPSA',       x:290, y:320, color:'#1a7a3c',
    desc:'Modelo de Meta AI que descompone estacionalidad y tendencia del mercado a mediano plazo.',             tech:'Meta Prophet' },
  { id:'rf',      label:'Random Forest',       sub:'Nivel de riesgo',      x:290, y:445, color:'#6b21a8',
    desc:'Clasifica el riesgo del activo (bajo / medio / alto) mediante votación de múltiples árboles.',         tech:'scikit-learn' },

  // — Backend —
  { id:'fastapi',  label:'FastAPI',            sub:'Consolidación',        x:490, y:195, color:'#009A93',
    desc:'Consolida las 4 predicciones ML en un único endpoint REST que consume el agente OpenClaw.',           tech:'FastAPI · Railway' },
  { id:'supa',     label:'Supabase',           sub:'PostgreSQL',           x:490, y:390, color:'#555555',
    desc:'Almacena portfolio, movimientos, decisiones IA, predicciones ML y métricas de rendimiento.',           tech:'Supabase Pro · PostgreSQL' },

  // — IA —
  { id:'openclaw', label:'OpenClaw',           sub:'Agente autónomo',      x:690, y:195, color:'#6b21a8',
    desc:'Orquesta los modelos ML, razona sobre el mercado y genera recomendaciones de rebalanceo.',             tech:'OpenClaw · Hostinger' },
  { id:'llms',     label:'Claude / GPT / Ollama', sub:'Motores LLM',      x:690, y:370, color:'#333333',
    desc:'Motores de lenguaje que alimentan a OpenClaw: Claude para decisiones complejas, Ollama para uso diario.', tech:'Anthropic · OpenAI · Ollama' },

  // — Output —
  { id:'webapp',   label:'React Web App',      sub:'Dashboard',            x:890, y:155, color:'#009A93',
    desc:'Visualiza posiciones, predicciones ML, decisiones IA y rendimiento. Incluye enlace directo a Alpaca.', tech:'React · Tailwind · Vercel' },
  { id:'telegram', label:'Telegram',           sub:'Chatbot IA',           x:890, y:350, color:'#E37200',
    desc:'Canal proactivo del agente para alertas, recomendaciones y resumen diario del portafolio.',            tech:'Telegram Bot API' },
]

interface EdgeDef {
  from:string; to:string; color:string; dash?:boolean; dur:number; delay:number
}

const EDGES: EdgeDef[] = [
  // Yahoo → ML
  { from:'yahoo',   to:'lstm',     color:'#E37200', dur:2.2, delay:0   },
  { from:'yahoo',   to:'xgb',      color:'#E37200', dur:2.5, delay:0.4 },
  { from:'yahoo',   to:'prophet',  color:'#E37200', dur:2.8, delay:0.8 },
  { from:'yahoo',   to:'rf',       color:'#E37200', dur:3.1, delay:1.2 },
  // Alpaca → FastAPI
  { from:'alpaca',  to:'fastapi',  color:'#009A93', dur:2.0, delay:0.3 },
  // ML → FastAPI
  { from:'lstm',    to:'fastapi',  color:'#009A93', dur:2.0, delay:0.6 },
  { from:'xgb',     to:'fastapi',  color:'#E37200', dur:2.0, delay:0.9 },
  { from:'prophet', to:'fastapi',  color:'#1a7a3c', dur:2.0, delay:1.1 },
  { from:'rf',      to:'fastapi',  color:'#6b21a8', dur:2.0, delay:1.4 },
  // FastAPI → backend
  { from:'fastapi', to:'openclaw', color:'#6b21a8', dur:1.8, delay:0.5 },
  { from:'fastapi', to:'supa',     color:'#555555', dur:2.2, delay:0.8 },
  // LLMs → OpenClaw
  { from:'llms',    to:'openclaw', color:'#555555', dur:1.6, delay:0.2 },
  // Supa → WebApp
  { from:'supa',    to:'webapp',   color:'#555555', dur:2.0, delay:0.6 },
  // OpenClaw → outputs
  { from:'openclaw',to:'webapp',   color:'#009A93', dur:1.8, delay:0.3 },
  { from:'openclaw',to:'telegram', color:'#E37200', dur:1.8, delay:0.7 },
]

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getNode(id: string) { return NODES.find(n => n.id === id)! }

function edgePath(e: EdgeDef) {
  const a = getNode(e.from), b = getNode(e.to)
  const x1 = a.x + NW/2,  y1 = a.y
  const x2 = b.x - NW/2,  y2 = b.y
  const cx = (x1+x2)/2
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`
}

function connectedTo(id: string) {
  return new Set(
    EDGES.filter(e => e.from === id || e.to === id).flatMap(e => [e.from, e.to])
  )
}

const LAYERS = [
  { label:'Datos de mercado', x:90  },
  { label:'Modelos ML',       x:290 },
  { label:'Backend',          x:490 },
  { label:'Agente IA',        x:690 },
  { label:'Interfaz usuario', x:890 },
]

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function SolucionPage() {
  const [selected, setSelected] = useState<string|null>(null)
  const [animated, setAnimated] = useState(true)

  // Cerrar al clicar fondo
  const connected = selected ? connectedTo(selected) : null
  const selNode   = selected ? getNode(selected) : null

  return (
    <section className="min-h-screen py-20 sm:py-24" style={{ background:'#ffffff' }}>
      <div className="wrap">

        {/* ── Header ── */}
        <div className="section-tag">Sistema completo</div>
        <h1 className="font-sans font-black mb-4" style={{ fontSize:'clamp(28px,4vw,48px)', color:'#333333' }}>
          Arquitectura interactiva
        </h1>
        <p className="leading-[1.8] max-w-[740px] mb-3" style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'#4f4f4f' }}>
          Diagrama completo del sistema. <strong style={{color:'#333'}}>Haz click en cualquier nodo</strong> para
          ver su rol, tecnología y conexiones dentro del portafolio gestionado por IA.
        </p>

        {/* Toggle animación */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => setAnimated(a => !a)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[13px] font-bold transition-all"
            style={{
              background: animated ? '#009A93' : 'rgba(0,154,147,0.1)',
              color: animated ? '#fff' : '#009A93',
              border: '1px solid rgba(0,154,147,0.4)',
            }}>
            {animated ? '⏸ Pausar flujo' : '▶ Animar flujo'}
          </button>
          {selected && (
            <button onClick={() => setSelected(null)}
              className="px-4 py-1.5 rounded-full font-mono text-[13px] font-bold"
              style={{ background:'rgba(51,51,51,0.06)', color:'#333', border:'1px solid rgba(51,51,51,0.15)' }}>
              ✕ Limpiar selección
            </button>
          )}
        </div>

        {/* ── SVG Diagram ── */}
        <div className="rounded-[20px] overflow-x-auto card-shadow mb-8"
          style={{ border:'1px solid rgba(0,154,147,0.18)', background:'#fafcfc' }}>
          <svg
            viewBox="0 0 1010 520"
            style={{ minWidth:680, width:'100%', display:'block', fontFamily:'Nunito Sans, sans-serif' }}
            onClick={() => setSelected(null)}
          >
            {/* ── Defs: arrowhead ── */}
            <defs>
              {['#009A93','#E37200','#1a7a3c','#6b21a8','#555555'].map(c => (
                <marker key={c} id={`arr-${c.replace('#','')}`}
                  markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill={c} />
                </marker>
              ))}
            </defs>

            {/* ── Layer header bands ── */}
            {LAYERS.map(l => (
              <g key={l.label}>
                <rect x={l.x - NW/2} y={8} width={NW} height={22} rx={6}
                  fill="rgba(0,154,147,0.07)" stroke="rgba(0,154,147,0.2)" strokeWidth={1} />
                <text x={l.x} y={23} textAnchor="middle" fontSize={11}
                  fontWeight="700" fill="#009A93" fontFamily="JetBrains Mono, monospace" letterSpacing="0.05em">
                  {l.label.toUpperCase()}
                </text>
              </g>
            ))}

            {/* ── Edges ── */}
            {EDGES.map((e, i) => {
              const d    = edgePath(e)
              const dim  = connected && !connected.has(e.from) && !connected.has(e.to)
              const hl   = connected && connected.has(e.from) && connected.has(e.to)
              const markerUrl = `url(#arr-${e.color.replace('#','')})`
              return (
                <g key={i}>
                  {/* Base path */}
                  <path d={d} fill="none"
                    stroke={e.color}
                    strokeWidth={hl ? 2.5 : 1.5}
                    strokeDasharray={e.dash ? '6,4' : undefined}
                    markerEnd={markerUrl}
                    opacity={dim ? 0.08 : hl ? 1 : 0.35}
                    style={{ transition:'opacity 0.25s, stroke-width 0.25s' }}
                  />
                  {/* Animated dot */}
                  {animated && !dim && (
                    <circle r={dim ? 0 : hl ? 5 : 3.5} fill={e.color} opacity={dim ? 0 : 0.9}>
                      <animateMotion dur={`${e.dur}s`} repeatCount="indefinite" begin={`${e.delay}s`}>
                        <mpath href={`#path-${i}`} />
                      </animateMotion>
                    </circle>
                  )}
                  {/* Named path for animateMotion */}
                  <path id={`path-${i}`} d={d} fill="none" stroke="none" />
                </g>
              )
            })}

            {/* ── Nodes ── */}
            {NODES.map(n => {
              const isSelected = selected === n.id
              const isDimmed   = connected && !connected.has(n.id)
              return (
                <g key={n.id} onClick={ev => { ev.stopPropagation(); setSelected(n.id === selected ? null : n.id) }}
                  style={{ cursor:'pointer' }}>
                  {/* Glow on selected */}
                  {isSelected && (
                    <rect x={n.x-NW/2-4} y={n.y-NH/2-4} width={NW+8} height={NH+8} rx={R+4}
                      fill={n.color} opacity={0.15} />
                  )}
                  {/* Card */}
                  <rect x={n.x-NW/2} y={n.y-NH/2} width={NW} height={NH} rx={R}
                    fill={isSelected ? n.color : '#ffffff'}
                    stroke={n.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={isDimmed ? 0.18 : 1}
                    style={{ filter: isDimmed ? 'none' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))', transition:'opacity 0.25s' }}
                  />
                  {/* Label */}
                  <text x={n.x} y={n.y - 8} textAnchor="middle"
                    fontSize={isSelected ? 13 : 12} fontWeight="800"
                    fill={isSelected ? '#ffffff' : '#222222'}
                    opacity={isDimmed ? 0.2 : 1}
                    style={{ transition:'opacity 0.25s' }}>
                    {n.label}
                  </text>
                  {/* Sublabel */}
                  <text x={n.x} y={n.y + 11} textAnchor="middle"
                    fontSize={10} fontWeight="600"
                    fill={isSelected ? 'rgba(255,255,255,0.85)' : '#4f4f4f'}
                    opacity={isDimmed ? 0.2 : 1}
                    style={{ transition:'opacity 0.25s' }}>
                    {n.sub}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── Info panel ── */}
        <div className="rounded-[18px] overflow-hidden transition-all duration-300 card-shadow"
          style={{
            border: selNode ? `2px solid ${selNode.color}` : '1px solid rgba(0,154,147,0.15)',
            background: '#ffffff',
            minHeight: 100,
          }}>
          {selNode ? (
            <div>
              <div className="px-7 py-5 flex flex-wrap items-center gap-4"
                style={{ background:`${selNode.color}0f`, borderBottom:`1px solid ${selNode.color}25` }}>
                <div>
                  <div className="font-black text-[22px]" style={{ color: selNode.color }}>{selNode.label}</div>
                  <div className="font-mono text-[12px] font-bold mt-0.5" style={{ color:'#4f4f4f' }}>{selNode.sub}</div>
                </div>
                <div className="ml-auto font-mono text-[13px] font-bold px-4 py-2 rounded-xl"
                  style={{ background:`${selNode.color}15`, border:`1px solid ${selNode.color}35`, color: selNode.color }}>
                  {selNode.tech}
                </div>
              </div>
              <div className="px-7 py-5">
                <p className="leading-[1.8]" style={{ fontSize:'17px', color:'#333333' }}>{selNode.desc}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {/* Conexiones */}
                  {EDGES.filter(e => e.from === selNode.id || e.to === selNode.id).map((e, i) => {
                    const other = e.from === selNode.id ? getNode(e.to) : getNode(e.from)
                    const dir   = e.from === selNode.id ? '→' : '←'
                    return (
                      <button key={i} onClick={() => setSelected(other.id)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-[13px] transition-all hover:-translate-y-0.5"
                        style={{ background:`${e.color}12`, border:`1px solid ${e.color}40`, color: e.color }}>
                        <span style={{ opacity:0.6 }}>{dir}</span> {other.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 gap-3">
              <div className="w-2 h-2 rounded-full animate-blink" style={{ background:'#009A93' }} />
              <span className="font-mono text-[14px] font-bold" style={{ color:'#4f4f4f' }}>
                Selecciona un nodo para explorar su rol en el sistema
              </span>
            </div>
          )}
        </div>

        {/* ── Leyenda ── */}
        <div className="mt-8 flex flex-wrap gap-5">
          {[
            { color:'#009A93', label:'Flujo de datos / predicciones' },
            { color:'#E37200', label:'Señales y alertas' },
            { color:'#6b21a8', label:'Decisiones del agente IA' },
            { color:'#555555', label:'Persistencia y almacenamiento' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <svg width="28" height="10">
                <line x1="0" y1="5" x2="22" y2="5" stroke={l.color} strokeWidth="2" />
                <polygon points="22,2 28,5 22,8" fill={l.color} />
              </svg>
              <span className="font-mono text-[12px] font-bold" style={{ color:'#4f4f4f' }}>{l.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
