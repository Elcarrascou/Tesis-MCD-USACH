import { useMemo } from 'react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getPerformance } from '../../lib/queries'
import { fmtUSD, fmtPct, fmtDate } from '../../lib/format'
import { PageHeader, Card, QueryState } from '../../components/portal/ui'
import { LineChartCompare, AreaChart } from '../../components/portal/charts'

const dayLabel = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', timeZone: 'UTC' })
const usdCompact = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })

const EMPTY_ROWS: Awaited<ReturnType<typeof getPerformance>> = []

export default function PortalGanancias() {
  const { data, loading, error } = useSupabaseQuery(() => getPerformance(365), [])
  const rows = data ?? EMPTY_ROWS
  const last = rows[rows.length - 1]

  // Series directas desde `performance`: equity (total_value) y retornos acumulados vs benchmark.
  const { labels, equitySeries, portfolioSeries, benchmarkSeries } = useMemo(() => {
    if (rows.length === 0) return { labels: [], equitySeries: [], portfolioSeries: [], benchmarkSeries: [] }
    return {
      labels: rows.map(r => dayLabel.format(new Date(r.snapshot_date))),
      equitySeries: rows.map(r => r.total_value ?? 0),
      portfolioSeries: rows.map(r => r.cumulative_return_pct ?? 0),
      benchmarkSeries: rows.map(r => r.benchmark_return_pct ?? 0),
    }
  }, [rows])

  const kpis = last ? [
    { label: 'Valor actual',        value: fmtUSD(last.total_value), color: '#009A93' },
    { label: 'Retorno acumulado',   value: fmtPct(last.cumulative_return_pct), color: (last.cumulative_return_pct ?? 0) >= 0 ? '#1a7a3c' : '#c0392b' },
    { label: 'Benchmark (S&P 500)',    value: fmtPct(last.benchmark_return_pct), color: '#E37200' },
    { label: 'Alpha vs benchmark',  value: fmtPct((last.cumulative_return_pct ?? 0) - (last.benchmark_return_pct ?? 0)), color: '#6b21a8' },
  ] : []

  return (
    <>
      <PageHeader tag="Portal · Ganancias" title="Rendimiento del portafolio"
        subtitle="Evolución del valor total comparada con el benchmark del mercado (S&P 500, ETF SPY)." />

      <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="Aún no hay métricas de rendimiento.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {kpis.map(k => (
            <Card key={k.label} className="p-5" style={{ borderTop: `3px solid ${k.color}` }}>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4f4f4f' }}>{k.label}</div>
              <div className="font-sans font-black leading-none tabular-nums" style={{ fontSize: 'clamp(20px,3vw,28px)', color: k.color }}>{k.value}</div>
            </Card>
          ))}
        </div>

        {/* Equity curve: valor total del portafolio */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
            <h2 className="font-bold text-[16px]" style={{ color: '#333333' }}>Curva de equity</h2>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color:'#4f4f4f' }}>
              {rows.length} días hábiles desde inception
            </span>
          </div>
          <p className="leading-[1.5] mb-4" style={{ fontSize:'13px', color:'#4f4f4f' }}>
            Valor total del portafolio (posiciones + caja) valorizado a precio de cierre diario. Cada punto es un
            snapshot generado por el pipeline automático.
          </p>
          <div className="overflow-x-auto">
            <AreaChart
              labels={labels}
              values={equitySeries}
              height={260}
              yFormatter={(v) => usdCompact.format(v)}
              lastFormatter={(v) => fmtUSD(v)}
              title="Curva de equity: valor total diario del portafolio en dólares"
            />
          </div>
        </Card>

        {/* Comparación: retorno acumulado vs benchmark */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
            <h2 className="font-bold text-[16px]" style={{ color: '#333333' }}>Retorno acumulado vs. benchmark</h2>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color:'#4f4f4f' }}>
              inception 02-ene-2026
            </span>
          </div>
          <p className="leading-[1.5] mb-4" style={{ fontSize:'13px', color:'#4f4f4f' }}>
            Retorno acumulado del portafolio frente al benchmark S&P 500 (ETF SPY) desde el inicio del período.
            La separación entre las líneas representa el alpha generado por la estrategia.
          </p>
          <div className="overflow-x-auto">
            <LineChartCompare
              labels={labels}
              series={[
                { label: 'Portafolio',     color: '#009A93', values: portfolioSeries },
                { label: 'Benchmark S&P 500', color: '#E37200', values: benchmarkSeries },
              ]}
              height={240}
              yFormatter={(v) => `${v.toFixed(1)}%`}
              title="Retorno acumulado del portafolio comparado con el benchmark S&P 500"
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
