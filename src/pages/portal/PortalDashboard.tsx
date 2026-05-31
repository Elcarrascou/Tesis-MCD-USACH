import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getPortfolio } from '../../lib/queries'
import { fmtUSD, fmtNum, fmtPct } from '../../lib/format'
import { PageHeader, Card, QueryState } from '../../components/portal/ui'

export default function PortalDashboard() {
  const { data, loading, error } = useSupabaseQuery(getPortfolio, [])
  const rows = data ?? []

  const totalValue = rows.reduce((s, r) => s + (r.market_value ?? 0), 0)
  const totalPnl   = rows.reduce((s, r) => s + (r.unrealized_pnl ?? 0), 0)
  const pnlPct     = totalValue ? (totalPnl / (totalValue - totalPnl)) * 100 : 0

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
