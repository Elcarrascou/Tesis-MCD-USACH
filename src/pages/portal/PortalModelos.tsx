import { useState } from 'react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { useRealtimeChannel } from '../../hooks/useRealtimeChannel'
import { useToast } from '../../context/ToastContext'
import { getMlPredictions } from '../../lib/queries'
import type { MlPrediction } from '../../lib/queries'
import { fmtDateTime, fmtPct, fmtUSD } from '../../lib/format'
import { PageHeader, Card, QueryState, Badge } from '../../components/portal/ui'

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
    setTimeout(() => setHighlightId(null), 2400)
  })

  return (
    <>
      <PageHeader tag="Portal · Modelos ML" title="Predicciones de los modelos"
        subtitle="Salidas más recientes de los 4 modelos de Machine Learning que alimentan al agente IA." />

      <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="Aún no hay predicciones generadas.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map(p => {
            const meta = MODEL_META[p.model] ?? { label: p.model, color: '#009A93' }
            const isNew = p.id === highlightId
            return (
              <Card key={p.id} className="p-5"
                style={{
                  borderTop: `3px solid ${meta.color}`,
                  animation: isNew ? 'rt-card-flash 2.4s ease-out' : undefined,
                }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-bold text-[15px]" style={{ color: meta.color }}>{meta.label}</span>
                  <span className="font-bold text-[15px]" style={{ color: '#333333' }}>{p.symbol}</span>
                  <span className="ml-auto font-mono text-[11px]" style={{ color: '#4f4f4f' }}>{fmtDateTime(p.predicted_at)}</span>
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
                      <div className="text-[14px] font-semibold tabular-nums" style={{ color: '#009A93' }}>{fmtPct(p.confidence)}</div>
                    </div>
                  )}
                  {p.horizon_days != null && (
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4f4f4f' }}>Horizonte</div>
                      <div className="text-[14px] font-semibold tabular-nums" style={{ color: '#333333' }}>{p.horizon_days} días</div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </QueryState>

      <style>{`
        @keyframes rt-card-flash {
          0%   { box-shadow: 0 0 0 0 rgba(0,154,147,0); transform: translateY(-4px); }
          20%  { box-shadow: 0 0 0 4px rgba(0,154,147,0.35); transform: translateY(0); }
          100% { box-shadow: 0 0 0 0 rgba(0,154,147,0); }
        }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>
    </>
  )
}
