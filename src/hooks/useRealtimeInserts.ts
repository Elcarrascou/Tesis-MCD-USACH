import { useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

// ════════════════════════════════════════════════════════════
// Suscripción a INSERTs Realtime de Supabase sobre una tabla.
// Devuelve estado de conexión + último insert para que el
// consumidor mantenga su propio array.
//   const { status, lastInsert } = useRealtimeInserts('ai_decisions', (row) => {...})
// ════════════════════════════════════════════════════════════

export type RealtimeStatus = 'connecting' | 'live' | 'disconnected' | 'error'
type PublicTables = keyof Database['public']['Tables']
type RowOf<T extends PublicTables> = Database['public']['Tables'][T]['Row']

export function useRealtimeInserts<T extends PublicTables>(
  table: T,
  onInsert: (row: RowOf<T>) => void,
): { status: RealtimeStatus; lastInsert: RowOf<T> | null } {
  const [status, setStatus]     = useState<RealtimeStatus>('connecting')
  const [lastInsert, setLast]   = useState<RowOf<T> | null>(null)
  const handlerRef              = useRef(onInsert)

  // Mantener ref actualizado sin re-subscribir el canal
  useEffect(() => { handlerRef.current = onInsert }, [onInsert])

  useEffect(() => {
    let channel: RealtimeChannel | null = null
    let cancelled = false

    channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table },
        (payload: { new: RowOf<T> }) => {
          if (cancelled) return
          setLast(payload.new)
          handlerRef.current(payload.new)
        },
      )
      .subscribe((s) => {
        if (cancelled) return
        if (s === 'SUBSCRIBED')           setStatus('live')
        else if (s === 'CHANNEL_ERROR')   setStatus('error')
        else if (s === 'TIMED_OUT')       setStatus('disconnected')
        else if (s === 'CLOSED')          setStatus('disconnected')
      })

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [table])

  return { status, lastInsert }
}
