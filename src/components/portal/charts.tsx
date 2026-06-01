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
