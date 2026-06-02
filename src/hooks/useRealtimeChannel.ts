import { useEffect } from 'react'
import { useRealtimeInserts } from './useRealtimeInserts'
import type { RealtimeStatus } from './useRealtimeInserts'
import { useRealtimeStatus } from '../context/RealtimeContext'
import type { Database } from '../lib/database.types'

type PublicTables = keyof Database['public']['Tables']
type RowOf<T extends PublicTables> = Database['public']['Tables'][T]['Row']

/**
 * Combina useRealtimeInserts con el RealtimeContext: reporta el status
 * al provider global para que el sidebar muestre el badge agregado.
 */
export function useRealtimeChannel<T extends PublicTables>(
  table: T,
  onInsert: (row: RowOf<T>) => void,
): RealtimeStatus {
  const { status, lastInsert } = useRealtimeInserts(table, onInsert)
  const { report } = useRealtimeStatus()

  useEffect(() => { report(table, status) }, [table, status, report])
  useEffect(() => () => { report(table, 'disconnected') }, [table, report])

  // lastInsert disponible si el consumidor lo necesita (no devuelto explícito aquí)
  void lastInsert
  return status
}
