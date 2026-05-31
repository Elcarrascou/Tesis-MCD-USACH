import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getPerformance } from '../../lib/queries'
import { fmtUSD, fmtPct, fmtDate } from '../../lib/format'
import { PageHeader, Card, QueryState } from '../../components/portal/ui'

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null
  const W = 720, H = 180, P = 8
  const min = Math.min(...values), max = Math.max(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => {
    const x = P + (i / (values.length - 1)) * (W - 2 * P)
    const y = H - P - ((v - min) / range) * (H - 2 * P)
    return [x, y]
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H - P} L${pts[0][0].toFixed(1)},${H - P} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 400 }} role="img" aria-label="Evolución del valor del portafolio">
      <defs>
        <linearGradient id="perf-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#perf-grad)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default function PortalGanancias() {
  const { data, loading, error } = useSupabaseQuery(() => getPerformance(365), [])
  const rows = data ?? []
  const last = rows[rows.length - 1]
  const values = rows.map(r => r.total_value)

  const kpis = last ? [
    { label: 'Valor actual',        value: fmtUSD(last.total_value), color: '#009A93' },
    { label: 'Retorno acumulado',   value: fmtPct(last.cumulative_return_pct), color: (last.cumulative_return_pct ?? 0) >= 0 ? '#1a7a3c' : '#c0392b' },
    { label: 'Benchmark (IPSA)',    value: fmtPct(last.benchmark_return_pct), color: '#E37200' },
  ] : []

  return (
    <>
      <PageHeader tag="Portal · Ganancias" title="Rendimiento del portafolio"
        subtitle="Evolución del valor total comparado con el benchmark del mercado." />

      <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="Aún no hay métricas de rendimiento.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {kpis.map(k => (
            <Card key={k.label} className="p-5" style={{ borderTop: `3px solid ${k.color}` }}>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4f4f4f' }}>{k.label}</div>
              <div className="font-sans font-black leading-none tabular-nums" style={{ fontSize: '28px', color: k.color }}>{k.value}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-6">
          <h2 className="font-bold text-[16px] mb-4" style={{ color: '#333333' }}>Evolución del valor (últimos {rows.length} días)</h2>
          <div className="overflow-x-auto"><Sparkline values={values} color="#009A93" /></div>
        </Card>

        <Card>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
            <h2 className="font-bold text-[16px]" style={{ color: '#333333' }}>Detalle diario</h2>
          </div>
          <div className="overflow-x-auto" style={{ maxHeight: 360 }}>
            <table className="w-full" style={{ minWidth: 560 }}>
              <thead className="sticky top-0" style={{ background: '#f5fffe' }}>
                <tr style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
                  {['Fecha', 'Valor total', 'Retorno diario', 'Acumulado', 'Benchmark'].map((h, i) => (
                    <th key={h} className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] px-6 py-3"
                      style={{ color: '#009A93', textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...rows].reverse().map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(0,154,147,0.07)' }}>
                    <td className="px-6 py-3 text-[13px] tabular-nums" style={{ color: '#4f4f4f' }}>{fmtDate(r.snapshot_date)}</td>
                    <td className="px-6 py-3 text-right text-[14px] tabular-nums font-semibold" style={{ color: '#333333' }}>{fmtUSD(r.total_value)}</td>
                    <td className="px-6 py-3 text-right text-[14px] tabular-nums" style={{ color: (r.daily_return_pct ?? 0) >= 0 ? '#1a7a3c' : '#c0392b' }}>{fmtPct(r.daily_return_pct)}</td>
                    <td className="px-6 py-3 text-right text-[14px] tabular-nums" style={{ color: '#4f4f4f' }}>{fmtPct(r.cumulative_return_pct)}</td>
                    <td className="px-6 py-3 text-right text-[14px] tabular-nums" style={{ color: '#E37200' }}>{fmtPct(r.benchmark_return_pct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </QueryState>
    </>
  )
}
