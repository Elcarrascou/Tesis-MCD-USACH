const stackRows = [
  { comp: 'Broker + datos en tiempo real', tech: 'Alpaca API',                      techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Datos históricos ML',           tech: 'Yahoo Finance (yfinance)',         techColor: '#E37200', cost: '$0',          costType: 'free' },
  { comp: 'Agente IA',                     tech: 'OpenClaw',                         techColor: '#6b21a8', cost: '$6.29/mes',   costType: 'paid' },
  { comp: 'Hosting agente',                tech: 'Hostinger (plan administrado)',    techColor: '#333333', cost: 'incluido',    costType: 'paid' },
  { comp: 'Motores IA',                    tech: 'Claude · OpenAI · Ollama · Qwen', techColor: '#333333', cost: '$0 / mínimo', costType: 'free' },
  { comp: 'Frontend',                      tech: 'React + Tailwind CSS',             techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Deploy frontend',               tech: 'Vercel + GitHub',                 techColor: '#E37200', cost: '$0',          costType: 'free' },
  { comp: 'Backend API',                   tech: 'FastAPI (Python)',                 techColor: '#009A93', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Hosting backend',               tech: 'Railway',                          techColor: '#555555', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Base de datos',                 tech: 'Supabase (PostgreSQL)',            techColor: '#333333', cost: '~$25/mes',    costType: 'paid' },
  { comp: 'IDE principal',                 tech: 'Claude Code',                      techColor: '#009A93', cost: '~$100/mes',   costType: 'paid' },
  { comp: 'IDE monitoreo',                 tech: 'Antigravity · Google Gemini',     techColor: '#333333', cost: 'ya pagado',   costType: 'owned' },
]

const costColors: Record<string, string> = { free: '#1a7a3c', paid: '#E37200', owned: '#009A93' }

const dbTables = [
  { name: 'portfolio',      desc: 'Posiciones actuales',        color: '#009A93' },
  { name: 'movements',      desc: 'Historial de transacciones',  color: '#E37200' },
  { name: 'ai_decisions',   desc: 'Decisiones del agente IA',   color: '#6b21a8' },
  { name: 'ml_predictions', desc: 'Resultados periódicos ML',   color: '#1a7a3c' },
  { name: 'performance',    desc: 'Ganancias y métricas',       color: '#009A93' },
]

export default function TechStack() {
  return (
    <section id="stack" className="py-24" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">04 — Stack tecnológico</div>
        <h2 className="font-sans font-black mb-10" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#333333' }}>
          Tecnologías del proyecto
        </h2>

        <div className="rounded-[16px] overflow-hidden card-shadow" style={{ border: '1px solid rgba(0,154,147,0.18)' }}>
          <div className="grid gap-4 px-7 py-4" style={{ gridTemplateColumns: '200px 1fr 110px', background: 'rgba(0,154,147,0.08)', borderBottom: '2px solid rgba(0,154,147,0.2)' }}>
            {['Componente', 'Tecnología', 'Costo'].map(h => (
              <span key={h} className="font-mono text-[11px] tracking-[0.12em] uppercase font-bold" style={{ color: '#009A93' }}>{h}</span>
            ))}
          </div>
          {stackRows.map((r, i) => (
            <div key={r.comp}
              className="grid gap-4 px-7 py-4 items-center text-[15px] transition-colors duration-150 cursor-default"
              style={{ gridTemplateColumns: '200px 1fr 110px', borderBottom: i < stackRows.length - 1 ? '1px solid rgba(0,154,147,0.08)' : 'none', background: '#ffffff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5fffe')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
              <span className="text-[13px] font-semibold" style={{ color: '#777777' }}>{r.comp}</span>
              <span className="font-bold" style={{ color: r.techColor }}>{r.tech}</span>
              <span className="font-mono text-[13px] font-bold" style={{ color: costColors[r.costType] }}>{r.cost}</span>
            </div>
          ))}
        </div>

        <div className="mt-9">
          <h3 className="text-[20px] font-bold mb-5" style={{ color: '#333333' }}>Tablas principales — Supabase</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {dbTables.map(t => (
              <div key={t.name} className="rounded-[14px] p-5 card-shadow transition-all hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', borderTop: `3px solid ${t.color}` }}>
                <div className="font-mono text-[13px] font-bold mb-2" style={{ color: t.color }}>{t.name}</div>
                <div className="text-[13px] font-medium" style={{ color: '#777777' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
