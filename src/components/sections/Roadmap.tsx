import { ROADMAP_PHASES } from '../../data/roadmap'
import Reveal from '../ui/Reveal'

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 sm:py-24" style={{ background: '#ffffff' }}>
      <div className="wrap">
        <Reveal><div className="section-tag">07 — Roadmap</div></Reveal>
        <Reveal delay={50}>
          <h2 className="font-sans font-black mb-10 sm:mb-12" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
            Fases de desarrollo
          </h2>
        </Reveal>

        <div className="relative pl-6 sm:pl-8">
          <div className="absolute left-[6px] top-2 bottom-2 w-0.5" style={{ background: 'rgba(0,154,147,0.25)' }} />
          {ROADMAP_PHASES.map((p, i) => (
            <Reveal key={p.phase} delay={i * 80}>
              <div className="relative pl-6 sm:pl-8 pb-10 last:pb-0">
                <div className="absolute left-[-18px] top-1.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{ borderColor: p.color, background: '#ffffff' }} />
                <div className="font-mono text-[11px] sm:text-[12px] mb-1.5 tracking-[0.12em] uppercase font-bold" style={{ color: '#4f4f4f' }}>{p.phase}</div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="font-bold" style={{ fontSize: 'clamp(17px,2.5vw,20px)', color: '#333333' }}>{p.title}</h3>
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full font-bold flex-shrink-0"
                    style={{ background: `${p.color}12`, border: `1.5px solid ${p.color}40`, color: p.color }}>
                    {p.status}
                  </span>
                </div>
                <p className="leading-[1.75]" style={{ fontSize: 'clamp(14px,2vw,16px)', color: '#4f4f4f' }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

