const stackRows = [
  { comp: 'Broker + datos en tiempo real', tech: 'Alpaca API',                      techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Datos históricos ML',           tech: 'Yahoo Finance (yfinance)',         techColor: '#E37200', cost: '$0',          costType: 'free' },
  { comp: 'Agente IA',                     tech: 'OpenClaw',                         techColor: '#7c3aed', cost: '$6.29/mes',   costType: 'paid' },
  { comp: 'Hosting agente',                tech: 'Hostinger (plan administrado)',    techColor: undefined, cost: 'incluido',    costType: 'paid' },
  { comp: 'Motores IA',                    tech: 'Claude · OpenAI · Ollama · Qwen', techColor: undefined, cost: '$0 / mínimo', costType: 'free' },
  { comp: 'Frontend',                      tech: 'React + Tailwind CSS',             techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Deploy frontend',               tech: 'Vercel + GitHub',                 techColor: '#E37200', cost: '$0',          costType: 'free' },
  { comp: 'Backend API',                   tech: 'FastAPI (Python)',                 techColor: '#009A93', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Hosting backend',               tech: 'Railway',                          techColor: '#b53e30', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Base de datos',                 tech: 'Supabase (PostgreSQL)',            techColor: undefined, cost: '~$25/mes',    costType: 'paid' },
  { comp: 'IDE principal',                 tech: 'Claude Code',                      techColor: '#009A93', cost: '~$100/mes',   costType: 'paid' },
  { comp: 'IDE monitoreo',                 tech: 'Antigravity · Google Gemini',     techColor: undefined, cost: 'ya pagado',   costType: 'owned' },
]

const costColors: Record<string, string> = {
  free:  '#16a34a',
  paid:  '#E37200',
  owned: '#009A93',
}

const dbTables = [
  { name: 'portfolio',      desc: 'Posiciones actuales',        color: '#009A93' },
  { name: 'movements',      desc: 'Historial de transacciones',  color: '#E37200' },
  { name: 'ai_decisions',   desc: 'Decisiones del agente IA',   color: '#7c3aed' },
  { name: 'ml_predictions', desc: 'Resultados periódicos ML',   color: '#16a34a' },
  { name: 'performance',    desc: 'Ganancias y métricas',       color: '#00b5ad' },
]

export default function TechStack() {
  return (
    <section id="stack" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)', background: '#f4fefd' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">04 — Stack tecnológico</div>
        <h2 className="font-sans font-black mb-9 text-u-white" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Tecnologías del proyecto
        </h2>

        <div className="rounded-[14px] overflow-hidden card-shadow" style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)' }}>
          <div className="grid gap-4 px-6 py-3.5" style={{ gridTemplateColumns: '200px 1fr 100px', background: '#e8faf8', borderBottom: '1px solid rgba(0,154,147,0.15)' }}>
            {['Componente', 'Tecnología', 'Costo'].map(h => (
              <span key={h} className="font-mono text-[10px] tracking-[0.1em] uppercase font-bold" style={{ color: '#009A93' }}>{h}</span>
            ))}
          </div>
          {stackRows.map((r, i) => (
            <div key={r.comp}
              className="grid gap-4 px-6 py-3.5 items-center text-[14px] transition-colors duration-150 cursor-default"
              style={{ gridTemplateColumns: '200px 1fr 100px', borderBottom: i < stackRows.length - 1 ? '1px solid rgba(0,154,147,0.08)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f4fefd')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span className="text-[12px] font-medium" style={{ color: '#4a8a86' }}>{r.comp}</span>
              <span className="font-bold" style={{ color: r.techColor || '#1a3533' }}>{r.tech}</span>
              <span className="font-mono text-[12px] font-bold" style={{ color: costColors[r.costType] }}>{r.cost}</span>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <h3 className="text-[17px] font-bold mb-3.5 text-u-white">Tablas principales — Supabase</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {dbTables.map(t => (
              <div key={t.name} className="rounded-[14px] p-5 card-shadow transition-all hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.15)', borderTop: `3px solid ${t.color}` }}>
                <div className="font-mono text-[12px] font-bold mb-1.5" style={{ color: t.color }}>{t.name}</div>
                <div className="text-[12px]" style={{ color: '#4a8a86' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
