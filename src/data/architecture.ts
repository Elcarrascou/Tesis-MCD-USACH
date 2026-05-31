import type { ArchLayer, FlowStep, AppView } from '../types'

// ════════════════════════════════════════════════════════════
// Sección 02 — Arquitectura: capas, flujo de deploy y vistas app
// ════════════════════════════════════════════════════════════

export const ARCH_LAYERS: ArchLayer[] = [
  { color: '#009A93', label: 'Datos de mercado',       items: ['Alpaca API (tiempo real)', 'Yahoo Finance (históricos)'] },
  { color: '#E37200', label: 'Modelos ML predictivos', items: ['LSTM — Precio futuro', 'XGBoost — Señal compra/venta', 'Prophet — Tendencia IPSA', 'Random Forest — Riesgo'] },
  { color: '#6b21a8', label: 'Agente IA (OpenClaw)',   items: ['Orquestación autónoma', 'Claude · GPT · Ollama'] },
  { color: '#009A93', label: 'Backend y persistencia', items: ['FastAPI RESTful', 'Supabase (PostgreSQL)'] },
  { color: '#E37200', label: 'Frontend e interacción', items: ['React — Visualización', 'Telegram Bot — Chatbot'] },
]

export const FLOW_STEPS: FlowStep[] = [
  { icon: '✏️', label: 'Claude Code',      bg: 'rgba(0,154,147,0.1)',  border: 'rgba(0,154,147,0.35)' },
  { icon: '🐙', label: 'GitHub',            bg: '#f5fffe',              border: 'rgba(0,154,147,0.2)'  },
  { icon: '▲',  label: 'Vercel Frontend',  bg: 'rgba(227,114,0,0.08)', border: 'rgba(227,114,0,0.35)' },
  { icon: '🚄', label: 'Railway Backend',  bg: 'rgba(51,51,51,0.06)',  border: 'rgba(51,51,51,0.2)'   },
  { icon: '🌐', label: 'App producción',   bg: 'rgba(0,154,147,0.12)', border: 'rgba(0,154,147,0.4)'  },
]

export const APP_VIEWS: AppView[] = [
  { icon: '📈', title: 'Portafolio',         desc: 'Posiciones actuales, valor total y distribución de activos desde Alpaca en tiempo real.', top: '#009A93' },
  { icon: '🔄', title: 'Movimientos',        desc: 'Historial completo de transacciones sincronizadas desde Alpaca.' },
  { icon: '🧠', title: 'Decisiones IA',      desc: 'Registro de recomendaciones del agente OpenClaw con su justificación.' },
  { icon: '💰', title: 'Ganancias',          desc: 'Rendimiento del portafolio en el tiempo comparado con benchmarks del mercado.' },
  { icon: '🔬', title: 'Modelos ML',         desc: 'Predicciones actualizadas periódicamente de los 4 modelos con métricas de confianza.' },
  { icon: '↗',  title: 'Ejecutar en Alpaca', desc: 'La IA sugiere la operación. El usuario la ejecuta en Alpaca con un click directo.', special: true },
]
