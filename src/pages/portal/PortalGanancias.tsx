import { useMemo } from 'react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getPerformance } from '../../lib/queries'
import { fmtUSD, fmtPct, fmtDate } from '../../lib/format'
import { PageHeader, Card, QueryState } from '../../components/portal/ui'
import { LineChartCompare } from '../../components/portal/charts'

const dayLabel = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short' })

const EMPTY_ROWS: Awaited<ReturnType<typeof getPerformance>> = []

export default function PortalGanancias() {
  const { data, loading, error } = useSupabaseQuery(() => getPerformance(365), [])
  const rows = data ?? EMPTY_ROWS
  const last = rows[rows.length - 1]

  // Construir series base normalizadas a 100 (portafolio vs benchmark) para comparar evolución relativa.
  const { labels, portfolioSeries, benchmarkSeries } = useMemo(() => {
    if (rows.length === 0) return { labels: [], portfolioSeries: [], benchmarkSeries: [] }
    const lbls = rows.map(r => dayLabel.format(new Date(r.snapshot_date)))
    let cumPort = 100, cumBench = 100
    const port: number[] = [100]
    const bench: number[] = [100]
    for (let i = 1; i < rows.length; i++) {
      cumPort  *= 1 + (rows[i].daily_return_pct ?? 0) / 100
      cumBench *= 1 + (rows[i].benchmark_return_pct ? rows[i].benchmark_return_pct! - (rows[i-1].benchmark_return_pct ?? 0) : 0) / 100
      port.push(cumPort)
      bench.push(cumBench)
    }
    return { labels: lbls, portfolioSeries: port, benchmarkSeries: bench }
  }, [rows])

  const kpis = last ? [
    { label: 'Valor actual',        value: fmtUSD(last.total_value), color: '#009A93' },
    { label: 'Retorno acumulado',   value: fmtPct(last.cumulative_return_pct), color: (last.cumulative_return_pct ?? 0) >= 0 ? '#1a7a3c' : '#c0392b' },
    { label: 'Benchmark (IPSA)',    value: fmtPct(last.benchmark_return_pct), color: '#E37200' },
    { label: 'Alpha vs benchmark',  value: fmtPct((last.cumulative_return_pct ?? 0) - (last.benchmark_return_pct ?? 0)), color: '#6b21a8' },
  ] : []

  return (
    <>
      <PageHeader tag="Portal · Ganancias" title="Rendimiento del portafolio"
        subtitle="Evolución del valor total comparada con el benchmark del mercado (IPSA)." />

      <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="Aún no hay métricas de rendimiento.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {kpis.map(k => (
            <Card key={k.label} className="p-5" style={{ borderTop: `3px solid ${k.color}` }}>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4f4f4f' }}>{k.label}</div>
              <div className="font-sans font-black leading-none tabular-nums" style={{ fontSize: 'clamp(20px,3vw,28px)', color: k.color }}>{k.value}</div>
            </Card>
          ))}
        </div>

        {/* Comparación: Portafolio vs Benchmark (base 100) */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
            <h2 className="font-bold text-[16px]" style={{ color: '#333333' }}>Evolución relativa (base 100)</h2>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color:'#4f4f4f' }}>
              últimos {rows.length} días
            </span>
          </div>
          <p className="leading-[1.5] mb-4" style={{ fontSize:'13px', color:'#4f4f4f' }}>
            Ambas series parten en 100 al inicio del período. La separación entre las líneas representa el alpha generado.
          </p>
          <div className="overflow-x-auto">
            <LineChartCompare
              labels={labels}
              series={[
                { label: 'Portafolio',     color: '#009A93', values: portfolioSeries },
                { label: 'Benchmark IPSA', color: '#E37200', values: benchmarkSeries },
              ]}
              height={240}
              yFormatter={(v) => v.toFixed(1)}
              title="Comparación Portafolio vs Benchmark IPSA"
            />
          </div>
        </Card>

        {/* Detalle diario */}
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
