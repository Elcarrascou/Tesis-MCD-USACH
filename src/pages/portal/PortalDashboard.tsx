import { useMemo } from 'react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getPortfolio } from '../../lib/queries'
import { fmtUSD, fmtNum, fmtPct } from '../../lib/format'
import { PageHeader, Card, QueryState } from '../../components/portal/ui'
import { DonutChart } from '../../components/portal/charts'

const EMPTY_ROWS: Awaited<ReturnType<typeof getPortfolio>> = []

export default function PortalDashboard() {
  const { data, loading, error } = useSupabaseQuery(getPortfolio, [])
  const rows = data ?? EMPTY_ROWS

  const totalValue = rows.reduce((s, r) => s + (r.market_value ?? 0), 0)
  const totalPnl   = rows.reduce((s, r) => s + (r.unrealized_pnl ?? 0), 0)
  const pnlPct     = totalValue ? (totalPnl / (totalValue - totalPnl)) * 100 : 0

  // Distribución por activo (donut)
  const donutData = useMemo(
    () => rows.filter(r => (r.market_value ?? 0) > 0).map(r => ({ label: r.symbol, value: r.market_value ?? 0 })),
    [rows],
  )

  // Top winner / top loser
  const topWinner = useMemo(() => [...rows].sort((a, b) => (b.unrealized_pnl ?? 0) - (a.unrealized_pnl ?? 0))[0], [rows])
  const topLoser  = useMemo(() => [...rows].sort((a, b) => (a.unrealized_pnl ?? 0) - (b.unrealized_pnl ?? 0))[0], [rows])

  const kpis = [
    { label: 'Valor del portafolio', value: fmtUSD(totalValue), color: '#009A93' },
    { label: 'P&L no realizado',     value: fmtUSD(totalPnl), sub: fmtPct(pnlPct), color: totalPnl >= 0 ? '#1a7a3c' : '#c0392b' },
    { label: 'Posiciones activas',   value: String(rows.length), color: '#333333' },
  ]

  return (
    <>
      <PageHeader tag="Portal · Portafolio" title="Resumen del portafolio"
        subtitle="Posiciones actuales sincronizadas desde Alpaca y consolidadas por el sistema." />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {kpis.map(k => (
          <Card key={k.label} className="p-5" style={{ borderTop: `3px solid ${k.color}` }}>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4f4f4f' }}>{k.label}</div>
            <div className="font-sans font-black leading-none tabular-nums" style={{ fontSize: '30px', color: k.color }}>{k.value}</div>
            {k.sub && <div className="font-mono text-[13px] font-bold mt-1 tabular-nums" style={{ color: k.color }}>{k.sub}</div>}
          </Card>
        ))}
      </div>

      {/* Distribución + Top movers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Donut: 2 cols */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-bold text-[16px] mb-4" style={{ color:'#333333' }}>Distribución del portafolio</h2>
          <QueryState loading={loading} error={error} empty={donutData.length === 0} emptyLabel="Sin posiciones para distribuir.">
            <DonutChart
              data={donutData}
              centerValue={fmtUSD(totalValue)}
              centerLabel="Total"
              title="Distribución del portafolio por activo"
            />
          </QueryState>
        </Card>

        {/* Top movers: 1 col, vertical */}
        <Card className="p-6 flex flex-col gap-5">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color:'#4f4f4f' }}>Top ganador</div>
            {topWinner ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-[22px]" style={{ color:'#1a7a3c' }}>{topWinner.symbol}</span>
                  <span className="font-mono text-[14px] font-bold tabular-nums" style={{ color:'#1a7a3c' }}>{fmtUSD(topWinner.unrealized_pnl)}</span>
                </div>
                <div className="text-[12px] mt-0.5" style={{ color:'#4f4f4f' }}>peso {fmtPct(topWinner.weight_pct)}</div>
              </>
            ) : <div className="text-[13px]" style={{ color:'#4f4f4f' }}>—</div>}
          </div>
          <div style={{ borderTop:'1px solid rgba(0,154,147,0.12)' }} />
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color:'#4f4f4f' }}>Top perdedor</div>
            {topLoser ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-[22px]" style={{ color: (topLoser.unrealized_pnl ?? 0) < 0 ? '#c0392b' : '#1a7a3c' }}>{topLoser.symbol}</span>
                  <span className="font-mono text-[14px] font-bold tabular-nums" style={{ color: (topLoser.unrealized_pnl ?? 0) < 0 ? '#c0392b' : '#1a7a3c' }}>{fmtUSD(topLoser.unrealized_pnl)}</span>
                </div>
                <div className="text-[12px] mt-0.5" style={{ color:'#4f4f4f' }}>peso {fmtPct(topLoser.weight_pct)}</div>
              </>
            ) : <div className="text-[13px]" style={{ color:'#4f4f4f' }}>—</div>}
          </div>
        </Card>
      </div>

      {/* Positions table */}
      <Card>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
          <h2 className="font-bold text-[16px]" style={{ color: '#333333' }}>Posiciones</h2>
        </div>
        <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="Aún no hay posiciones en el portafolio.">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
                  {['Símbolo', 'Cantidad', 'Precio prom.', 'Precio actual', 'Valor', 'P&L', 'Peso'].map((h, i) => (
                    <th key={h} className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] px-6 py-3"
                      style={{ color: '#009A93', textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.symbol} className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(0,154,147,0.07)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f5fffe')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-6 py-3.5 font-bold text-[15px]" style={{ color: '#333333' }}>{r.symbol}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px]" style={{ color: '#4f4f4f' }}>{fmtNum(r.quantity)}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px]" style={{ color: '#4f4f4f' }}>{fmtUSD(r.avg_price)}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px]" style={{ color: '#4f4f4f' }}>{fmtUSD(r.current_price)}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px] font-semibold" style={{ color: '#333333' }}>{fmtUSD(r.market_value)}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px] font-bold" style={{ color: (r.unrealized_pnl ?? 0) >= 0 ? '#1a7a3c' : '#c0392b' }}>{fmtUSD(r.unrealized_pnl)}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px]" style={{ color: '#4f4f4f' }}>{fmtPct(r.weight_pct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QueryState>
      </Card>
    </>
  )
}
