import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  SYSTEM_NODES, SYSTEM_EDGES, SYSTEM_LAYERS, SYSTEM_LEGEND,
  NODE_W as NW, NODE_H as NH, NODE_R as R,
  getSystemNode as getNode, systemEdgePath as edgePath, connectedToNode as connectedTo,
} from '../data/system'

const NODES  = SYSTEM_NODES
const EDGES  = SYSTEM_EDGES
const LAYERS = SYSTEM_LAYERS

// ──────────────── Subcomponentes del panel de detalle ────────────────

interface DetailSectionProps { label: string; color: string; children: ReactNode }

function DetailSection({ label, color, children }: DetailSectionProps) {
  return (
    <section>
      <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5 flex items-center gap-2">
        <span className="inline-block w-5 h-[2px] rounded-sm" style={{ background: color }} />
        <span style={{ color }}>{label}</span>
      </div>
      {children}
    </section>
  )
}

interface BulletListProps { items: string[]; color: string }

function BulletList({ items, color }: BulletListProps) {
  return (
    <ul className="space-y-1.5">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2.5 leading-[1.55]" style={{ fontSize:'14px', color:'#333333' }}>
          <span className="font-mono text-[11px] font-bold flex-shrink-0 mt-[3px]" style={{ color }}>▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function SolucionPage() {
  const [selected, setSelected] = useState<string|null>(null)
  const [animated, setAnimated] = useState(true)

  // rerender-memo: recalcular el Set de conexiones solo cuando cambia la selección
  const connected = useMemo(() => (selected ? connectedTo(selected) : null), [selected])
  const selNode   = selected ? getNode(selected) : null

  return (
    <section className="min-h-screen py-20 sm:py-24" style={{ background:'#ffffff' }}>
      <div className="wrap">

        {/* ── Header ── */}
        <div className="section-tag">Sistema completo</div>
        <h1 className="font-sans font-black mb-4" style={{ fontSize:'clamp(28px,4vw,48px)', color:'#333333' }}>
          Arquitectura interactiva
        </h1>
        <p className="leading-[1.8] max-w-[740px] mb-3" style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'#4f4f4f' }}>
          Diagrama completo del sistema. <strong style={{color:'#333'}}>Haz click en cualquier nodo</strong> para
          desplegar su definición técnica, aplicación en este proyecto de tesis, inputs/outputs financieros,
          métricas de decisión y rationale de elección.
        </p>

        {/* Toggle animación */}
        <div className="flex items-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setAnimated(a => !a)}
            aria-pressed={animated}
            aria-label={animated ? 'Pausar animación del flujo' : 'Animar el flujo'}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[13px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009A93]"
            style={{
              background: animated ? '#009A93' : 'rgba(0,154,147,0.1)',
              color: animated ? '#fff' : '#009A93',
              border: '1px solid rgba(0,154,147,0.4)',
            }}>
            {animated ? '⏸ Pausar flujo' : '▶ Animar flujo'}
          </button>
          {selected && (
            <button type="button" onClick={() => setSelected(null)}
              aria-label="Limpiar selección del diagrama"
              className="px-4 py-1.5 rounded-full font-mono text-[13px] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background:'rgba(51,51,51,0.06)', color:'#333', border:'1px solid rgba(51,51,51,0.15)' }}>
              ✕ Limpiar selección
            </button>
          )}
        </div>

        {/* ── SVG Diagram ── */}
        <div className="rounded-[20px] overflow-x-auto card-shadow mb-8"
          style={{ border:'1px solid rgba(0,154,147,0.18)', background:'#fafcfc' }}>
          <svg
            viewBox="0 0 1010 520"
            style={{ minWidth:680, width:'100%', display:'block', fontFamily:'"Nunito Sans", sans-serif' }}
            onClick={() => setSelected(null)}
          >
            {/* ── Defs: arrowhead ── */}
            <defs>
              {['#009A93','#E37200','#1a7a3c','#6b21a8','#555555'].map(c => (
                <marker key={c} id={`arr-${c.replace('#','')}`}
                  markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill={c} />
                </marker>
              ))}
            </defs>

            {/* ── Layer header bands ── */}
            {LAYERS.map(l => (
              <g key={l.label}>
                <rect x={l.x - NW/2} y={8} width={NW} height={22} rx={6}
                  fill="rgba(0,154,147,0.07)" stroke="rgba(0,154,147,0.2)" strokeWidth={1} />
                <text x={l.x} y={23} textAnchor="middle" fontSize={11}
                  fontWeight="700" fill="#009A93" fontFamily='"JetBrains Mono", monospace' letterSpacing="0.05em">
                  {l.label.toUpperCase()}
                </text>
              </g>
            ))}

            {/* ── Edges ── */}
            {EDGES.map((e, i) => {
              const d    = edgePath(e)
              const dim  = connected && !connected.has(e.from) && !connected.has(e.to)
              const hl   = connected && connected.has(e.from) && connected.has(e.to)
              const markerUrl = `url(#arr-${e.color.replace('#','')})`
              return (
                <g key={i}>
                  {/* Base path */}
                  <path d={d} fill="none"
                    stroke={e.color}
                    strokeWidth={hl ? 2.5 : 1.5}
                    strokeDasharray={e.dash ? '6,4' : undefined}
                    markerEnd={markerUrl}
                    opacity={dim ? 0.08 : hl ? 1 : 0.35}
                    style={{ transition:'opacity 0.25s, stroke-width 0.25s' }}
                  />
                  {/* Animated dot */}
                  {animated && !dim && (
                    <circle r={dim ? 0 : hl ? 5 : 3.5} fill={e.color} opacity={dim ? 0 : 0.9}>
                      <animateMotion dur={`${e.dur}s`} repeatCount="indefinite" begin={`${e.delay}s`}>
                        <mpath href={`#path-${i}`} />
                      </animateMotion>
                    </circle>
                  )}
                  {/* Named path for animateMotion */}
                  <path id={`path-${i}`} d={d} fill="none" stroke="none" />
                </g>
              )
            })}

            {/* ── Nodes ── */}
            {NODES.map(n => {
              const isSelected = selected === n.id
              const isDimmed   = connected && !connected.has(n.id)
              return (
                <g key={n.id} onClick={ev => { ev.stopPropagation(); setSelected(n.id === selected ? null : n.id) }}
                  style={{ cursor:'pointer' }}>
                  {/* Glow on selected */}
                  {isSelected && (
                    <rect x={n.x-NW/2-4} y={n.y-NH/2-4} width={NW+8} height={NH+8} rx={R+4}
                      fill={n.color} opacity={0.15} />
                  )}
                  {/* Card */}
                  <rect x={n.x-NW/2} y={n.y-NH/2} width={NW} height={NH} rx={R}
                    fill={isSelected ? n.color : '#ffffff'}
                    stroke={n.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={isDimmed ? 0.18 : 1}
                    style={{ filter: isDimmed ? 'none' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))', transition:'opacity 0.25s' }}
                  />
                  {/* Label — tamaño adaptado al largo del texto */}
                  <text x={n.x} y={n.y - 8} textAnchor="middle"
                    fontSize={n.label.length > 13 ? (isSelected ? 11 : 10) : (isSelected ? 13 : 12)}
                    fontWeight="800"
                    fill={isSelected ? '#ffffff' : '#222222'}
                    opacity={isDimmed ? 0.2 : 1}
                    style={{ transition:'opacity 0.25s' }}>
                    {n.label}
                  </text>
                  {/* Sublabel */}
                  <text x={n.x} y={n.y + 11} textAnchor="middle"
                    fontSize={10} fontWeight="600"
                    fill={isSelected ? 'rgba(255,255,255,0.85)' : '#4f4f4f'}
                    opacity={isDimmed ? 0.2 : 1}
                    style={{ transition:'opacity 0.25s' }}>
                    {n.sub}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── Info panel ── */}
        <div className="rounded-[18px] overflow-hidden transition-all duration-300 card-shadow"
          style={{
            border: selNode ? `2px solid ${selNode.color}` : '1px solid rgba(0,154,147,0.15)',
            background: '#ffffff',
            minHeight: 100,
          }}>
          {selNode ? (
            <article aria-live="polite">
              {/* Header */}
              <header className="px-7 py-5 flex flex-wrap items-center gap-4"
                style={{ background:`${selNode.color}0f`, borderBottom:`1px solid ${selNode.color}25` }}>
                <div>
                  <div className="font-black text-[22px]" style={{ color: selNode.color }}>{selNode.label}</div>
                  <div className="font-mono text-[12px] font-bold mt-0.5" style={{ color:'#4f4f4f' }}>{selNode.sub}</div>
                </div>
                <div className="ml-auto font-mono text-[13px] font-bold px-4 py-2 rounded-xl"
                  style={{ background:`${selNode.color}15`, border:`1px solid ${selNode.color}35`, color: selNode.color }}>
                  {selNode.tech}
                </div>
              </header>

              <div className="px-7 py-6 grid grid-cols-1 lg:grid-cols-2 gap-x-9 gap-y-7">

                {/* QUÉ ES — definición técnica */}
                <DetailSection label="01 — Definición técnica" color={selNode.color}>
                  <p className="leading-[1.75]" style={{ fontSize:'15px', color:'#333333' }}>
                    {selNode.detail.whatIs}
                  </p>
                </DetailSection>

                {/* APLICACIÓN EN ESTE PROYECTO */}
                <DetailSection label="02 — Aplicación en el proyecto" color={selNode.color}>
                  <p className="leading-[1.75]" style={{ fontSize:'15px', color:'#333333' }}>
                    {selNode.detail.usage}
                  </p>
                </DetailSection>

                {/* INPUTS */}
                {selNode.detail.inputs && (
                  <DetailSection label="03 — Entradas (inputs)" color={selNode.color}>
                    <BulletList items={selNode.detail.inputs} color={selNode.color} />
                  </DetailSection>
                )}

                {/* OUTPUTS */}
                {selNode.detail.outputs && (
                  <DetailSection label="04 — Salidas (outputs)" color={selNode.color}>
                    <BulletList items={selNode.detail.outputs} color={selNode.color} />
                  </DetailSection>
                )}

                {/* MÉTRICAS DE DECISIÓN */}
                {selNode.detail.decisionMetrics && (
                  <DetailSection label="05 — Métricas para la toma de decisiones" color={selNode.color}>
                    <BulletList items={selNode.detail.decisionMetrics} color={selNode.color} />
                  </DetailSection>
                )}

                {/* RATIONALE */}
                {selNode.detail.rationale && (
                  <DetailSection label="06 — Por qué se eligió" color={selNode.color}>
                    <p className="leading-[1.75] italic" style={{ fontSize:'15px', color:'#4f4f4f' }}>
                      {selNode.detail.rationale}
                    </p>
                  </DetailSection>
                )}
              </div>

              {/* Conexiones (footer) */}
              <footer className="px-7 pt-5 pb-6"
                style={{ borderTop:'1px solid rgba(0,154,147,0.12)', background:'#fafcfc' }}>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color:'#4f4f4f' }}>
                  Componentes conectados
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {EDGES.filter(e => e.from === selNode.id || e.to === selNode.id).map((e, i) => {
                    const other = e.from === selNode.id ? getNode(e.to) : getNode(e.from)
                    const dir   = e.from === selNode.id ? '→' : '←'
                    return (
                      <button key={i} type="button" onClick={() => setSelected(other.id)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-[13px] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ background:`${e.color}12`, border:`1px solid ${e.color}40`, color: e.color }}>
                        <span style={{ opacity:0.6 }}>{dir}</span> {other.label}
                      </button>
                    )
                  })}
                </div>
              </footer>
            </article>
          ) : (
            <div className="flex items-center justify-center h-24 gap-3">
              <div className="w-2 h-2 rounded-full animate-blink" style={{ background:'#009A93' }} />
              <span className="font-mono text-[14px] font-bold" style={{ color:'#4f4f4f' }}>
                Selecciona un nodo para explorar su rol en el sistema
              </span>
            </div>
          )}
        </div>

        {/* ── Leyenda ── */}
        <div className="mt-8 flex flex-wrap gap-5">
          {SYSTEM_LEGEND.map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <svg width="28" height="10">
                <line x1="0" y1="5" x2="22" y2="5" stroke={l.color} strokeWidth="2" />
                <polygon points="22,2 28,5 22,8" fill={l.color} />
              </svg>
              <span className="font-mono text-[12px] font-bold" style={{ color:'#4f4f4f' }}>{l.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
