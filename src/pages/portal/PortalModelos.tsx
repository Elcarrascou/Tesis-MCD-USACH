import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { useRealtimeChannel } from '../../hooks/useRealtimeChannel'
import { useToast } from '../../context/ToastContext'
import { getMlPredictions } from '../../lib/queries'
import type { MlPrediction } from '../../lib/queries'
import { fmtDateTime, fmtPct, fmtUSD } from '../../lib/format'
import { PageHeader, Card, QueryState, Badge } from '../../components/portal/ui'
import PredictionDetail from '../../components/portal/PredictionDetail'
import StockAnalyzer from '../../components/portal/StockAnalyzer'

const MODEL_META: Record<string, { label: string; color: string; order: number }> = {
  lstm:          { label: 'LSTM',          color: '#009A93', order: 0 },
  xgboost:       { label: 'XGBoost',       color: '#E37200', order: 1 },
  prophet:       { label: 'Prophet',       color: '#1a7a3c', order: 2 },
  random_forest: { label: 'Random Forest', color: '#6b21a8', order: 3 },
}

interface SymbolGroup {
  symbol: string
  /** Predicción más reciente de cada modelo, en orden fijo de modelo. */
  latest: MlPrediction[]
  /** Timestamp de la predicción más nueva del grupo (para ordenar). */
  newestAt: string
}

export default function PortalModelos() {
  const { data, loading, error, setData } = useSupabaseQuery(() => getMlPredictions({ limit: 100 }), [])
  const [highlightSymbol, setHighlightSymbol] = useState<string | null>(null)
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null)
  const [expandedPredId, setExpandedPredId] = useState<number | null>(null)
  const { push } = useToast()

  useRealtimeChannel('ml_predictions', (row) => {
    setData((prev: MlPrediction[] | null) => [row, ...(prev ?? [])])
    setHighlightSymbol(row.symbol)
    const meta = MODEL_META[row.model] ?? { label: row.model, color: '#009A93' }
    push({
      icon: '🔬',
      title: `${meta.label} → ${row.symbol}`,
      body: row.signal ? `Señal: ${row.signal}` : row.predicted_value != null ? `Valor: ${row.predicted_value}` : undefined,
      color: meta.color,
    })
    setTimeout(() => setHighlightSymbol(null), 1800)
  })

  // Agrupar por símbolo: predicción más reciente de cada modelo
  const groups = useMemo<SymbolGroup[]>(() => {
    const bySymbol = new Map<string, Map<string, MlPrediction>>()
    for (const r of data ?? []) {
      // rows viene ordenado desc por predicted_at → la primera por (symbol, model) es la más reciente
      let models = bySymbol.get(r.symbol)
      if (!models) { models = new Map(); bySymbol.set(r.symbol, models) }
      if (!models.has(r.model)) models.set(r.model, r)
    }
    const result: SymbolGroup[] = []
    for (const [symbol, models] of bySymbol) {
      const latest = [...models.values()].sort(
        (a, b) => (MODEL_META[a.model]?.order ?? 9) - (MODEL_META[b.model]?.order ?? 9),
      )
      const newestAt = latest.reduce((max, p) => p.predicted_at > max ? p.predicted_at : max, latest[0].predicted_at)
      result.push({ symbol, latest, newestAt })
    }
    return result.sort((a, b) => b.newestAt.localeCompare(a.newestAt))
  }, [data])

  function toggleSymbol(symbol: string) {
    setExpandedSymbol(prev => {
      if (prev === symbol) { setExpandedPredId(null); return null }
      setExpandedPredId(null)
      return symbol
    })
  }

  return (
    <>
      <PageHeader tag="Portal · Modelos ML" title="Predicciones por stock"
        subtitle="Predicciones agrupadas por símbolo: click en un stock para desplegar los modelos con sus resultados. O busca cualquier stock y aplícale los modelos en línea." />

      {/* ── Buscador + inferencia online (XGBoost + Random Forest) ── */}
      <StockAnalyzer />

      <QueryState loading={loading} error={error} empty={groups.length === 0} emptyLabel="Aún no hay predicciones generadas.">
        <div className="flex flex-col gap-4">
          {groups.map(g => {
            const isOpen = g.symbol === expandedSymbol
            const isNew = g.symbol === highlightSymbol
            const groupId = `sym-${g.symbol}`
            return (
              <Card key={g.symbol}
                style={{
                  borderTop: '3px solid #009A93',
                  animation: isNew ? 'rt-card-flash 1800ms' : undefined,
                  borderColor: isOpen ? 'rgba(0,154,147,0.5)' : undefined,
                  transition: 'border-color 220ms var(--ease-out)',
                }}>
                {/* ── Header del stock ── */}
                <button type="button"
                  onClick={() => toggleSymbol(g.symbol)}
                  aria-expanded={isOpen}
                  aria-controls={groupId}
                  className="w-full text-left p-5 press"
                  style={{ borderRadius: '16px' }}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-black text-[20px]" style={{ color: '#333333' }}>{g.symbol}</span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,154,147,0.08)', border: '1px solid rgba(0,154,147,0.25)', color: '#009A93' }}>
                      {g.latest.length} modelo{g.latest.length !== 1 ? 's' : ''}
                    </span>
                    <span className="font-mono text-[11px]" style={{ color: '#4f4f4f' }}>{fmtDateTime(g.newestAt)}</span>
                    <ChevronDown size={18} aria-hidden="true"
                      className="ml-auto flex-shrink-0"
                      style={{
                        color: '#009A93',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 280ms var(--ease-out)',
                      }} />
                  </div>
                  {/* Resumen: chip por modelo con su salida principal */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {g.latest.map(p => {
                      const meta = MODEL_META[p.model] ?? { label: p.model, color: '#009A93', order: 9 }
                      return (
                        <span key={p.model} className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg tabular-nums"
                          style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}35`, color: meta.color }}>
                          {meta.label}
                          <span style={{ color: '#333333' }}>
                            {p.signal ? p.signal.toUpperCase() : p.predicted_value != null ? fmtUSD(p.predicted_value) : '—'}
                          </span>
                        </span>
                      )
                    })}
                  </div>
                </button>

                {/* ── Modelos del stock (expandido) ── */}
                {isOpen && (
                  <div id={groupId} className="px-4 sm:px-5 pb-5 space-y-3"
                    style={{ borderTop: '1px dashed rgba(0,154,147,0.25)', paddingTop: '16px', animation: 'group-expand 320ms var(--ease-out)' }}>
                    {g.latest.map(p => {
                      const meta = MODEL_META[p.model] ?? { label: p.model, color: '#009A93', order: 9 }
                      const isPredOpen = p.id === expandedPredId
                      const predId = `pred-${p.id}`
                      return (
                        <div key={p.id} className="rounded-xl overflow-hidden"
                          style={{ background: '#ffffff', border: `1px solid ${meta.color}30`, borderLeft: `3px solid ${meta.color}` }}>
                          <button type="button"
                            onClick={() => setExpandedPredId(prev => prev === p.id ? null : p.id)}
                            aria-expanded={isPredOpen}
                            aria-controls={predId}
                            className="w-full text-left px-4 py-3.5 press"
                            style={{ borderRadius: '12px' }}>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                              <span className="font-bold text-[14px] w-[110px]" style={{ color: meta.color }}>{meta.label}</span>
                              <span className="text-[13px] capitalize" style={{ color: '#4f4f4f' }}>{p.prediction_type}</span>
                              {p.predicted_value != null && (
                                <span className="text-[13px] font-semibold tabular-nums" style={{ color: '#333333' }}>{fmtUSD(p.predicted_value)}</span>
                              )}
                              {p.signal && <Badge label={p.signal} />}
                              {p.confidence != null && (
                                <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: meta.color }}>{fmtPct(p.confidence)}</span>
                              )}
                              {p.horizon_days != null && (
                                <span className="font-mono text-[11px] tabular-nums" style={{ color: '#4f4f4f' }}>{p.horizon_days}d</span>
                              )}
                              <ChevronDown size={15} aria-hidden="true"
                                className="ml-auto flex-shrink-0"
                                style={{
                                  color: meta.color,
                                  transform: isPredOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 280ms var(--ease-out)',
                                }} />
                            </div>
                          </button>
                          {isPredOpen && (
                            <div id={predId}>
                              <PredictionDetail prediction={p} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </QueryState>

      <style>{`
        @keyframes rt-card-flash {
          0%   { box-shadow: 0 0 0 0 rgba(0,154,147,0); transform: translateY(-6px); opacity: 0.7; }
          15%  { box-shadow: 0 0 0 5px rgba(0,154,147,0.32); transform: translateY(0); opacity: 1; }
          100% { box-shadow: 0 0 0 0 rgba(0,154,147,0); }
        }
        @keyframes group-expand {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="rt-card-flash"], [style*="group-expand"] { animation: none !important; }
        }
      `}</style>
    </>
  )
}
