import { useEffect } from 'react'
import { X } from 'lucide-react'

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  // Cerrar con ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)', animation: 'lb-fade 200ms var(--ease-out)' }}
      onClick={onClose}
    >
      {/* Botón X */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar imagen"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full press z-10"
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
      >
        <X size={20} aria-hidden="true" />
      </button>

      {/* Imagen */}
      <div
        className="relative max-w-[95vw] max-h-[90vh] rounded-[16px] overflow-hidden"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)', animation: 'lb-scale 280ms var(--ease-out)' }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="block max-w-[95vw] max-h-[88vh] w-auto h-auto object-contain"
          style={{ background: '#ffffff' }}
        />
      </div>

      <style>{`
        /* Backdrop fade + content scale-in con ease-out custom (Emil) */
        @keyframes lb-fade  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lb-scale {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="dialog"], [role="dialog"] > div { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
