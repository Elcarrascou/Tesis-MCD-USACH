import { supabase } from './supabase'

// ════════════════════════════════════════════════════════════
// Datos de mercado EN VIVO — Yahoo Finance vía Edge Function
// `yahoo-finance` (Supabase). El browser no puede llamar a
// Yahoo directo por CORS; la función actúa de proxy autenticado.
// ════════════════════════════════════════════════════════════

/** Índices de referencia que monitorea el portal. ^IPSA = benchmark de la tesis. */
export const MARKET_INDICES = ['^IPSA', '^GSPC', '^IXIC'] as const

export interface Quote {
  symbol: string
  name: string
  price: number | null
  previousClose: number | null
  change: number | null
  changePct: number | null
  currency: string
  exchange: string | null
  dayHigh: number | null
  dayLow: number | null
  volume: number | null
  marketTime: number | null
}

export interface HistoryPoint {
  time: number
  close: number
}

interface QuotesResponse {
  quotes: Quote[]
  errors?: Record<string, string>
  fetchedAt: number
}

interface HistoryResponse {
  symbol: string
  currency: string
  range: string
  interval: string
  points: HistoryPoint[]
}

// ── Inferencia en vivo (action: predict) ─────────────────────
export interface TechFeatures {
  price: number
  sma20: number
  sma50: number
  rsi14: number
  volAnnualPct: number
  volRecentPct: number
  momentum20Pct: number
  maxDrawdownPct: number
  days: number
}

export interface XgboostResult {
  signal: 'buy' | 'sell' | 'hold'
  confidence: number
  score: number
  prob: number
  stumps: { name: string; value: number }[]
}

export interface RandomForestResult {
  risk: 'bajo' | 'medio' | 'alto'
  confidence: number
  votes: Record<'bajo' | 'medio' | 'alto', number>
  trees: { name: string; vote: 'bajo' | 'medio' | 'alto' }[]
}

export interface PredictResponse {
  quote: Quote
  features: TechFeatures
  xgboost: XgboostResult
  randomForest: RandomForestResult
  series: HistoryPoint[]
  generatedAt: number
}

/** Cotizaciones en vivo para una lista de símbolos (acciones e índices `^IPSA`, `^GSPC`…). */
export async function getQuotes(symbols: string[]): Promise<QuotesResponse> {
  const { data, error } = await supabase.functions.invoke<QuotesResponse>('yahoo-finance', {
    body: { action: 'quotes', symbols },
  })
  if (error) throw error
  if (!data) throw new Error('Sin respuesta de yahoo-finance')
  return data
}

/** Serie histórica de cierres para un símbolo (para gráficos). */
export async function getHistory(symbol: string, range = '3mo', interval = '1d'): Promise<HistoryResponse> {
  const { data, error } = await supabase.functions.invoke<HistoryResponse>('yahoo-finance', {
    body: { action: 'history', symbol, range, interval },
  })
  if (error) throw error
  if (!data) throw new Error('Sin respuesta de yahoo-finance')
  return data
}

/**
 * Inferencia en vivo para un símbolo: features técnicos (6m de históricos
 * Yahoo) + XGBoost (señal) y Random Forest (riesgo). Aproximación demo
 * de los modelos de la tesis — los reales corren en Python/FastAPI.
 */
export async function analyzeSymbol(symbol: string): Promise<PredictResponse> {
  const { data, error } = await supabase.functions.invoke<PredictResponse>('yahoo-finance', {
    body: { action: 'predict', symbol },
  })
  if (error) {
    // FunctionsHttpError trae el body con el mensaje real (símbolo inválido, sin datos…)
    const ctx = (error as { context?: Response }).context
    if (ctx) {
      const body = await ctx.json().catch(() => null)
      if (body?.error) throw new Error(body.error)
    }
    throw error
  }
  if (!data) throw new Error('Sin respuesta de yahoo-finance')
  return data
}
