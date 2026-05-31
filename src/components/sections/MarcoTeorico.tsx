import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import Lightbox   from '../ui/Lightbox'
import { ML_MODELS } from '../../data/models'

export default function MarcoTeorico() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  return (
    <section id="marco-teorico" className="py-20 sm:py-24" style={{ background: '#f5fffe', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <div className="section-tag">04 — Marco Teórico</div>
        <h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
          Fundamentos de los modelos ML
        </h2>
        <p className="leading-[1.8] max-w-[720px] mb-12 sm:mb-16" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
          Cada modelo aporta una perspectiva única para el análisis del portafolio. A continuación se presenta
          la arquitectura teórica de cada uno, con énfasis en cómo procesan los datos financieros del mercado chileno (IPSA)
          y su influencia con el índice Dow Jones.
        </p>

        <div className="space-y-10 sm:space-y-14">
          {ML_MODELS.map((m, idx) => (
            <div key={m.num} className="rounded-[20px] overflow-hidden card-shadow"
              style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', borderTop: `4px solid ${m.color}` }}>

              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 px-6 sm:px-9 pt-7 pb-5"
                style={{ borderBottom: '1px solid rgba(0,154,147,0.1)' }}>
                <div className="flex items-center gap-4">
                  <div className="font-sans font-black text-[52px] leading-none" style={{ color: `${m.color}15` }}>{m.num}</div>
                  <div>
                    <div className="font-black leading-none mb-1" style={{ fontSize: 'clamp(20px,3vw,26px)', color: m.color }}>{m.name}</div>
                    <div className="font-mono text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: '#4f4f4f' }}>{m.fullName}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-mono text-[13px] sm:text-[14px] font-bold px-4 py-2 rounded-xl"
                    style={{ background: `${m.color}10`, border: `1px solid ${m.color}30`, color: m.color }}>
                    {m.formula}
                  </div>
                  <div className="font-semibold text-[13px]" style={{ color: '#4f4f4f' }}>
                    → <span style={{ color: m.color }}>{m.output}</span>
                  </div>
                </div>
              </div>

              {/* Content: texto + diagrama alternado */}
              <div className={`grid grid-cols-1 ${idx % 2 === 0 ? 'lg:grid-cols-[1fr_1.6fr]' : 'lg:grid-cols-[1.6fr_1fr]'} gap-0`}>

                {/* Texto */}
                <div className={`px-6 sm:px-9 py-7 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <p className="leading-[1.8] mb-6" style={{ fontSize: '17px', color: '#555555' }}>
                    {m.description}
                  </p>
                  <div className="space-y-2.5">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: m.color }}>
                      Componentes clave
                    </div>
                    {m.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-[10px] flex-shrink-0" style={{ background: m.color }} />
                        <span className="leading-[1.6]" style={{ fontSize: '17px', color: '#555555' }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagrama — clicleable */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ampliar diagrama: ${m.imgAlt}`}
                  className={`${idx % 2 !== 0 ? 'lg:order-1' : ''} relative group cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009A93]`}
                  style={{
                    borderTop: '1px solid rgba(0,154,147,0.1)',
                    borderLeft: idx % 2 === 0 ? '1px solid rgba(0,154,147,0.1)' : 'none',
                    borderRight: idx % 2 !== 0 ? '1px solid rgba(0,154,147,0.1)' : 'none',
                  }}
                  onClick={() => setLightbox({ src: m.image, alt: m.imgAlt })}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox({ src: m.image, alt: m.imgAlt }) } }}
                >
                  <div className="overflow-x-auto" style={{ background: '#fafafa' }}>
                    <img
                      src={m.image}
                      alt={m.imgAlt}
                      loading="lazy"
                      className="w-full h-auto object-contain block transition-opacity duration-150 group-hover:opacity-90"
                      style={{ minWidth: '320px', maxHeight: '420px', objectFit: 'contain', padding: '16px' }}
                    />
                  </div>
                  {/* Hint zoom */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[14px]"
                      style={{ background: 'rgba(0,0,0,0.52)', color: '#ffffff', backdropFilter: 'blur(4px)' }}>
                      <ZoomIn size={16} aria-hidden="true" /> Ver en grande
                    </div>
                  </div>
                  {/* Caption */}
                  <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(0,154,147,0.08)', background: '#f5fffe' }}>
                    <span className="font-mono text-[11px] font-bold" style={{ color: '#4f4f4f' }}>{m.imgAlt}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </section>
  )
}
