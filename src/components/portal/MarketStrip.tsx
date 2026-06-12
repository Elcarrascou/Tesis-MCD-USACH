import { memo } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { MARKET_INDICES } from '../../lib/market'
import type { Quote } from '../../lib/market'
import { fmtTime } from '../../lib/format'

// ════════════════════════════════════════════════════════════
// Franja de mercado en vivo (Yahoo Finance): índices de
// referencia + estado de conexión. Solo presentación.
// ════════════════════════════════════════════════════════════

const INDEX_LABELS: Record<string, string> = {
  '^IPSA': 'S&P IPSA',
  '^GSPC': 'S&P 500',
  '^IXIC': 'NASDAQ',
}

const idxNum = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 })

function IndexCell({ q }: { q: Quote }) {
  const up = (q.changePct ?? 0) >= 0
  const color = up ? '#1a7a3c' : '#c0392b'
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 flex-shrink-0">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#4f4f4f' }}>
        {INDEX_LABELS[q.symbol] ?? q.symbol}
      </span>
      <span className="font-bold text-[13px] tabular-nums" style={{ color: '#333333' }}>
        {q.price == null ? '—' : idxNum.format(q.price)}
      </span>
      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold tabular-nums" style={{ color }}>
        <Icon size={12} aria-hidden="true" />
        {q.changePct == null ? '—' : `${up ? '+' : ''}${idxNum.format(q.changePct)}%`}
      </span>
    </div>
  )
}

interface MarketStripProps {
  quotes: Record<string, Quote>
  updatedAt: Date | null
}

/** memo: el padre re-renderiza con cada cambio de datos del portafolio */
const MarketStrip = memo(function MarketStrip({ quotes, updatedAt }: MarketStripProps) {
  const indices = MARKET_INDICES.map(s => quotes[s]).filter(Boolean)
  if (indices.length === 0) return null

  return (
    <div className="rounded-xl mb-6 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-2 py-1.5"
      style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex flex-wrap items-center divide-x" style={{ borderColor: 'rgba(0,154,147,0.1)' }}>
        {indices.map(q => <IndexCell key={q.symbol} q={q} />)}
      </div>
      <div className="flex items-center gap-2 px-4 py-1.5" role="status" aria-live="off">
        <span className="w-1.5 h-1.5 rounded-full animate-blink flex-shrink-0" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: '#4f4f4f' }}>
          En vivo · Yahoo Finance{updatedAt ? ` · ${fmtTime(updatedAt)}` : ''}
        </span>
      </div>
    </div>
  )
})

export default MarketStrip
