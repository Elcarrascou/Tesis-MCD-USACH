import { useMemo } from 'react'
import { CHART_PALETTE } from './chartConfig'

// ════════════════════════════════════════════════════════════
// Componentes de visualización SVG puros (sin dependencias).
// Optimizados según vercel-react-best-practices:
//  • Componentes hoisteados (no inline)
//  • useMemo para cómputos derivados
//  • SVG con precisión reducida (rendering-svg-precision)
//  • aria-label en cada gráfico (web-design-guidelines)
// ════════════════════════════════════════════════════════════

// ─────────────────────────  DONUT  ──────────────────────────

interface DonutSlice { label: string; value: number; color?: string }
interface DonutChartProps { data: DonutSlice[]; size?: number; thickness?: number; title?: string; centerLabel?: string; centerValue?: string }

export function DonutChart({ data, size = 220, thickness = 36, centerLabel, centerValue, title = 'Distribución' }: DonutChartProps) {
  const safe = data.filter(d => d.value > 0)
  const total = safe.reduce((s, d) => s + d.value, 0)
  const c = size / 2
  const r = c - thickness / 2 - 4

  const slices = useMemo(() => {
    if (total <= 0) return [] as Array<DonutSlice & { d: string; pct: number; color: string }>
    let acc = -Math.PI / 2 // comienza en las 12:00
    return safe.map((s, i) => {
      const angle = (s.value / total) * Math.PI * 2
      const a0 = acc
      const a1 = acc + angle
      acc = a1
      const x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0)
      const x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1)
      const large = angle > Math.PI ? 1 : 0
      const d = `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
      return { ...s, d, pct: (s.value / total) * 100, color: s.color ?? CHART_PALETTE[i % CHART_PALETTE.length] }
    })
  }, [safe, total, r, c])

  if (total === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
        {/* Fondo circular sutil */}
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(0,154,147,0.08)" strokeWidth={thickness} />
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="butt">
            <title>{`${s.label}: ${s.pct.toFixed(1)}%`}</title>
          </path>
        ))}
        {/* Centro */}
        {centerValue && (
          <text x={c} y={c - 4} textAnchor="middle" fontSize="22" fontWeight="900" fill="#333333" style={{ fontFamily:'"Nunito Sans"' }}>
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x={c} y={c + 16} textAnchor="middle" fontSize="10" fontWeight="700" fill="#4f4f4f" letterSpacing="1.2" style={{ fontFamily:'"JetBrains Mono"' }}>
            {centerLabel.toUpperCase()}
          </text>
        )}
      </svg>

      {/* Leyenda */}
      <ul className="flex-1 space-y-2 min-w-0">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="font-semibold text-[14px] flex-1 truncate" style={{ color:'#333333' }}>{s.label}</span>
            <span className="font-mono text-[13px] tabular-nums font-bold" style={{ color: s.color }}>{s.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─────────────────────────  LINE CHART COMPARE  ─────────────────────────

interface LineSeries { label: string; color: string; values: number[] }
interface LineChartCompareProps {
  series: LineSeries[]   // todas las series con la misma longitud
  labels: string[]       // eje x (etiquetas o fechas legibles)
  height?: number
  yFormatter?: (v: number) => string
  title?: string
}

export function LineChartCompare({ series, labels, height = 240, yFormatter = (v) => v.toFixed(1), title = 'Comparación de series' }: LineChartCompareProps) {
  const W = 760
  const PADL = 56, PADR = 12, PADT = 16, PADB = 28
  const H = height
  const innerW = W - PADL - PADR
  const innerH = H - PADT - PADB

  const allVals = series.flatMap(s => s.values)
  const min = Math.min(...allVals)
  const max = Math.max(...allVals)
  const range = max - min || 1
  const n = labels.length || series[0]?.values.length || 0

  const xAt = (i: number) => PADL + (i / Math.max(1, n - 1)) * innerW
  const yAt = (v: number) => PADT + innerH - ((v - min) / range) * innerH

  // Y ticks (4 niveles)
  const ticks = [0, 0.33, 0.67, 1].map(t => min + t * range)

  // X ticks: muestreo cada N
  const tickStep = Math.max(1, Math.floor(n / 6))
  const xTickIdx: number[] = []
  for (let i = 0; i < n; i += tickStep) xTickIdx.push(i)
  if (xTickIdx[xTickIdx.length - 1] !== n - 1) xTickIdx.push(n - 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 540 }} role="img" aria-label={title}>
      {/* Grid horizontal */}
      {ticks.map((t, i) => {
        const y = yAt(t)
        return (
          <g key={i}>
            <line x1={PADL} x2={W - PADR} y1={y} y2={y} stroke="rgba(0,154,147,0.1)" strokeWidth={1} />
            <text x={PADL - 6} y={y + 3} fontSize="10" textAnchor="end" fill="#4f4f4f" style={{ fontFamily:'"JetBrains Mono"' }}>
              {yFormatter(t)}
            </text>
          </g>
        )
      })}

      {/* X ticks */}
      {xTickIdx.map((i) => (
        <text key={i} x={xAt(i)} y={H - PADB + 14} fontSize="10" textAnchor="middle" fill="#4f4f4f" style={{ fontFamily:'"JetBrains Mono"' }}>
          {labels[i]}
        </text>
      ))}

      {/* Líneas */}
      {series.map((s) => {
        const path = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')
        return (
          <g key={s.label}>
            <path d={path} fill="none" stroke={s.color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={xAt(s.values.length - 1)} cy={yAt(s.values[s.values.length - 1])} r={3.5} fill={s.color} />
          </g>
        )
      })}

      {/* Leyenda en top */}
      <g>
        {series.map((s, i) => (
          <g key={s.label} transform={`translate(${PADL + i * 160}, ${PADT - 4})`}>
            <line x1={0} x2={18} y1={0} y2={0} stroke={s.color} strokeWidth={2.5} />
            <text x={24} y={3} fontSize="11" fontWeight="700" fill="#333333" style={{ fontFamily:'"Nunito Sans"' }}>
              {s.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ─────────────────────────  AREA CHART (equity curve)  ─────────────────────────

interface AreaChartProps {
  labels: string[]
  values: number[]
  height?: number
  color?: string
  yFormatter?: (v: number) => string
  lastFormatter?: (v: number) => string
  title?: string
}

/** Curva de equity: línea + área con degradado suave, estilo distill.pub. */
export function AreaChart({ labels, values, height = 260, color = '#009A93', yFormatter = (v) => v.toFixed(0), lastFormatter, title = 'Evolución' }: AreaChartProps) {
  const W = 760
  const PADL = 64, PADR = 14, PADT = 18, PADB = 28
  const H = height
  const innerW = W - PADL - PADR
  const innerH = H - PADT - PADB
  const n = values.length

  const { linePath, areaPath, ticks, xTickIdx, xAt, yAt } = useMemo(() => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    // 6% de aire vertical para que la línea no toque los bordes
    const pad = (max - min || Math.abs(max) || 1) * 0.06
    const lo = min - pad, hi = max + pad
    const range = hi - lo || 1
    const xAt = (i: number) => PADL + (i / Math.max(1, n - 1)) * innerW
    const yAt = (v: number) => PADT + innerH - ((v - lo) / range) * innerH
    const linePath = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ')
    const areaPath = `${linePath} L ${xAt(n - 1).toFixed(1)} ${(PADT + innerH).toFixed(1)} L ${xAt(0).toFixed(1)} ${(PADT + innerH).toFixed(1)} Z`
    const ticks = [0, 0.33, 0.67, 1].map(t => lo + t * range)
    const tickStep = Math.max(1, Math.floor(n / 6))
    const xTickIdx: number[] = []
    for (let i = 0; i < n; i += tickStep) xTickIdx.push(i)
    if (xTickIdx[xTickIdx.length - 1] !== n - 1) xTickIdx.push(n - 1)
    return { linePath, areaPath, ticks, xTickIdx, xAt, yAt }
  }, [values, n, innerW, innerH])

  if (n === 0) return null
  const last = values[n - 1]
  const gradId = `area-grad-${color.replace('#', '')}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 540 }} role="img" aria-label={title}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid horizontal + eje Y */}
      {ticks.map((t, i) => {
        const y = yAt(t)
        return (
          <g key={i}>
            <line x1={PADL} x2={W - PADR} y1={y} y2={y} stroke="rgba(0,154,147,0.1)" strokeWidth={1} />
            <text x={PADL - 8} y={y + 3} fontSize="10" textAnchor="end" fill="#4f4f4f" style={{ fontFamily: '"JetBrains Mono"' }}>
              {yFormatter(t)}
            </text>
          </g>
        )
      })}

      {/* Eje X */}
      {xTickIdx.map((i) => (
        <text key={i} x={xAt(i)} y={H - PADB + 14} fontSize="10" textAnchor="middle" fill="#4f4f4f" style={{ fontFamily: '"JetBrains Mono"' }}>
          {labels[i]}
        </text>
      ))}

      {/* Área + línea */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />

      {/* Último punto + valor */}
      <circle cx={xAt(n - 1)} cy={yAt(last)} r={4} fill={color} stroke="#ffffff" strokeWidth={1.5} />
      {lastFormatter && (
        <text x={Math.min(xAt(n - 1) + 8, W - PADR)} y={yAt(last) - 10} fontSize="11" fontWeight="800"
          textAnchor="end" fill={color} style={{ fontFamily: '"JetBrains Mono"' }}>
          {lastFormatter(last)}
        </text>
      )}
    </svg>
  )
}

// ─────────────────────────  GROUPED BAR CHART (vertical)  ─────────────────────────

interface GroupedBar { label: string; value: number | null; color: string }
interface BarGroup { label: string; bars: GroupedBar[] }
interface GroupedBarChartProps {
  groups: BarGroup[]
  yMax?: number
  refLine?: { value: number; label: string }
  valueFormatter?: (v: number) => string
  height?: number
  title?: string
}

/** Barras verticales agrupadas (grupo = métrica, barra = modelo). Escala Y común. */
export function GroupedBarChart({ groups, yMax, refLine, valueFormatter = (v) => v.toFixed(1), height = 260, title = 'Comparación' }: GroupedBarChartProps) {
  const W = 760
  const PADL = 46, PADR = 14, PADT = 30, PADB = 30
  const H = height
  const innerW = W - PADL - PADR
  const innerH = H - PADT - PADB

  const max = yMax ?? Math.max(...groups.flatMap(g => g.bars.map(b => b.value ?? 0)), refLine?.value ?? 0) * 1.15
  const yAt = (v: number) => PADT + innerH - (v / (max || 1)) * innerH

  const nG = groups.length
  const groupW = innerW / Math.max(1, nG)
  const barGap = 6
  const groupPad = groupW * 0.22

  // Leyenda: modelos únicos en orden de aparición
  const legend = useMemo(() => {
    const seen = new Map<string, string>()
    for (const g of groups) for (const b of g.bars) if (!seen.has(b.label)) seen.set(b.label, b.color)
    return [...seen.entries()]
  }, [groups])

  if (nG === 0) return null
  const valueFont = nG > 5 ? 9 : 11 // con muchos grupos, etiquetas más compactas

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 540 }} role="img" aria-label={title}>
      {/* Grid Y (4 niveles) */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const v = t * max
        const y = yAt(v)
        return (
          <g key={t}>
            <line x1={PADL} x2={W - PADR} y1={y} y2={y} stroke="rgba(0,154,147,0.1)" strokeWidth={1} />
            <text x={PADL - 8} y={y + 3} fontSize="10" textAnchor="end" fill="#4f4f4f" style={{ fontFamily: '"JetBrains Mono"' }}>
              {valueFormatter(v)}
            </text>
          </g>
        )
      })}

      {/* Línea de referencia (p. ej. nivel de azar 50%) */}
      {refLine && (
        <g>
          <line x1={PADL} x2={W - PADR} y1={yAt(refLine.value)} y2={yAt(refLine.value)}
            stroke="#c0392b" strokeWidth={1.4} strokeDasharray="5 4" opacity={0.65} />
          <text x={W - PADR} y={yAt(refLine.value) - 5} fontSize="10" fontWeight="700" textAnchor="end"
            fill="#c0392b" style={{ fontFamily: '"JetBrains Mono"' }}>
            {refLine.label}
          </text>
        </g>
      )}

      {/* Grupos de barras */}
      {groups.map((g, gi) => {
        const bars = g.bars
        const bw = (groupW - groupPad * 2 - barGap * (bars.length - 1)) / bars.length
        const x0 = PADL + gi * groupW + groupPad
        return (
          <g key={g.label}>
            {bars.map((b, bi) => {
              if (b.value == null) return null
              const x = x0 + bi * (bw + barGap)
              const y = yAt(b.value)
              const h = PADT + innerH - y
              return (
                <g key={b.label}>
                  <rect x={x.toFixed(1)} y={y.toFixed(1)} width={bw.toFixed(1)} height={Math.max(0, h).toFixed(1)}
                    rx={3} fill={b.color}>
                    <title>{`${b.label} · ${g.label}: ${valueFormatter(b.value)}`}</title>
                  </rect>
                  <text x={(x + bw / 2).toFixed(1)} y={(y - 6).toFixed(1)} fontSize={valueFont} fontWeight="800"
                    textAnchor="middle" fill={b.color} style={{ fontFamily: '"JetBrains Mono"' }}>
                    {valueFormatter(b.value)}
                  </text>
                </g>
              )
            })}
            <text x={PADL + gi * groupW + groupW / 2} y={H - PADB + 16} fontSize="11" fontWeight="700"
              textAnchor="middle" fill="#333333" style={{ fontFamily: '"Nunito Sans"' }}>
              {g.label}
            </text>
          </g>
        )
      })}

      {/* Leyenda superior */}
      <g>
        {legend.map(([label, color], i) => (
          <g key={label} transform={`translate(${PADL + i * 170}, ${PADT - 16})`}>
            <rect x={0} y={-7} width={11} height={11} rx={2.5} fill={color} />
            <text x={17} y={2} fontSize="11" fontWeight="700" fill="#333333" style={{ fontFamily: '"Nunito Sans"' }}>
              {label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ─────────────────────────  BAR CHART HORIZONTAL  ─────────────────────────

interface BarItem { label: string; value: number; color?: string }
interface BarChartProps { items: BarItem[]; maxValue?: number; valueFormatter?: (v: number) => string; title?: string }

export function BarChartHorizontal({ items, maxValue, valueFormatter = (v) => v.toFixed(0), title = 'Distribución' }: BarChartProps) {
  if (items.length === 0) return null
  const max = maxValue ?? Math.max(...items.map(i => i.value))
  return (
    <div className="flex flex-col gap-3" role="img" aria-label={title}>
      {items.map((item, i) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0
        const color = item.color ?? CHART_PALETTE[i % CHART_PALETTE.length]
        return (
          <div key={item.label}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-semibold text-[13px]" style={{ color:'#333333' }}>{item.label}</span>
              <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color }}>{valueFormatter(item.value)}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(0,154,147,0.08)' }}>
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
