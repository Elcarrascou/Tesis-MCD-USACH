import { supabase } from './supabase'
import type { Database } from './database.types'

// ════════════════════════════════════════════════════════════
// Capa de acceso a datos OPERACIONALES (Supabase / PostgreSQL)
// Solo datos dinámicos que produce el sistema real.
// El contenido estático de la tesis vive en src/data/.
// ════════════════════════════════════════════════════════════

type Tables = Database['public']['Tables']
export type Portfolio     = Tables['portfolio']['Row']
export type Movement      = Tables['movements']['Row']
export type AiDecision    = Tables['ai_decisions']['Row']
export type MlPrediction  = Tables['ml_predictions']['Row']
export type Performance   = Tables['performance']['Row']

/** Posiciones actuales del portafolio, ordenadas por valor de mercado. */
export async function getPortfolio(): Promise<Portfolio[]> {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('market_value', { ascending: false, nullsFirst: false })
  if (error) throw error
  return data ?? []
}

/** Últimos movimientos (transacciones), paginado. */
export async function getMovements(limit = 50): Promise<Movement[]> {
  const { data, error } = await supabase
    .from('movements')
    .select('*')
    .order('executed_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

/** Decisiones recientes del agente IA. */
export async function getAiDecisions(limit = 50): Promise<AiDecision[]> {
  const { data, error } = await supabase
    .from('ai_decisions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

/** Predicciones ML, opcionalmente filtradas por modelo o símbolo. */
export async function getMlPredictions(opts: { model?: string; symbol?: string; limit?: number } = {}): Promise<MlPrediction[]> {
  let query = supabase
    .from('ml_predictions')
    .select('*')
    .order('predicted_at', { ascending: false })
    .limit(opts.limit ?? 50)
  if (opts.model)  query = query.eq('model', opts.model)
  if (opts.symbol) query = query.eq('symbol', opts.symbol)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

/** Serie de rendimiento del portafolio para gráficos. */
export async function getPerformance(limit = 365): Promise<Performance[]> {
  const { data, error } = await supabase
    .from('performance')
    .select('*')
    .order('snapshot_date', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data ?? []
}
