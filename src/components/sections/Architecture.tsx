import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import diagramaArquitectura from '../../assets/diagrama-arquitectura.png'
import Lightbox from '../ui/Lightbox'
import Reveal from '../ui/Reveal'
import { ARCH_LAYERS, FLOW_STEPS } from '../../data/architecture'

export default function Architecture() {
  const [lightbox, setLightbox] = useState(false)

  return (
    <section id="architecture" className="py-20 sm:py-24" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <Reveal><div className="section-tag">02 — Arquitectura</div></Reveal>
        <Reveal delay={50}>
          <h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
            Cómo fluye el sistema
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="leading-[1.8] max-w-[700px] mb-10" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
            El sistema integra datos de mercado, modelos predictivos y un agente de IA autónomo que
            toma decisiones de rebalanceo y las comunica al usuario vía chatbot y aplicación web.
          </p>
        </Reveal>

        {/* Diagrama principal — clicleable */}
        <div className="rounded-[18px] overflow-hidden card-shadow mb-10"
          style={{ border: '2px solid rgba(0,154,147,0.2)', background: '#ffffff' }}>
          <div className="px-6 py-3 flex items-center justify-between"
            style={{ background: 'rgba(0,154,147,0.07)', borderBottom: '1px solid rgba(0,154,147,0.15)' }}>
            <span className="font-mono text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: '#009A93' }}>
              Diagrama de arquitectura del sistema
            </span>
            <span className="font-mono text-[11px] font-bold" style={{ color: '#4f4f4f' }}>
              MCD USACH · D. Carrasco U.
            </span>
          </div>
          <div
            role="button"
            tabIndex={0}
            aria-label="Ampliar diagrama de arquitectura del sistema"
            className="overflow-x-auto bg-white relative group cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009A93]"
            onClick={() => setLightbox(true)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(true) } }}
          >
            <img
              src={diagramaArquitectura}
              alt="Sistema de Gestión de Portafolio de Inversión Administrado por IA — Diagrama de arquitectura"
              loading="lazy"
              className="w-full h-auto object-contain block transition-opacity duration-150 group-hover:opacity-90"
              style={{ minWidth: '600px' }}
            />
            {/* Hint zoom */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[14px]"
                style={{ background: 'rgba(0,0,0,0.55)', color: '#ffffff', backdropFilter: 'blur(4px)' }}>
                <ZoomIn size={16} aria-hidden="true" /> Ver en grande
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de capas */}
        <Reveal><h3 className="font-bold mb-5" style={{ fontSize: '20px', color: '#333333' }}>Capas del sistema</h3></Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-12">
          {ARCH_LAYERS.map((l, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="h-full rounded-[14px] p-4 sm:p-5 card-shadow"
                style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.12)', borderTop: `3px solid ${l.color}` }}>
                <div className="font-bold mb-2.5" style={{ fontSize: '16px', color: l.color }}>{l.label}</div>
                <ul className="space-y-1.5">
                  {l.items.map(item => (
                    <li key={item} className="font-medium leading-[1.5]" style={{ fontSize: '15px', color: '#4f4f4f' }}>· {item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Flujo de deploy */}
        <div style={{ borderTop: '1px solid rgba(0,154,147,0.15)', paddingTop: '32px' }}>
          <h3 className="font-bold mb-5" style={{ fontSize: '20px', color: '#333333' }}>Flujo de desarrollo y deploy</h3>
          <div className="overflow-x-auto py-4">
            <div className="flex items-center gap-1 min-w-max px-1">
              {FLOW_STEPS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-1">
                  <div className="flex flex-col items-center gap-2.5 w-[100px] sm:w-[110px]">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-[20px] card-shadow"
                      style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
                      {s.icon}
                    </div>
                    <span className="text-[12px] text-center leading-[1.3] font-semibold" style={{ color: '#4f4f4f' }}>{s.label}</span>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="text-lg font-bold mb-6 flex-shrink-0" style={{ color: '#009A93' }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          src={diagramaArquitectura}
          alt="Diagrama de arquitectura del sistema"
          onClose={() => setLightbox(false)}
        />
      )}
    </section>
  )
}
