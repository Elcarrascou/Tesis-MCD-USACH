import { useEffect, useMemo, useState } from 'react'
import { getQuotes } from '../lib/market'
import type { Quote } from '../lib/market'

// ════════════════════════════════════════════════════════════
// Polling de cotizaciones Yahoo Finance cada 60s.
// - Pausa cuando la pestaña está oculta (Sonner: edge cases
//   invisibles — no quemar requests que nadie ve).
// - Refresca al volver a la pestaña.
// - Si Yahoo falla, conserva las últimas cotizaciones buenas.
// ════════════════════════════════════════════════════════════

const POLL_MS = 60_000

export interface LiveQuotes {
  /** Mapa symbol → Quote. Vacío hasta la primera respuesta. */
  quotes: Record<string, Quote>
  /** Timestamp de la última actualización exitosa. */
  updatedAt: Date | null
  /** true si ya hay al menos una respuesta de Yahoo. */
  live: boolean
}

export function useLiveQuotes(symbols: string[]): LiveQuotes {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({})
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  // Clave estable: evita re-suscribir cuando cambia la identidad del array pero no su contenido
  const key = useMemo(() => [...symbols].sort().join(','), [symbols])

  useEffect(() => {
    if (!key) return
    let cancelled = false
    let inFlight = false

    async function load() {
      if (inFlight || document.visibilityState === 'hidden') return
      inFlight = true
      try {
        const res = await getQuotes(key.split(','))
        if (cancelled) return
        setQuotes(prev => {
          const next = { ...prev }
          for (const q of res.quotes) next[q.symbol] = q
          return next
        })
        setUpdatedAt(new Date())
      } catch {
        // Yahoo caído o sin red: mantener últimos datos buenos
      } finally {
        inFlight = false
      }
    }

    load()
    const id = setInterval(load, POLL_MS)
    const onVisible = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [key])

  return { quotes, updatedAt, live: updatedAt !== null }
}
