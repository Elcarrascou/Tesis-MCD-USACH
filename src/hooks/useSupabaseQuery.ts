import { useState, useEffect } from 'react'

// ════════════════════════════════════════════════════════════
// Hook genérico de fetching con estados loading / error / data.
// Patrón stale-while-revalidate: no llama setState de forma
// síncrona dentro del effect (regla react-hooks/set-state-in-effect).
//   const { data, loading, error } = useSupabaseQuery(getPortfolio, [])
// ════════════════════════════════════════════════════════════

interface QueryState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    let active = true

    queryFn()
      .then(data => { if (active) setState({ data, loading: false, error: null }) })
      .catch(err => { if (active) setState({ data: null, loading: false, error: err as Error }) })

    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
