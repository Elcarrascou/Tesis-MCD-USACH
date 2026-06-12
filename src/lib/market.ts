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
