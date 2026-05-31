import { STACK_ROWS, DB_TABLES, COST_COLORS } from '../../data/stack'

export default function TechStack() {
  return (
    <section id="stack" className="py-20 sm:py-24" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <div className="section-tag">05 — Stack tecnológico</div>
        <h2 className="font-sans font-black mb-8 sm:mb-10" style={{ fontSize: 'clamp(26px,4vw,44px)', color: '#333333' }}>
          Tecnologías del proyecto
        </h2>

        {/* Table — scroll on mobile, 3 cols on desktop */}
        <div className="rounded-[16px] overflow-hidden card-shadow" style={{ border: '1px solid rgba(0,154,147,0.18)' }}>
          {/* Desktop header */}
          <div className="hidden md:grid px-7 py-4 gap-4"
            style={{ gridTemplateColumns: '180px 1fr 110px', background: 'rgba(0,154,147,0.08)', borderBottom: '2px solid rgba(0,154,147,0.2)' }}>
            {['Componente', 'Tecnología', 'Costo'].map(h => (
              <span key={h} className="font-mono text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: '#009A93' }}>{h}</span>
            ))}
          </div>
          {/* Mobile header */}
          <div className="md:hidden grid px-5 py-3.5 gap-4"
            style={{ gridTemplateColumns: '1fr 90px', background: 'rgba(0,154,147,0.08)', borderBottom: '2px solid rgba(0,154,147,0.2)' }}>
            {['Tecnología', 'Costo'].map(h => (
              <span key={h} className="font-mono text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: '#009A93' }}>{h}</span>
            ))}
          </div>

          {STACK_ROWS.map((r, i) => (
            <div key={r.comp} style={{ borderBottom: i < STACK_ROWS.length - 1 ? '1px solid rgba(0,154,147,0.08)' : 'none', background: '#ffffff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5fffe')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
              {/* Desktop row */}
              <div className="hidden md:grid px-7 py-4 items-center gap-4 text-[15px]"
                style={{ gridTemplateColumns: '180px 1fr 110px' }}>
                <span className="font-semibold" style={{ color: '#4f4f4f' }}>{r.comp}</span>
                <span className="font-bold" style={{ color: r.techColor }}>{r.tech}</span>
                <span className="font-mono text-[14px] font-bold" style={{ color: COST_COLORS[r.costType] }}>{r.cost}</span>
              </div>
              {/* Mobile row */}
              <div className="md:hidden grid px-5 py-3.5 items-center gap-4 text-[15px]"
                style={{ gridTemplateColumns: '1fr 90px' }}>
                <div>
                  <div className="font-bold" style={{ color: r.techColor }}>{r.tech}</div>
                  <div className="text-[12px] font-medium mt-0.5" style={{ color: '#4f4f4f' }}>{r.comp}</div>
                </div>
                <span className="font-mono text-[13px] font-bold" style={{ color: COST_COLORS[r.costType] }}>{r.cost}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-9">
          <h3 className="font-bold mb-5" style={{ fontSize: '20px', color: '#333333' }}>Tablas principales — Supabase</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {DB_TABLES.map(t => (
              <div key={t.name} className="rounded-[14px] p-4 sm:p-5 card-shadow transition-all hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', borderTop: `3px solid ${t.color}` }}>
                <div className="font-mono text-[13px] font-bold mb-2" style={{ color: t.color }}>{t.name}</div>
                <div className="font-medium" style={{ fontSize: '13px', color: '#4f4f4f' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

