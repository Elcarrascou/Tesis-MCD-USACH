import { useState, useEffect, useCallback } from 'react'

// ════════════════════════════════════════════════════════════
// Hook genérico de fetching con estados loading / error / data.
// Patrón stale-while-revalidate: no llama setState de forma
// síncrona dentro del effect (regla react-hooks/set-state-in-effect).
//   const { data, loading, error, setData } = useSupabaseQuery(getPortfolio, [])
// setData se exponen para mutaciones optimistas (ej. Realtime).
// ════════════════════════════════════════════════════════════

interface QueryState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseSupabaseQueryReturn<T> extends QueryState<T> {
  setData: (updater: T | ((prev: T | null) => T | null)) => void
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
): UseSupabaseQueryReturn<T> {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    let active = true

    queryFn()
      .then(data => { if (active) setState({ data, loading: false, error: null }) })
      .catch(err => { if (active) setState({ data: null, loading: false, error: err as Error }) })

    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const setData = useCallback((updater: T | ((prev: T | null) => T | null)) => {
    setState(prev => ({
      ...prev,
      data: typeof updater === 'function' ? (updater as (p: T | null) => T | null)(prev.data) : updater,
    }))
  }, [])

  return { ...state, setData }
}
