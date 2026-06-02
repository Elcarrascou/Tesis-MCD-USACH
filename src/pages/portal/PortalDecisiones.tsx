import { useState } from 'react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { useRealtimeChannel } from '../../hooks/useRealtimeChannel'
import { useToast } from '../../context/ToastContext'
import { getAiDecisions } from '../../lib/queries'
import type { AiDecision } from '../../lib/queries'
import { fmtDateTime, fmtPct } from '../../lib/format'
import { PageHeader, Card, QueryState, Badge } from '../../components/portal/ui'

const ACTION_COLORS: Record<string, string> = {
  buy: '#1a7a3c', sell: '#c0392b', hold: '#E37200', rebalance: '#6b21a8',
}

export default function PortalDecisiones() {
  const { data, loading, error, setData } = useSupabaseQuery(() => getAiDecisions(100), [])
  const rows = data ?? []
  const [highlightId, setHighlightId] = useState<number | null>(null)
  const { push } = useToast()

  useRealtimeChannel('ai_decisions', (row) => {
    setData((prev: AiDecision[] | null) => [row, ...(prev ?? [])])
    setHighlightId(row.id)
    push({
      icon: '🧠',
      title: `Nueva decisión IA: ${row.action.toUpperCase()}${row.symbol ? ` ${row.symbol}` : ''}`,
      body: row.rationale ?? undefined,
      color: ACTION_COLORS[row.action] ?? '#6b21a8',
    })
    // Limpiar highlight después de la animación
    setTimeout(() => setHighlightId(null), 2400)
  })

  return (
    <>
      <PageHeader tag="Portal · Decisiones IA" title="Decisiones del agente OpenClaw"
        subtitle="Recomendaciones generadas por el agente de IA, con su justificación y nivel de confianza. Las nuevas decisiones aparecen en vivo." />

      <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="El agente aún no ha registrado decisiones.">
        <div className="flex flex-col gap-4">
          {rows.map(d => {
            const isNew = d.id === highlightId
            return (
              <Card key={d.id} className="p-5"
                style={{
                  borderLeft: '4px solid #6b21a8',
                  animation: isNew ? 'rt-card-flash 2.4s ease-out' : undefined,
                }}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {d.symbol && <span className="font-bold text-[16px]" style={{ color: '#333333' }}>{d.symbol}</span>}
                  <Badge label={d.action} />
                  {d.confidence != null && (
                    <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: '#009A93' }}>
                      confianza {fmtPct(d.confidence)}
                    </span>
                  )}
                  {isNew && (
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.06em]"
                      style={{ background:'#1a7a3c', color:'#ffffff' }}>nuevo</span>
                  )}
                  <span className="ml-auto font-mono text-[12px]" style={{ color: '#4f4f4f' }}>{fmtDateTime(d.created_at)}</span>
                </div>
                {d.rationale && <p className="leading-[1.7] text-[15px]" style={{ color: '#4f4f4f' }}>{d.rationale}</p>}
                {d.engine && (
                  <div className="mt-3 inline-block font-mono text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,154,147,0.1)', border: '1px solid rgba(0,154,147,0.3)', color: '#009A93' }}>
                    motor: {d.engine}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </QueryState>

      <style>{`
        @keyframes rt-card-flash {
          0%   { box-shadow: 0 0 0 0 rgba(26,122,60,0); transform: translateY(-4px); }
          20%  { box-shadow: 0 0 0 4px rgba(26,122,60,0.35); transform: translateY(0); }
          100% { box-shadow: 0 0 0 0 rgba(26,122,60,0); }
        }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>
    </>
  )
}
