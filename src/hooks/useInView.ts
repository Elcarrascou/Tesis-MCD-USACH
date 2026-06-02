import { useEffect, useRef, useState } from 'react'

// ════════════════════════════════════════════════════════════
// IntersectionObserver hook — dispara reveal una sola vez.
// Para animaciones de entrada al hacer scroll (Emil: rare = OK animar).
// ════════════════════════════════════════════════════════════
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useInView<T extends HTMLElement = HTMLDivElement>(margin = '-80px') {
  const ref = useRef<T>(null)
  // Init lazy: si reduced-motion, parte revelado (sin setState en effect)
  const [inView, setInView] = useState<boolean>(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: `0px 0px ${margin} 0px`, threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margin])

  return { ref, inView }
}
