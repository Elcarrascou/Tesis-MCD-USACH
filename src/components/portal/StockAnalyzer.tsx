import { useState } from 'react'
import type { FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { analyzeSymbol } from '../../lib/market'
import type { PredictResponse } from '../../lib/market'
import { fmtUSD, fmtPct } from '../../lib/format'
import { Card, Badge } from './ui'

// ════════════════════════════════════════════════════════════
// Buscador de stock + inferencia online (Yahoo Finance):
// XGBoost (señal compra/venta) + Random Forest (riesgo) sobre
// features técnicos de 6 meses de históricos.
// ════════════════════════════════════════════════════════════

const num = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 })

function PriceSparkline({ series, up }: { series: PredictResponse['series']; up: boolean }) {
  if (series.length < 2) return null
  const W = 560, H = 110, P = 8
  const vals = series.map(p => p.close)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const color = up ? '#1a7a3c' : '#c0392b'
  const xAt = (i: number) => P + (i / (vals.length - 1)) * (W - 2 * P)
  const yAt = (v: number) => P + (H - 2 * P) - ((v - min) / range) * (H - 2 * P)
  const path = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')
  const area = `${path} L ${xAt(vals.length - 1).toFixed(1)} ${H - P} L ${xAt(0).toFixed(1)} ${H - P} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Precio últimos 6 meses">
      <defs>
        <linearGradient id="sa-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sa-grad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xAt(vals.length - 1)} cy={yAt(vals[vals.length - 1])} r="3.5" fill={color} />
      <text x={P + 2} y={P + 9} fontSize="10" fontWeight="700" fill="#4f4f4f" style={{ fontFamily: '"JetBrains Mono"' }}>{fmtUSD(max)}</text>
      <text x={P + 2} y={H - P - 2} fontSize="10" fontWeight="700" fill="#4f4f4f" style={{ fontFamily: '"JetBrains Mono"' }}>{fmtUSD(min)}</text>
    </svg>
  )
}

/** Contribución de cada stump del boosting: barra divergente +/- */
function StumpBars({ stumps }: { stumps: PredictResponse['xgboost']['stumps'] }) {
  const maxAbs = Math.max(...stumps.map(s => Math.abs(s.value)), 0.1)
  return (
    <div className="flex flex-col gap-1.5">
      {stumps.map(s => {
        const pct = (Math.abs(s.value) / maxAbs) * 50
        const pos = s.value > 0
        return (
          <div key={s.name} className="flex items-center gap-2">
            <span className="text-[11px] flex-1 truncate" style={{ color: '#4f4f4f' }}>{s.name}</span>
            <div className="relative h-1.5 rounded-full flex-shrink-0" style={{ width: 120, background: 'rgba(0,154,147,0.08)' }}>
              <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'rgba(51,51,51,0.2)' }} />
              {s.value !== 0 && (
                <div className="absolute top-0 bottom-0 rounded-full"
                  style={pos
                    ? { left: '50%', width: `${pct}%`, background: '#1a7a3c' }
                    : { right: '50%', width: `${pct}%`, background: '#c0392b' }} />
              )}
            </div>
            <span className="font-mono text-[11px] font-bold tabular-nums w-10 text-right"
              style={{ color: s.value > 0 ? '#1a7a3c' : s.value < 0 ? '#c0392b' : '#4f4f4f' }}>
              {s.value > 0 ? '+' : ''}{s.value.toFixed(1)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const VOTE_COLORS: Record<string, string> = { bajo: '#1a7a3c', medio: '#E37200', alto: '#c0392b' }

export default function StockAnalyzer() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictResponse | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const symbol = input.trim().toUpperCase()
    if (!symbol || loading) return
    setLoading(true)
    setError(null)
    try {
      setResult(await analyzeSymbol(symbol))
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Error al analizar el símbolo')
    } finally {
      setLoading(false)
    }
  }

  const f = result?.features
  const featureCells = f ? [
    { label: 'RSI 14',        value: num.format(f.rsi14) },
    { label: 'SMA 20',        value: fmtUSD(f.sma20) },
    { label: 'SMA 50',        value: fmtUSD(f.sma50) },
    { label: 'Volatilidad',   value: `${num.format(f.volAnnualPct)}%` },
    { label: 'Momentum 20d',  value: fmtPct(f.momentum20Pct) },
    { label: 'Drawdown máx.', value: `${num.format(f.maxDrawdownPct)}%` },
  ] : []

  return (
    <Card className="mb-6 overflow-hidden" style={{ borderTop: '3px solid #E37200' }}>
      <div className="p-5 sm:p-6">
        <div className="section-tag" style={{ color: '#E37200' }}>Análisis online · Yahoo Finance</div>
        <h2 className="font-bold text-[17px] mb-1" style={{ color: '#333333' }}>Buscar y analizar un stock</h2>
        <p className="text-[13px] leading-[1.55] mb-4" style={{ color: '#4f4f4f' }}>
          Ingresa cualquier símbolo (ej. AAPL, MSFT, NU, ^IPSA). Se descargan 6 meses de históricos
          desde Yahoo Finance y se aplican en línea <strong>XGBoost</strong> (señal compra/venta) y{' '}
          <strong>Random Forest</strong> (clasificación de riesgo).
        </p>

        {/* Buscador */}
        <form onSubmit={onSubmit} className="flex gap-2.5 flex-wrap" role="search">
          <label htmlFor="sa-symbol" className="sr-only">Símbolo del stock</label>
          <input
            id="sa-symbol"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            placeholder="AAPL"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={12}
            className="flex-1 min-w-[140px] max-w-[220px] rounded-xl px-4 py-2.5 font-mono font-bold text-[14px] tracking-[0.04em]"
            style={{ border: '1.5px solid rgba(0,154,147,0.35)', color: '#333333', background: '#ffffff' }}
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] press disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#E37200', color: '#ffffff' }}>
            {loading
              ? <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              : <Search size={16} aria-hidden="true" />}
            {loading ? 'Analizando…' : 'Analizar'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="mt-3 text-[13px] font-semibold" role="alert" style={{ color: '#c0392b' }}>{error}</p>
        )}
      </div>

      {/* ── Resultado ── */}
      {result && (
        <div className="sa-result px-5 sm:px-6 pb-6 space-y-5" style={{ borderTop: '1px dashed rgba(227,114,0,0.3)' }}>
          {/* Quote header */}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-4">
            <span className="font-black text-[24px]" style={{ color: '#333333' }}>{result.quote.symbol}</span>
            <span className="text-[14px] font-semibold" style={{ color: '#4f4f4f' }}>{result.quote.name}</span>
            <span className="font-black text-[20px] tabular-nums ml-auto" style={{ color: '#333333' }}>
              {fmtUSD(result.quote.price)}
            </span>
            <span className="font-mono text-[14px] font-bold tabular-nums"
              style={{ color: (result.quote.changePct ?? 0) >= 0 ? '#1a7a3c' : '#c0392b' }}>
              {fmtPct(result.quote.changePct)}
            </span>
          </div>

          {/* Sparkline 6m */}
          <div className="rounded-lg p-3" style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.12)' }}>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: '#4f4f4f' }}>
              Precio · últimos 6 meses ({result.features.days} días)
            </div>
            <PriceSparkline series={result.series} up={(result.quote.changePct ?? 0) >= 0} />
          </div>

          {/* Modelos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* XGBoost */}
            <div className="rounded-xl p-4" style={{ background: '#ffffff', border: '1px solid rgba(227,114,0,0.25)', borderLeft: '3px solid #E37200' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-[15px]" style={{ color: '#E37200' }}>XGBoost</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4f4f4f' }}>Señal compra/venta</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Badge label={result.xgboost.signal} />
                <span className="font-sans font-black text-[22px] tabular-nums" style={{ color: '#E37200' }}>
                  {fmtPct(result.xgboost.confidence).replace('+', '')}
                </span>
                <span className="font-mono text-[11px] tabular-nums ml-auto" style={{ color: '#4f4f4f' }}>
                  score {result.xgboost.score > 0 ? '+' : ''}{result.xgboost.score}
                </span>
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#4f4f4f' }}>
                Contribución de cada stump
              </div>
              <StumpBars stumps={result.xgboost.stumps} />
            </div>

            {/* Random Forest */}
            <div className="rounded-xl p-4" style={{ background: '#ffffff', border: '1px solid rgba(107,33,168,0.25)', borderLeft: '3px solid #6b21a8' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-[15px]" style={{ color: '#6b21a8' }}>Random Forest</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#4f4f4f' }}>Clasificación de riesgo</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Badge label={result.randomForest.risk} />
                <span className="font-sans font-black text-[22px] tabular-nums" style={{ color: '#6b21a8' }}>
                  {result.randomForest.confidence}%
                </span>
                <span className="font-mono text-[11px] tabular-nums ml-auto" style={{ color: '#4f4f4f' }}>
                  {result.randomForest.votes[result.randomForest.risk]}/{result.randomForest.trees.length} votos
                </span>
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#4f4f4f' }}>
                Voto de cada árbol
              </div>
              <div className="flex flex-col gap-1.5">
                {result.randomForest.trees.map(t => (
                  <div key={t.name} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] truncate" style={{ color: '#4f4f4f' }}>{t.name}</span>
                    <span className="font-mono text-[11px] font-bold uppercase" style={{ color: VOTE_COLORS[t.vote] }}>{t.vote}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features técnicos */}
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4f4f4f' }}>
              Features técnicos (insumos de los modelos)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {featureCells.map(c => (
                <div key={c.label} className="rounded-lg px-3 py-2" style={{ background: '#f5fffe', border: '1px solid rgba(0,154,147,0.12)' }}>
                  <div className="font-mono text-[9px] font-bold uppercase tracking-[0.06em]" style={{ color: '#4f4f4f' }}>{c.label}</div>
                  <div className="font-bold text-[14px] tabular-nums mt-0.5" style={{ color: '#333333' }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] leading-[1.5]" style={{ color: '#4f4f4f' }}>
            Inferencia demo calculada en línea sobre features técnicos de Yahoo Finance.
            Los modelos entrenados de la tesis corren en el backend Python/FastAPI.
          </p>
        </div>
      )}

      <style>{`
        .sa-result {
          animation: sa-in 360ms var(--ease-out);
        }
        @keyframes sa-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sa-result { animation: none; }
        }
      `}</style>
    </Card>
  )
}
