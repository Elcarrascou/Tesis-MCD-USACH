import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getModelMetrics } from '../../lib/queries'
import { fmtNum } from '../../lib/format'
import { PageHeader, Card, QueryState } from '../../components/portal/ui'
import { GroupedBarChart } from '../../components/portal/charts'

// ── Metadatos de modelos (mismo color que la página Modelos ML) ──
const MODEL_META: Record<string, { label: string; color: string; order: number }> = {
  lstm:          { label: 'LSTM',          color: '#009A93', order: 0 },
  xgboost:       { label: 'XGBoost',       color: '#E37200', order: 1 },
  prophet:       { label: 'Prophet',       color: '#1a7a3c', order: 2 },
  random_forest: { label: 'Random Forest', color: '#6b21a8', order: 3 },
}

// ── Metadatos de métricas: etiqueta, formato y dirección "mejor" ──
type Fmt = 'num' | 'pct' | 'pctSigned'
const METRIC_META: Record<string, { label: string; fmt: Fmt; better: 'high' | 'low' }> = {
  rmse:         { label: 'RMSE',          fmt: 'num',       better: 'low' },
  mae:          { label: 'MAE',           fmt: 'num',       better: 'low' },
  mape:         { label: 'MAPE',          fmt: 'pct',       better: 'low' },
  dir_acc:      { label: 'Prec. direcc.', fmt: 'pct',       better: 'high' },
  accuracy:     { label: 'Accuracy',      fmt: 'pct',       better: 'high' },
  f1_macro:     { label: 'F1 macro',      fmt: 'pct',       better: 'high' },
  auc:          { label: 'AUC ROC',       fmt: 'pct',       better: 'high' },
  cum_return:   { label: 'Retorno acum.', fmt: 'pctSigned', better: 'high' },
  sharpe:       { label: 'Sharpe',        fmt: 'num',       better: 'high' },
  max_drawdown: { label: 'Max drawdown',  fmt: 'pctSigned', better: 'high' },
}

// Métricas a mostrar por tipo de tarea, en orden
const REGRESSION_METRICS = ['rmse', 'mae', 'mape', 'dir_acc'] // LSTM, Prophet
const CLASSIF_METRICS    = ['accuracy', 'f1_macro', 'auc']    // XGBoost, Random Forest

function fmtMetric(metric: string, v: number): string {
  const fmt = METRIC_META[metric]?.fmt ?? 'num'
  if (fmt === 'pct') return `${fmtNum(v)}%`
  if (fmt === 'pctSigned') return `${v >= 0 ? '+' : ''}${fmtNum(v)}%`
  return fmtNum(v)
}

interface ModelGroup {
  model: string
  metrics: string[]            // métricas relevantes según tarea
  horizon: number | null
  nFolds: number | null
  global: Map<string, number>  // métrica → valor agregado (symbol NULL)
  symbols: { symbol: string; values: Map<string, number> }[]
}

// ── Estrategia vs benchmarks ──
const STRATEGY_ROWS: { model: string; label: string; sub?: string; highlight?: boolean }[] = [
  { model: 'strategy',          label: 'Estrategia IA',     sub: 'XGBoost long-only', highlight: true },
  { model: 'buy_hold_universe', label: 'Buy & Hold',        sub: 'universo completo' },
  { model: 'benchmark_ech',     label: 'IPSA (proxy ECH)',  sub: 'iShares MSCI Chile' },
  { model: 'benchmark_dji',     label: 'Dow Jones',         sub: '^DJI' },
]
const STRATEGY_METRICS = ['cum_return', 'sharpe', 'max_drawdown']

export default function PortalEvaluacion() {
  const { data, loading, error } = useSupabaseQuery(() => getModelMetrics(), [])
  const [expanded, setExpanded] = useState<string | null>(null)

  // Agrupar métricas por modelo (predictivos) + matriz estrategia/benchmark
  const { models, strategy } = useMemo(() => {
    const rows = data ?? []

    // ── Modelos predictivos ──
    const acc = new Map<string, {
      global: Map<string, number>
      bySymbol: Map<string, Map<string, number>>
      horizon: number | null
      nFolds: number | null
    }>()
    for (const r of rows) {
      if (!(r.model in MODEL_META)) continue
      let g = acc.get(r.model)
      if (!g) { g = { global: new Map(), bySymbol: new Map(), horizon: r.horizon_days, nFolds: null }; acc.set(r.model, g) }
      if (r.horizon_days != null) g.horizon = r.horizon_days
      if (r.symbol == null) {
        g.global.set(r.metric, r.value)
        if (r.n_folds != null) g.nFolds = r.n_folds
      } else {
        let m = g.bySymbol.get(r.symbol)
        if (!m) { m = new Map(); g.bySymbol.set(r.symbol, m) }
        m.set(r.metric, r.value)
      }
    }
    const models: ModelGroup[] = [...acc.entries()]
      .map(([model, g]) => {
        const isClassif = model === 'xgboost' || model === 'random_forest'
        const metrics = isClassif ? CLASSIF_METRICS : REGRESSION_METRICS
        const symbols = [...g.bySymbol.entries()]
          .map(([symbol, values]) => ({ symbol, values }))
          .sort((a, b) => a.symbol.localeCompare(b.symbol))
        return { model, metrics, horizon: g.horizon, nFolds: g.nFolds, global: g.global, symbols }
      })
      .sort((a, b) => (MODEL_META[a.model]?.order ?? 9) - (MODEL_META[b.model]?.order ?? 9))

    // ── Estrategia vs benchmarks ──
    const stratMap = new Map<string, Map<string, number>>()
    for (const r of rows) {
      if (r.task !== 'strategy' && r.task !== 'benchmark') continue
      let m = stratMap.get(r.model)
      if (!m) { m = new Map(); stratMap.set(r.model, m) }
      m.set(r.metric, r.value)
    }
    const strategy = STRATEGY_ROWS
      .filter(row => stratMap.has(row.model))
      .map(row => ({ ...row, values: stratMap.get(row.model)! }))

    return { models, strategy }
  }, [data])

  // Datos para los bar charts de clasificadores (XGBoost vs Random Forest)
  const { classifGroups, aucBySymbolGroups, rfAuc, xgbAuc } = useMemo(() => {
    const xgb = models.find(m => m.model === 'xgboost')
    const rf  = models.find(m => m.model === 'random_forest')
    if (!xgb && !rf) return { classifGroups: [], aucBySymbolGroups: [], rfAuc: null, xgbAuc: null }
    const pair = [xgb, rf].filter(Boolean) as ModelGroup[]

    const classifGroups = CLASSIF_METRICS.map(m => ({
      label: METRIC_META[m].label,
      bars: pair.map(g => ({
        label: MODEL_META[g.model].label,
        color: MODEL_META[g.model].color,
        value: g.global.get(m) ?? null,
      })),
    }))

    const symbols = [...new Set(pair.flatMap(g => g.symbols.map(s => s.symbol)))].sort()
    const aucBySymbolGroups = symbols
      .map(symbol => ({
        label: symbol,
        bars: pair.map(g => ({
          label: MODEL_META[g.model].label,
          color: MODEL_META[g.model].color,
          value: g.symbols.find(s => s.symbol === symbol)?.values.get('auc') ?? null,
        })),
      }))
      .filter(g => g.bars.some(b => b.value != null))

    return {
      classifGroups,
      aucBySymbolGroups,
      rfAuc: rf?.global.get('auc') ?? null,
      xgbAuc: xgb?.global.get('auc') ?? null,
    }
  }, [models])

  const isEmpty = models.length === 0 && strategy.length === 0

  return (
    <>
      <PageHeader tag="Portal · Evaluación" title="Evaluación de modelos"
        subtitle="Backtesting walk-forward sin look-ahead (Fase C): cada predicción usa solo el pasado, igual que en producción. Métricas por modelo y desempeño de la estrategia frente a benchmarks." />

      <QueryState loading={loading} error={error} empty={isEmpty} emptyLabel="Aún no hay métricas de evaluación.">
        {/* ════════ Estrategia vs benchmarks ════════ */}
        {strategy.length > 0 && (
          <Card className="mb-7 overflow-hidden" style={{ borderTop: '3px solid #E37200' }}>
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-black text-[17px]" style={{ color: '#333333' }}>Estrategia vs. benchmarks</h2>
              <p className="text-[13px] mt-1 leading-[1.5]" style={{ color: '#4f4f4f' }}>
                Retorno acumulado de la estrategia long-only (señal XGBoost) comparado con Buy&amp;Hold del universo y los índices de referencia.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,154,147,0.18)' }}>
                    <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#4f4f4f' }}>Estrategia</th>
                    {STRATEGY_METRICS.map(m => (
                      <th key={m} className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-right whitespace-nowrap" style={{ color: '#4f4f4f' }}>
                        {METRIC_META[m].label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {strategy.map(row => (
                    <tr key={row.model}
                      style={{
                        borderBottom: '1px solid rgba(0,154,147,0.08)',
                        background: row.highlight ? 'rgba(227,114,0,0.06)' : undefined,
                      }}>
                      <td className="px-5 py-3">
                        <div className="font-bold text-[14px]" style={{ color: row.highlight ? '#E37200' : '#333333' }}>{row.label}</div>
                        {row.sub && <div className="font-mono text-[11px]" style={{ color: '#4f4f4f' }}>{row.sub}</div>}
                      </td>
                      {STRATEGY_METRICS.map(m => {
                        const v = row.values.get(m)
                        return (
                          <td key={m} className="px-4 py-3 text-right font-mono text-[13px] font-bold tabular-nums" style={{ color: '#333333' }}>
                            {v == null ? '—' : fmtMetric(m, v)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ════════ Clasificadores: XGBoost vs Random Forest ════════ */}
        {classifGroups.length > 0 && (
          <Card className="p-6 mb-7" style={{ borderTop: '3px solid #6b21a8' }}>
            <h2 className="font-black text-[17px]" style={{ color: '#333333' }}>Clasificadores frente al nivel de azar</h2>
            <p className="text-[13px] mt-1 mb-4 leading-[1.5]" style={{ color: '#4f4f4f' }}>
              Métricas globales del walk-forward para los dos clasificadores. La línea punteada marca el nivel de azar (50%):
              una métrica cercana a esa línea indica que el modelo no supera a una moneda al aire.
            </p>
            <div className="overflow-x-auto">
              <GroupedBarChart
                groups={classifGroups}
                yMax={100}
                refLine={{ value: 50, label: 'azar 50%' }}
                valueFormatter={(v) => `${fmtNum(v)}%`}
                height={270}
                title="Comparación de accuracy, F1 macro y AUC ROC entre XGBoost y Random Forest, con línea de referencia en el nivel de azar del 50 por ciento"
              />
            </div>
            {rfAuc != null && xgbAuc != null && (
              <p className="mt-4 rounded-xl px-4 py-3 text-[13px] leading-[1.6]"
                style={{ background: 'rgba(107,33,168,0.06)', border: '1px solid rgba(107,33,168,0.2)', color: '#333333' }}>
                <strong style={{ color: '#6b21a8' }}>Lectura clave:</strong>{' '}
                el clasificador de riesgo Random Forest alcanza un AUC ROC global de{' '}
                <strong className="tabular-nums" style={{ color: '#6b21a8' }}>{fmtNum(rfAuc)}%</strong> — el riesgo de un activo
                sí es predecible desde sus features técnicos. La señal de compra/venta de XGBoost queda en{' '}
                <strong className="tabular-nums" style={{ color: '#E37200' }}>{fmtNum(xgbAuc)}%</strong>, en torno al azar:
                resultado consistente con la hipótesis de eficiencia débil del mercado.
              </p>
            )}
            {aucBySymbolGroups.length > 0 && (
              <>
                <h3 className="font-bold text-[15px] mt-6 mb-1" style={{ color: '#333333' }}>AUC ROC por símbolo</h3>
                <p className="text-[13px] mb-3 leading-[1.5]" style={{ color: '#4f4f4f' }}>
                  La ventaja del Random Forest se sostiene en todos los símbolos evaluados, no solo en el agregado.
                </p>
                <div className="overflow-x-auto">
                  <GroupedBarChart
                    groups={aucBySymbolGroups}
                    yMax={100}
                    refLine={{ value: 50, label: 'azar 50%' }}
                    valueFormatter={(v) => `${fmtNum(v)}%`}
                    height={240}
                    title="AUC ROC por símbolo para XGBoost y Random Forest"
                  />
                </div>
              </>
            )}
          </Card>
        )}

        {/* ════════ Métricas por modelo ════════ */}
        <div className="flex flex-col gap-4">
          {models.map(g => {
            const meta = MODEL_META[g.model]
            const isOpen = g.model === expanded
            const groupId = `model-${g.model}`
            const horizonLabel = g.horizon != null ? `${g.horizon}d` : null
            return (
              <Card key={g.model} style={{ borderTop: `3px solid ${meta.color}` }}>
                {/* Header: modelo + métricas agregadas (global, walk-forward) */}
                <button type="button"
                  onClick={() => setExpanded(prev => prev === g.model ? null : g.model)}
                  aria-expanded={isOpen}
                  aria-controls={groupId}
                  className="w-full text-left p-5 press"
                  style={{ borderRadius: '16px' }}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-black text-[18px]" style={{ color: meta.color }}>{meta.label}</span>
                    {horizonLabel && (
                      <span className="font-mono text-[11px]" style={{ color: '#4f4f4f' }}>horizonte {horizonLabel}</span>
                    )}
                    {g.nFolds != null && (
                      <span className="font-mono text-[11px]" style={{ color: '#4f4f4f' }}>{g.nFolds} folds</span>
                    )}
                    {g.symbols.length > 0 && (
                      <span className="font-mono text-[11px]" style={{ color: '#4f4f4f' }}>{g.symbols.length} símbolos</span>
                    )}
                    <ChevronDown size={18} aria-hidden="true"
                      className="ml-auto flex-shrink-0"
                      style={{
                        color: meta.color,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 280ms var(--ease-out)',
                      }} />
                  </div>
                  {/* Métricas agregadas (promedio de folds, symbol NULL) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
                    {g.metrics.map(m => {
                      const v = g.global.get(m)
                      return (
                        <div key={m} className="rounded-lg px-3 py-2"
                          style={{ background: `${meta.color}0c`, border: `1px solid ${meta.color}25` }}>
                          <div className="text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: '#4f4f4f' }}>
                            {METRIC_META[m].label}
                          </div>
                          <div className="font-mono text-[15px] font-black tabular-nums mt-0.5" style={{ color: meta.color }}>
                            {v == null ? '—' : fmtMetric(m, v)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </button>

                {/* Desglose por símbolo */}
                {isOpen && g.symbols.length > 0 && (
                  <div id={groupId} className="px-2 sm:px-3 pb-4"
                    style={{ borderTop: `1px dashed ${meta.color}30`, paddingTop: '4px', animation: 'group-expand 320ms var(--ease-out)' }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#4f4f4f' }}>Símbolo</th>
                            {g.metrics.map(m => (
                              <th key={m} className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-right whitespace-nowrap" style={{ color: '#4f4f4f' }}>
                                {METRIC_META[m].label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {g.symbols.map(s => (
                            <tr key={s.symbol} style={{ borderTop: '1px solid rgba(0,154,147,0.08)' }}>
                              <td className="px-3 py-2.5 font-bold text-[13px]" style={{ color: '#333333' }}>{s.symbol}</td>
                              {g.metrics.map(m => {
                                const v = s.values.get(m)
                                return (
                                  <td key={m} className="px-3 py-2.5 text-right font-mono text-[12px] tabular-nums" style={{ color: '#333333' }}>
                                    {v == null ? '—' : fmtMetric(m, v)}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <p className="mt-6 text-[12px] leading-[1.6]" style={{ color: '#4f4f4f' }}>
          Las métricas agregadas son el promedio de los folds del walk-forward (sin look-ahead).
          LSTM y Prophet reportan error de predicción de precio (RMSE/MAE en USD, MAPE en %) y precisión direccional;
          XGBoost y Random Forest reportan accuracy, F1 macro y AUC ROC (One-vs-Rest macro) sobre la clasificación de señal/riesgo.
        </p>
      </QueryState>

      <style>{`
        @keyframes group-expand {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="group-expand"] { animation: none !important; }
        }
      `}</style>
    </>
  )
}
