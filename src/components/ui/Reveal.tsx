import type { ReactNode, ElementType } from 'react'
import { useInView } from '../../hooks/useInView'

// ════════════════════════════════════════════════════════════
// Envuelve contenido para revelarlo al entrar al viewport.
// Wrapper genérico — usa .reveal de index.css + IntersectionObserver.
// ════════════════════════════════════════════════════════════
interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  id?: string
  style?: React.CSSProperties
}

export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0, id, style }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref}
      id={id}
      data-in={inView}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  )
}
