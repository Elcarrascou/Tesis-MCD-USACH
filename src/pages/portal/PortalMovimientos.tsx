import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getMovements } from '../../lib/queries'
import { fmtUSD, fmtNum, fmtDateTime } from '../../lib/format'
import { PageHeader, Card, QueryState, Badge } from '../../components/portal/ui'

export default function PortalMovimientos() {
  const { data, loading, error } = useSupabaseQuery(() => getMovements(100), [])
  const rows = data ?? []

  return (
    <>
      <PageHeader tag="Portal · Movimientos" title="Historial de transacciones"
        subtitle="Órdenes de compra y venta ejecutadas, sincronizadas desde Alpaca." />

      <Card>
        <QueryState loading={loading} error={error} empty={rows.length === 0} emptyLabel="Aún no hay movimientos registrados.">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
                  {['Fecha', 'Símbolo', 'Tipo', 'Cantidad', 'Precio', 'Monto'].map((h, i) => (
                    <th key={h} className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] px-6 py-3"
                      style={{ color: '#009A93', textAlign: i === 0 || i === 1 || i === 2 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(0,154,147,0.07)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f5fffe')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-6 py-3.5 text-[13px] tabular-nums" style={{ color: '#4f4f4f' }}>{fmtDateTime(r.executed_at)}</td>
                    <td className="px-6 py-3.5 font-bold text-[15px]" style={{ color: '#333333' }}>{r.symbol}</td>
                    <td className="px-6 py-3.5"><Badge label={r.side === 'buy' ? 'buy' : 'sell'} /></td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px]" style={{ color: '#4f4f4f' }}>{fmtNum(r.quantity)}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px]" style={{ color: '#4f4f4f' }}>{fmtUSD(r.price)}</td>
                    <td className="px-6 py-3.5 text-right tabular-nums text-[14px] font-semibold" style={{ color: '#333333' }}>{fmtUSD(r.amount)}</td>
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
