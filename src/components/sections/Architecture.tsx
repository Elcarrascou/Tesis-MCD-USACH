import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import diagramaArquitectura from '../../assets/diagrama-arquitectura.png'
import Lightbox from '../ui/Lightbox'

const flowSteps = [
  { icon: '✏️', label: 'Claude Code',      bg: 'rgba(0,154,147,0.1)',  border: 'rgba(0,154,147,0.35)' },
  { icon: '🐙', label: 'GitHub',            bg: '#f5fffe',              border: 'rgba(0,154,147,0.2)'  },
  { icon: '▲',  label: 'Vercel Frontend',  bg: 'rgba(227,114,0,0.08)', border: 'rgba(227,114,0,0.35)' },
  { icon: '🚄', label: 'Railway Backend',  bg: 'rgba(51,51,51,0.06)',  border: 'rgba(51,51,51,0.2)'   },
  { icon: '🌐', label: 'App producción',   bg: 'rgba(0,154,147,0.12)', border: 'rgba(0,154,147,0.4)'  },
]

const layers = [
  { color: '#009A93', label: 'Datos de mercado',         items: ['Alpaca API (tiempo real)', 'Yahoo Finance (históricos)'] },
  { color: '#E37200', label: 'Modelos ML predictivos',   items: ['LSTM — Precio futuro', 'XGBoost — Señal compra/venta', 'Prophet — Tendencia IPSA', 'Random Forest — Riesgo'] },
  { color: '#6b21a8', label: 'Agente IA (OpenClaw)',     items: ['Orquestación autónoma', 'Claude · GPT · Ollama'] },
  { color: '#009A93', label: 'Backend y persistencia',   items: ['FastAPI RESTful', 'Supabase (PostgreSQL)'] },
  { color: '#E37200', label: 'Frontend e interacción',   items: ['React — Visualización', 'Telegram Bot — Chatbot'] },
]

export default function Architecture() {
  const [lightbox, setLightbox] = useState(false)

  return (
    <section id="architecture" className="py-20 sm:py-24" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <div className="section-tag">02 — Arquitectura</div>
        <h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
          Cómo fluye el sistema
        </h2>
        <p className="leading-[1.8] max-w-[700px] mb-10" style={{ fontSize: 'clamp(16px,2vw,18px)', color: '#4f4f4f' }}>
          El sistema integra datos de mercado, modelos predictivos y un agente de IA autónomo que
          toma decisiones de rebalanceo y las comunica al usuario vía chatbot y aplicación web.
        </p>

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
            className="overflow-x-auto bg-white relative group cursor-zoom-in"
            onClick={() => setLightbox(true)}
          >
            <img
              src={diagramaArquitectura}
              alt="Sistema de Gestión de Portafolio de Inversión Administrado por IA — Diagrama de arquitectura"
              className="w-full h-auto object-contain block transition-opacity duration-150 group-hover:opacity-90"
              style={{ minWidth: '600px' }}
            />
            {/* Hint zoom */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[14px]"
                style={{ background: 'rgba(0,0,0,0.55)', color: '#ffffff', backdropFilter: 'blur(4px)' }}>
                <ZoomIn size={16} /> Ver en grande
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de capas */}
        <h3 className="font-bold mb-5" style={{ fontSize: '20px', color: '#333333' }}>Capas del sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-12">
          {layers.map((l, i) => (
            <div key={i} className="rounded-[14px] p-4 sm:p-5 card-shadow"
              style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.12)', borderTop: `3px solid ${l.color}` }}>
              <div className="font-bold mb-2.5" style={{ fontSize: '13px', color: l.color }}>{l.label}</div>
              <ul className="space-y-1">
                {l.items.map(item => (
                  <li key={item} className="font-medium leading-[1.4]" style={{ fontSize: '12px', color: '#4f4f4f' }}>· {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Flujo de deploy */}
        <div style={{ borderTop: '1px solid rgba(0,154,147,0.15)', paddingTop: '32px' }}>
          <h3 className="font-bold mb-5" style={{ fontSize: '20px', color: '#333333' }}>Flujo de desarrollo y deploy</h3>
          <div className="overflow-x-auto py-4">
            <div className="flex items-center gap-1 min-w-max px-1">
              {flowSteps.map((s, i) => (
                <div key={s.label} className="flex items-center gap-1">
                  <div className="flex flex-col items-center gap-2.5 w-[100px] sm:w-[110px]">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-[20px] card-shadow"
                      style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
                      {s.icon}
                    </div>
                    <span className="text-[12px] text-center leading-[1.3] font-semibold" style={{ color: '#4f4f4f' }}>{s.label}</span>
                  </div>
                  {i < flowSteps.length - 1 && (
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
