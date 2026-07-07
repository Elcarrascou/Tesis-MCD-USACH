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

/** Placeholder shimmer: 'page' = KPIs + gráfico + tabla; 'block' = bloque único (para cards). */
function SkeletonLayout({ variant }: { variant: 'page' | 'block' }) {
  if (variant === 'block') return <div aria-hidden="true" className="skeleton h-[180px]" />
  return (
    <div aria-hidden="true">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map(i => <div key={i} className="skeleton h-[88px]" />)}
      </div>
      <div className="skeleton h-[260px] mb-6" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map(i => <div key={i} className="skeleton h-[40px]" />)}
      </div>
    </div>
  )
}

/** Maneja loading / error / empty de forma consistente. */
export function QueryState({ loading, error, empty, emptyLabel = 'Sin datos disponibles.', skeleton = 'page', children }:
  { loading: boolean; error: Error | null; empty: boolean; emptyLabel?: string; skeleton?: 'page' | 'block'; children: ReactNode }) {
  if (loading) {
    return (
      <div role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Cargando…</span>
        <SkeletonLayout variant={skeleton} />
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
      <div className="py-14 px-6 text-center rounded-[16px]"
        style={{ border: '1.5px dashed rgba(0,154,147,0.35)', background: 'rgba(0,154,147,0.03)' }}>
        <p className="text-[15px] font-medium" style={{ color: '#4f4f4f' }}>{emptyLabel}</p>
        <p className="font-mono text-[12px] mt-1.5" style={{ color: '#4f4f4f' }}>
          Los datos se generan con el pipeline diario automático.
        </p>
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
