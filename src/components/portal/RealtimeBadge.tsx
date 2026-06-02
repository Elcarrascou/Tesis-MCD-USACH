import type { RealtimeStatus } from '../../hooks/useRealtimeInserts'

const META: Record<RealtimeStatus, { label: string; color: string; pulse: boolean }> = {
  connecting:   { label: 'Conectando…', color: '#E37200', pulse: false },
  live:         { label: 'En vivo',      color: '#1a7a3c', pulse: true  },
  disconnected: { label: 'Sin conexión', color: '#4f4f4f', pulse: false },
  error:        { label: 'Error',        color: '#c0392b', pulse: false },
}

export default function RealtimeBadge({ status }: { status: RealtimeStatus }) {
  const m = META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.06em]"
      style={{ background: `${m.color}1f`, color: m.color, border: `1px solid ${m.color}40` }}
      role="status" aria-live="polite">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color, animation: m.pulse ? 'rt-pulse 1800ms var(--ease-in-out) infinite' : undefined }} />
      {m.label}
      <style>{`
        @keyframes rt-pulse {
          0%, 100% { opacity: 1;    transform: scale(1);   }
          50%      { opacity: 0.55; transform: scale(1.35); }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; }
        }
      `}</style>
    </span>
  )
}
