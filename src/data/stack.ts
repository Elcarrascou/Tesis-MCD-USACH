import type { StackRow, DbTable, BudgetItem, CostType } from '../types'

// ════════════════════════════════════════════════════════════
// Sección 05 — Stack tecnológico y Sección 06 — Presupuesto
// ════════════════════════════════════════════════════════════

export const COST_COLORS: Record<CostType, string> = {
  free:  '#1a7a3c',
  paid:  '#E37200',
  owned: '#009A93',
}

export const STACK_ROWS: StackRow[] = [
  { comp: 'Broker + datos en tiempo real', tech: 'Alpaca API',                      techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Datos históricos ML',           tech: 'Yahoo Finance (yfinance)',         techColor: '#E37200', cost: '$0',          costType: 'free' },
  { comp: 'Agente IA',                     tech: 'OpenClaw',                         techColor: '#6b21a8', cost: '$6.29/mes',   costType: 'paid' },
  { comp: 'Hosting agente',                tech: 'Hostinger',                        techColor: '#333333', cost: 'incluido',    costType: 'paid' },
  { comp: 'Motores IA',                    tech: 'Claude · OpenAI · Ollama · Qwen', techColor: '#333333', cost: '$0 / mínimo', costType: 'free' },
  { comp: 'Frontend',                      tech: 'React + Tailwind CSS',             techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Deploy frontend',               tech: 'Vercel + GitHub',                 techColor: '#E37200', cost: '$0',          costType: 'free' },
  { comp: 'Backend API',                   tech: 'FastAPI (Python)',                 techColor: '#009A93', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Hosting backend',               tech: 'Railway',                          techColor: '#555555', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Base de datos',                 tech: 'Supabase (PostgreSQL)',            techColor: '#333333', cost: '~$25/mes',    costType: 'paid' },
  { comp: 'IDE principal',                 tech: 'Claude Code',                      techColor: '#009A93', cost: '~$100/mes',   costType: 'paid' },
  { comp: 'IDE monitoreo',                 tech: 'Antigravity · Gemini',            techColor: '#333333', cost: 'ya pagado',   costType: 'owned' },
]

export const DB_TABLES: DbTable[] = [
  { name: 'portfolio',      desc: 'Posiciones actuales',        color: '#009A93' },
  { name: 'movements',      desc: 'Historial transacciones',    color: '#E37200' },
  { name: 'ai_decisions',   desc: 'Decisiones del agente IA',   color: '#6b21a8' },
  { name: 'ml_predictions', desc: 'Resultados ML',              color: '#1a7a3c' },
  { name: 'performance',    desc: 'Ganancias y métricas',       color: '#009A93' },
]

export const BUDGET_DEV: BudgetItem[] = [
  { name: 'Claude Code (suscripción alta)', cost: '~$100 USD', type: 'paid' },
  { name: 'Antigravity (IDE)',               cost: 'ya pagado',  type: 'owned' },
  { name: 'Google One 5TB + Gemini',         cost: 'ya pagado',  type: 'owned' },
  { name: 'GitHub',                          cost: '$0',         type: 'free' },
  { name: 'Vercel',                          cost: '$0',         type: 'free' },
]

export const BUDGET_INFRA: BudgetItem[] = [
  { name: 'Supabase Pro',             cost: '~$25 USD',  type: 'paid' },
  { name: 'Hostinger OpenClaw',       cost: '$6.29 USD', type: 'paid' },
  { name: 'Railway (backend)',        cost: '~$5 USD',   type: 'paid' },
  { name: 'Alpaca API',               cost: '$0',        type: 'free' },
  { name: 'Yahoo Finance (yfinance)', cost: '$0',        type: 'free' },
]

export const BUDGET_TOTALS = {
  monthly: '~$136 USD',
  total: '~$272 USD',
  note: 'Los motores de IA para OpenClaw usarán modelos gratuitos o de bajo costo (Ollama, Qwen) para operación diaria. Claude/OpenAI se reservan para decisiones más complejas.',
}
