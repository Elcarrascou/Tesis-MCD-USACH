import { useMemo } from 'react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getPredictionHistory, getPredictionsBySymbol, getDecisionsBySymbol } from '../../lib/queries'
import type { MlPrediction } from '../../lib/queries'
import { ML_MODELS } from '../../data/models'
import { fmtDateTime, fmtPct, fmtUSD } from '../../lib/format'
import { Badge } from './ui'

const MODEL_META: Record<string, { label: string; color: string; modelKey: string }> = {
  lstm:          { label: 'LSTM',          color: '#009A93', modelKey: '01' },
  xgboost:       { label: 'XGBoost',       color: '#E37200', modelKey: '02' },
  prophet:       { label: 'Prophet',       color: '#1a7a3c', modelKey: '03' },
  random_forest: { label: 'Random Forest', color: '#6b21a8', modelKey: '04' },
}

// ════════════════════════════════════════════════════════════
// Sparkline simple: confianza histórica del (symbol, model)
// ════════════════════════════════════════════════════════════
function ConfidenceSparkline({ rows, color }: { rows: MlPrediction[]; color: string }) {
  const filtered = rows.filter(r => r.confidence != null)
  if (filtered.length < 2) {
    return (
      <div className="text-[12px] font-mono text-center py-6" style={{ color: '#4f4f4f' }}>
        Sin historial suficiente para sparkline
      </div>
    )
  }
  const W = 520, H = 90, P = 6
  const vals = filtered.map(r => r.confidence!)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const xAt = (i: number) => P + (i / (vals.length - 1)) * (W - 2 * P)
  const yAt = (v: number) => P + (H - 2 * P) - ((v - min) / range) * (H - 2 * P)
  const path = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')
  const area = `${path} L ${xAt(vals.length - 1).toFixed(1)} ${H - P} L ${xAt(0).toFixed(1)} ${H - P} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Confianza histórica">
      <defs>
        <linearGradient id="conf-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#conf-grad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* dot final */}
      <circle cx={xAt(vals.length - 1)} cy={yAt(vals[vals.length - 1])} r="3.5" fill={color} />
      {/* labels min/max */}
      <text x={P + 2} y={P + 8} fontSize="9" fontWeight="700" fill="#4f4f4f" style={{ fontFamily:'"JetBrains Mono"' }}>{max.toFixed(0)}%</text>
      <text x={P + 2} y={H - P - 1} fontSize="9" fontWeight="700" fill="#4f4f4f" style={{ fontFamily:'"JetBrains Mono"' }}>{min.toFixed(0)}%</text>
    </svg>
  )
}

// ════════════════════════════════════════════════════════════
// Mini sparkline de valor predicho (cuando hay predicted_value)
// ════════════════════════════════════════════════════════════
function ValueSparkline({ rows, color }: { rows: MlPrediction[]; color: string }) {
  const filtered = rows.filter(r => r.predicted_value != null)
  if (filtered.length < 2) return null
  const W = 520, H = 90, P = 6
  const vals = filtered.map(r => r.predicted_value!)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const xAt = (i: number) => P + (i / (vals.length - 1)) * (W - 2 * P)
  const yAt = (v: number) => P + (H - 2 * P) - ((v - min) / range) * (H - 2 * P)
  const path = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Valor predicho histórico">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xAt(vals.length - 1)} cy={yAt(vals[vals.length - 1])} r="3.5" fill={color} />
      <text x={P + 2} y={P + 8} fontSize="9" fontWeight="700" fill="#4f4f4f" style={{ fontFamily:'"JetBrains Mono"' }}>{fmtUSD(max)}</text>
      <text x={P + 2} y={H - P - 1} fontSize="9" fontWeight="700" fill="#4f4f4f" style={{ fontFamily:'"JetBrains Mono"' }}>{fmtUSD(min)}</text>
    </svg>
  )
}

// ════════════════════════════════════════════════════════════
// Distribución de señales emitidas por el modelo para el symbol
// ════════════════════════════════════════════════════════════
function SignalDistribution({ rows }: { rows: MlPrediction[] }) {
  const counts = rows.reduce((acc, r) => {
    if (r.signal) acc[r.signal] = (acc[r.signal] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([sig, n]) => (
        <div key={sig} className="flex items-center gap-2.5">
          <Badge label={sig} />
          <div className="flex-1 h-1.5 rounded-full" style={{ background:'rgba(0,154,147,0.08)' }}>
            <div className="h-full rounded-full" style={{ width:`${(n/total)*100}%`, background:'#009A93' }} />
          </div>
          <span className="font-mono text-[11px] font-bold tabular-nums w-9 text-right" style={{ color:'#4f4f4f' }}>{n}</span>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// Detail panel principal — expandido al click
// ════════════════════════════════════════════════════════════
export default function PredictionDetail({ prediction }: { prediction: MlPrediction }) {
  const meta = MODEL_META[prediction.model] ?? { label: prediction.model, color: '#009A93', modelKey: '' }

  // Modelo en src/data/models.ts (descripción técnica reutilizada del marco teórico)
  const modelInfo = useMemo(
    () => ML_MODELS.find(m => m.num === meta.modelKey),
    [meta.modelKey],
  )

  // Queries
  const history     = useSupabaseQuery(() => getPredictionHistory(prediction.symbol, prediction.model, 30), [prediction.symbol, prediction.model])
  const bySymbol    = useSupabaseQuery(() => getPredictionsBySymbol(prediction.symbol, 50), [prediction.symbol])
  const decisions   = useSupabaseQuery(() => getDecisionsBySymbol(prediction.symbol, 5), [prediction.symbol])

  const historyRows  = history.data ?? []
  const decisionRows = decisions.data ?? []

  // Consenso multi-modelo sobre este símbolo: cuántos modelos predicen qué
  const consensus = useMemo(() => {
    const symbolRows = bySymbol.data ?? []
    const byModel: Record<string, MlPrediction | undefined> = {}
    for (const r of symbolRows) {
      if (!byModel[r.model]) byModel[r.model] = r  // más reciente primero por orden
    }
    return Object.values(byModel).filter(Boolean) as MlPrediction[]
  }, [bySymbol.data])

  return (
    <div className="px-5 sm:px-6 pb-6 pt-4 space-y-6"
      style={{ borderTop: `1px dashed ${meta.color}40`, animation: 'detail-expand 320ms var(--ease-out)' }}>

      {/* ── Bloque 1: Definición técnica del modelo ── */}
      {modelInfo && (
        <section>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: meta.color }}>
            01 — Modelo
          </div>
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <h3 className="font-black text-[19px]" style={{ color: meta.color }}>{modelInfo.name}</h3>
            <span className="font-mono text-[11px] font-bold" style={{ color:'#4f4f4f' }}>{modelInfo.role}</span>
            <span className="font-mono text-[12px] font-bold tabular-nums px-2.5 py-1 rounded-lg ml-auto"
              style={{ background:`${meta.color}15`, border:`1px solid ${meta.color}35`, color: meta.color }}>
              {modelInfo.formula}
            </span>
          </div>
          <p className="leading-[1.65] text-[14px]" style={{ color:'#4f4f4f' }}>{modelInfo.shortDesc}</p>
        </section>
      )}

      {/* ── Bloque 2: Aplicación al símbolo ── */}
      <section>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: meta.color }}>
          02 — Aplicación a {prediction.symbol}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg px-3 py-2.5" style={{ background: '#f5fffe', border:'1px solid rgba(0,154,147,0.12)' }}>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color:'#4f4f4f' }}>Última predicción</div>
            <div className="font-mono text-[12px] tabular-nums mt-1" style={{ color:'#333333' }}>{fmtDateTime(prediction.predicted_at)}</div>
          </div>
          {prediction.predicted_value != null && (
            <div className="rounded-lg px-3 py-2.5" style={{ background: '#f5fffe', border:'1px solid rgba(0,154,147,0.12)' }}>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color:'#4f4f4f' }}>Valor predicho</div>
              <div className="font-sans font-black text-[16px] tabular-nums mt-1" style={{ color:'#333333' }}>{fmtUSD(prediction.predicted_value)}</div>
            </div>
          )}
          {prediction.signal && (
            <div className="rounded-lg px-3 py-2.5" style={{ background: '#f5fffe', border:'1px solid rgba(0,154,147,0.12)' }}>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color:'#4f4f4f' }}>Señal</div>
              <Badge label={prediction.signal} />
            </div>
          )}
          {prediction.confidence != null && (
            <div className="rounded-lg px-3 py-2.5" style={{ background: '#f5fffe', border:'1px solid rgba(0,154,147,0.12)' }}>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color:'#4f4f4f' }}>Confianza</div>
              <div className="font-sans font-black text-[16px] tabular-nums mt-1" style={{ color: meta.color }}>{fmtPct(prediction.confidence)}</div>
            </div>
          )}
        </div>
      </section>

      {/* ── Bloque 3: Evolución de confianza (sparkline) ── */}
      <section>
        <div className="flex justify-between items-baseline mb-2">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: meta.color }}>
            03 — Evolución de confianza ({historyRows.length} preds)
          </div>
          <span className="font-mono text-[10px] font-bold" style={{ color:'#4f4f4f' }}>
            últimas {historyRows.length} predicciones
          </span>
        </div>
        <div className="rounded-lg p-3" style={{ background:'#ffffff', border:'1px solid rgba(0,154,147,0.12)' }}>
          <ConfidenceSparkline rows={historyRows} color={meta.color} />
        </div>
      </section>

      {/* ── Bloque 4: Evolución del valor predicho (solo si aplica) ── */}
      {historyRows.some(r => r.predicted_value != null) && (
        <section>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: meta.color }}>
            04 — Evolución del valor predicho
          </div>
          <div className="rounded-lg p-3" style={{ background:'#ffffff', border:'1px solid rgba(0,154,147,0.12)' }}>
            <ValueSparkline rows={historyRows} color={meta.color} />
          </div>
        </section>
      )}

      {/* ── Bloque 5: Distribución de señales (categóricas) ── */}
      {historyRows.some(r => r.signal) && (
        <section>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: meta.color }}>
            05 — Señales emitidas históricamente
          </div>
          <SignalDistribution rows={historyRows} />
        </section>
      )}

      {/* ── Bloque 6: Consenso multi-modelo sobre este símbolo ── */}
      <section>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: meta.color }}>
          06 — Consenso del ensemble para {prediction.symbol}
        </div>
        <p className="text-[13px] leading-[1.55] mb-3" style={{ color:'#4f4f4f' }}>
          Predicción más reciente de cada modelo. FastAPI consolida estas señales antes de entregarlas al agente OpenClaw.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {consensus.map(c => {
            const cMeta = MODEL_META[c.model] ?? { label: c.model, color: '#009A93' }
            return (
              <div key={c.model} className="rounded-lg px-3 py-2.5 flex items-center gap-3"
                style={{ background:'#ffffff', border:`1px solid ${cMeta.color}30`, borderLeft:`3px solid ${cMeta.color}` }}>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[13px]" style={{ color: cMeta.color }}>{cMeta.label}</div>
                  <div className="text-[12px] mt-0.5" style={{ color:'#4f4f4f' }}>
                    {c.signal ? <span className="font-semibold capitalize">{c.signal}</span> : c.predicted_value != null ? fmtUSD(c.predicted_value) : '—'}
                  </div>
                </div>
                {c.confidence != null && (
                  <span className="font-mono text-[11px] tabular-nums font-bold" style={{ color: cMeta.color }}>{fmtPct(c.confidence)}</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Bloque 7: Decisiones IA relacionadas ── */}
      {decisionRows.length > 0 && (
        <section>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: meta.color }}>
            07 — Decisiones del agente sobre {prediction.symbol}
          </div>
          <div className="space-y-2">
            {decisionRows.map(d => (
              <div key={d.id} className="rounded-lg p-3" style={{ background:'#fafcfc', border:'1px solid rgba(107,33,168,0.18)', borderLeft:'3px solid #6b21a8' }}>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Badge label={d.action} />
                  {d.confidence != null && <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color:'#6b21a8' }}>{fmtPct(d.confidence)}</span>}
                  <span className="ml-auto font-mono text-[11px]" style={{ color:'#4f4f4f' }}>{fmtDateTime(d.created_at)}</span>
                </div>
                {d.rationale && <p className="text-[13px] leading-[1.55]" style={{ color:'#333333' }}>{d.rationale}</p>}
                {d.engine && <div className="mt-1.5 font-mono text-[10px]" style={{ color:'#4f4f4f' }}>motor: {d.engine}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @keyframes detail-expand {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="detail-expand"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
