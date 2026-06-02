import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { useRealtimeChannel } from '../../hooks/useRealtimeChannel'
import { useToast } from '../../context/ToastContext'
import { getMlPredictions } from '../../lib/queries'
import type { MlPrediction } from '../../lib/queries'
import { fmtDateTime, fmtPct, fmtUSD } from '../../lib/format'
import { PageHeader, Card, QueryState, Badge } from '../../components/portal/ui'
import PredictionDetail from '../../components/portal/PredictionDetail'

const MODEL_META: Record<string, { label: string; color: string }> = {
  lstm:          { label: 'LSTM',          color: '#009A93' },
  xgboost:       { label: 'XGBoost',       color: '#E37200' },
  prophet:       { label: 'Prophet',       color: '#1a7a3c' },
  random_forest: { label: 'Random Forest', color: '#6b21a8' },
}

export default function PortalModelos() {
  const { data, loading, error, setData } = useSupabaseQuery(() => getMlPredictions({ limit: 100 }), [])
  const rows = data ?? []
  const [highlightId, setHighlightId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { push } = useToast()

  useRealtimeChannel('ml_predictions', (row) => {
    setData((prev: MlPrediction[] | null) => [row, ...(prev ?? [])])
    setHighlightId(row.id)
    const meta = MODEL_META[row.model] ?? { label: row.model, color: '#009A93' }
    push({
      icon: '🔬',
      title: `${meta.label} → ${row.symbol}`,
      body: row.signal ? `Señal: ${row.signal}` : row.predicted_value != null ? `Valor: ${row.predicted_value}` : undefined,
      color: meta.color,
    })
    setTimeout(() => setHighlightId(null), 1800)
  })

  function toggleExpand(id: number) {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <>
      <PageHeader tag="Portal · Modelos ML" title="Predicciones de los modelos"
        subtitle="Salidas más recientes de los 4 modelos de Machine Learning. Click en una predicción para ver detalle técnico, evolución histórica y consenso del ensemble." />

      <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="Aún no hay predicciones generadas.">
        <div className="flex flex-col gap-4">
          {rows.map(p => {
            const meta = MODEL_META[p.model] ?? { label: p.model, color: '#009A93' }
            const isNew = p.id === highlightId
            const isExpanded = p.id === expandedId
            const cardId = `pred-${p.id}`
            return (
              <Card key={p.id}
                style={{
                  borderTop: `3px solid ${meta.color}`,
                  animation: isNew ? 'rt-card-flash 1800ms' : undefined,
                  transition: 'border-color 220ms var(--ease-out)',
                  borderColor: isExpanded ? `${meta.color}80` : undefined,
                }}>
                {/* ── Header clickeable ── */}
                <button type="button"
                  onClick={() => toggleExpand(p.id)}
                  aria-expanded={isExpanded}
                  aria-controls={cardId}
                  className="w-full text-left p-5 press"
                  style={{ borderRadius: '16px' }}>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-bold text-[15px]" style={{ color: meta.color }}>{meta.label}</span>
                    <span className="font-bold text-[15px]" style={{ color: '#333333' }}>{p.symbol}</span>
                    <span className="font-mono text-[11px]" style={{ color: '#4f4f4f' }}>{fmtDateTime(p.predicted_at)}</span>
                    <ChevronDown size={18} aria-hidden="true"
                      className="ml-auto"
                      style={{
                        color: meta.color,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 280ms var(--ease-out)',
                      }} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4f4f4f' }}>Tipo</div>
                      <div className="text-[14px] font-semibold capitalize" style={{ color: '#333333' }}>{p.prediction_type}</div>
                    </div>
                    {p.predicted_value != null && (
                      <div>
                        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4f4f4f' }}>Valor</div>
                        <div className="text-[14px] font-semibold tabular-nums" style={{ color: '#333333' }}>{fmtUSD(p.predicted_value)}</div>
                      </div>
                    )}
                    {p.signal && (
                      <div>
                        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: '#4f4f4f' }}>Señal</div>
                        <Badge label={p.signal} />
                      </div>
                    )}
                    {p.confidence != null && (
                      <div>
                        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4f4f4f' }}>Confianza</div>
                        <div className="text-[14px] font-semibold tabular-nums" style={{ color: meta.color }}>{fmtPct(p.confidence)}</div>
                      </div>
                    )}
                    {p.horizon_days != null && (
                      <div>
                        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4f4f4f' }}>Horizonte</div>
                        <div className="text-[14px] font-semibold tabular-nums" style={{ color: '#333333' }}>{p.horizon_days} días</div>
                      </div>
                    )}
                  </div>
                </button>

                {/* ── Detalle expandido ── */}
                {isExpanded && (
                  <div id={cardId}>
                    <PredictionDetail prediction={p} />
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
        [style*="rt-card-flash"] { animation-timing-function: var(--ease-out); }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>
    </>
  )
}
