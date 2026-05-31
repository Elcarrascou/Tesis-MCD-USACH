import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getAiDecisions } from '../../lib/queries'
import { fmtDateTime, fmtPct } from '../../lib/format'
import { PageHeader, Card, QueryState, Badge } from '../../components/portal/ui'

export default function PortalDecisiones() {
  const { data, loading, error } = useSupabaseQuery(() => getAiDecisions(100), [])
  const rows = data ?? []

  return (
    <>
      <PageHeader tag="Portal · Decisiones IA" title="Decisiones del agente OpenClaw"
        subtitle="Recomendaciones generadas por el agente de IA, con su justificación y nivel de confianza." />

      <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="El agente aún no ha registrado decisiones.">
        <div className="flex flex-col gap-4">
          {rows.map(d => (
            <Card key={d.id} className="p-5" style={{ borderLeft: '4px solid #6b21a8' }}>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {d.symbol && <span className="font-bold text-[16px]" style={{ color: '#333333' }}>{d.symbol}</span>}
                <Badge label={d.action} />
                {d.confidence != null && (
                  <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: '#009A93' }}>
                    confianza {fmtPct(d.confidence)}
                  </span>
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
          ))}
        </div>
      </QueryState>
    </>
  )
}
