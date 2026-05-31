import type { SystemNode, SystemEdge } from '../types'

// ════════════════════════════════════════════════════════════
// Página /solucion — Diagrama interactivo del sistema completo
// Geometría de nodos + conexiones animadas
// ════════════════════════════════════════════════════════════

export const NODE_W = 112  // ancho del nodo
export const NODE_H = 52   // alto del nodo
export const NODE_R = 10   // radio de esquina

export const SYSTEM_NODES: SystemNode[] = [
  // — Datos —
  { id:'yahoo',   label:'Yahoo Finance', sub:'Datos históricos',     x:90,  y:150, color:'#E37200',
    desc:'Proporciona series históricas de precios del IPSA y Dow Jones para entrenar los 4 modelos ML.', tech:'Python · yfinance' },
  { id:'alpaca',  label:'Alpaca API',    sub:'Tiempo real + broker', x:90,  y:350, color:'#009A93',
    desc:'Broker API-first con paper trading global y datos de mercado en tiempo real para ejecutar órdenes.', tech:'Alpaca Trade API' },

  // — ML —
  { id:'lstm',    label:'LSTM',          sub:'Precio futuro',      x:290, y:70,  color:'#009A93',
    desc:'Red neuronal recurrente que aprende dependencias temporales y predice el precio futuro del activo.', tech:'TensorFlow · Keras' },
  { id:'xgb',     label:'XGBoost',       sub:'Señal compra/venta', x:290, y:195, color:'#E37200',
    desc:'Gradient boosting con indicadores técnicos, precio y volumen para generar la señal de trading.', tech:'XGBoost · Python' },
  { id:'prophet', label:'Prophet',       sub:'Tendencia IPSA',     x:290, y:320, color:'#1a7a3c',
    desc:'Modelo de Meta AI que descompone estacionalidad y tendencia del mercado a mediano plazo.', tech:'Meta Prophet' },
  { id:'rf',      label:'Random Forest', sub:'Nivel de riesgo',    x:290, y:445, color:'#6b21a8',
    desc:'Clasifica el riesgo del activo (bajo / medio / alto) mediante votación de múltiples árboles.', tech:'scikit-learn' },

  // — Backend —
  { id:'fastapi', label:'FastAPI',  sub:'Consolidación', x:490, y:195, color:'#009A93',
    desc:'Consolida las 4 predicciones ML en un único endpoint REST que consume el agente OpenClaw.', tech:'FastAPI · Railway' },
  { id:'supa',    label:'Supabase', sub:'PostgreSQL',    x:490, y:390, color:'#555555',
    desc:'Almacena portfolio, movimientos, decisiones IA, predicciones ML y métricas de rendimiento.', tech:'Supabase Pro · PostgreSQL' },

  // — IA —
  { id:'openclaw', label:'OpenClaw',    sub:'Agente autónomo',   x:690, y:195, color:'#6b21a8',
    desc:'Orquesta los modelos ML, razona sobre el mercado y genera recomendaciones de rebalanceo.', tech:'OpenClaw · Hostinger' },
  { id:'llms',     label:'Motores LLM', sub:'Claude/GPT/Ollama', x:690, y:370, color:'#333333',
    desc:'Motores de lenguaje que alimentan a OpenClaw: Claude para decisiones complejas, Ollama para uso diario.', tech:'Anthropic · OpenAI · Ollama' },

  // — Output —
  { id:'webapp',   label:'React Web App', sub:'Dashboard',  x:890, y:155, color:'#009A93',
    desc:'Visualiza posiciones, predicciones ML, decisiones IA y rendimiento. Incluye enlace directo a Alpaca.', tech:'React · Tailwind · Vercel' },
  { id:'telegram', label:'Telegram',      sub:'Chatbot IA', x:890, y:350, color:'#E37200',
    desc:'Canal proactivo del agente para alertas, recomendaciones y resumen diario del portafolio.', tech:'Telegram Bot API' },
]

export const SYSTEM_EDGES: SystemEdge[] = [
  { from:'yahoo',   to:'lstm',     color:'#E37200', dur:2.2, delay:0   },
  { from:'yahoo',   to:'xgb',      color:'#E37200', dur:2.5, delay:0.4 },
  { from:'yahoo',   to:'prophet',  color:'#E37200', dur:2.8, delay:0.8 },
  { from:'yahoo',   to:'rf',       color:'#E37200', dur:3.1, delay:1.2 },
  { from:'alpaca',  to:'fastapi',  color:'#009A93', dur:2.0, delay:0.3 },
  { from:'lstm',    to:'fastapi',  color:'#009A93', dur:2.0, delay:0.6 },
  { from:'xgb',     to:'fastapi',  color:'#E37200', dur:2.0, delay:0.9 },
  { from:'prophet', to:'fastapi',  color:'#1a7a3c', dur:2.0, delay:1.1 },
  { from:'rf',      to:'fastapi',  color:'#6b21a8', dur:2.0, delay:1.4 },
  { from:'fastapi', to:'openclaw', color:'#6b21a8', dur:1.8, delay:0.5 },
  { from:'fastapi', to:'supa',     color:'#555555', dur:2.2, delay:0.8 },
  { from:'llms',    to:'openclaw', color:'#555555', dur:1.6, delay:0.2 },
  { from:'supa',    to:'webapp',   color:'#555555', dur:2.0, delay:0.6 },
  { from:'openclaw',to:'webapp',   color:'#009A93', dur:1.8, delay:0.3 },
  { from:'openclaw',to:'telegram', color:'#E37200', dur:1.8, delay:0.7 },
]

export const SYSTEM_LAYERS = [
  { label:'Datos de mercado', x:90  },
  { label:'Modelos ML',       x:290 },
  { label:'Backend',          x:490 },
  { label:'Agente IA',        x:690 },
  { label:'Interfaz usuario', x:890 },
]

export const SYSTEM_LEGEND = [
  { color:'#009A93', label:'Flujo de datos / predicciones' },
  { color:'#E37200', label:'Señales y alertas' },
  { color:'#6b21a8', label:'Decisiones del agente IA' },
  { color:'#555555', label:'Persistencia y almacenamiento' },
]

// Índice O(1) para lookup de nodos (js-index-maps)
export const NODE_MAP = new Map(SYSTEM_NODES.map(n => [n.id, n]))

export function getSystemNode(id: string) {
  return NODE_MAP.get(id)!
}

export function systemEdgePath(e: SystemEdge) {
  const a = getSystemNode(e.from), b = getSystemNode(e.to)
  const x1 = a.x + NODE_W / 2, y1 = a.y
  const x2 = b.x - NODE_W / 2, y2 = b.y
  const cx = (x1 + x2) / 2
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`
}

export function connectedToNode(id: string) {
  return new Set(
    SYSTEM_EDGES.filter(e => e.from === id || e.to === id).flatMap(e => [e.from, e.to])
  )
}
