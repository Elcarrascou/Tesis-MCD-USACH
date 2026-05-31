import type { ReactNode } from 'react'

export function PageHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <header className="mb-7">
      <div className="section-tag">{tag}</div>
      <h1 className="font-sans font-black" style={{ fontSize: 'clamp(24px,3.5vw,34px)', color: '#333333' }}>{title}</h1>
      {subtitle && <p className="mt-1.5 leading-[1.6]" style={{ fontSize: '15px', color: '#4f4f4f' }}>{subtitle}</p>}
    </header>
  )
}

export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-[16px] card-shadow ${className}`}
      style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', ...style }}>
      {children}
    </div>
  )
}

/** Maneja loading / error / empty de forma consistente. */
export function QueryState({ loading, error, empty, emptyLabel = 'Sin datos disponibles.', children }:
  { loading: boolean; error: Error | null; empty: boolean; emptyLabel?: string; children: ReactNode }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3" aria-live="polite">
        <div className="w-2.5 h-2.5 rounded-full animate-blink" style={{ background: '#009A93' }} />
        <span className="font-mono text-[14px] font-bold" style={{ color: '#4f4f4f' }}>Cargando…</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="py-12 text-center" aria-live="polite">
        <p className="font-bold text-[15px]" style={{ color: '#c0392b' }}>Error al cargar los datos</p>
        <p className="font-mono text-[13px] mt-1" style={{ color: '#4f4f4f' }}>{error.message}</p>
      </div>
    )
  }
  if (empty) {
    return (
      <div className="py-12 text-center">
        <p className="text-[15px] font-medium" style={{ color: '#4f4f4f' }}>{emptyLabel}</p>
      </div>
    )
  }
  return <>{children}</>
}

const SIGNAL_COLORS: Record<string, string> = {
  buy: '#1a7a3c', sell: '#c0392b', hold: '#E37200', rebalance: '#6b21a8',
  alcista: '#1a7a3c', bajista: '#c0392b',
  bajo: '#1a7a3c', medio: '#E37200', alto: '#c0392b',
}

export function Badge({ label }: { label: string }) {
  const color = SIGNAL_COLORS[label.toLowerCase()] ?? '#009A93'
  return (
    <span className="inline-block font-mono text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.04em]"
      style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>
      {label}
    </span>
  )
}
