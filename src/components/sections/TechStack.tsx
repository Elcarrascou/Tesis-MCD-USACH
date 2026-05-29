const stackRows = [
  { comp: 'Broker + datos en tiempo real', tech: 'Alpaca API',                       techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Datos históricos ML',           tech: 'Yahoo Finance (yfinance)',          techColor: '#f08020', cost: '$0',          costType: 'free' },
  { comp: 'Agente IA',                     tech: 'OpenClaw',                          techColor: '#c084fc', cost: '$6.29/mes',   costType: 'paid' },
  { comp: 'Hosting agente',                tech: 'Hostinger (plan administrado)',     techColor: undefined, cost: 'incluido',    costType: 'paid' },
  { comp: 'Motores IA',                    tech: 'Claude · OpenAI · Ollama · Qwen',  techColor: undefined, cost: '$0 / mínimo', costType: 'free' },
  { comp: 'Frontend',                      tech: 'React + Tailwind CSS',              techColor: '#009A93', cost: '$0',          costType: 'free' },
  { comp: 'Deploy frontend',               tech: 'Vercel + GitHub',                  techColor: '#f08020', cost: '$0',          costType: 'free' },
  { comp: 'Backend API',                   tech: 'FastAPI (Python)',                  techColor: '#009A93', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Hosting backend',               tech: 'Railway',                           techColor: '#f08070', cost: '~$5/mes',     costType: 'paid' },
  { comp: 'Base de datos',                 tech: 'Supabase (PostgreSQL)',             techColor: undefined, cost: '~$25/mes',    costType: 'paid' },
  { comp: 'IDE principal',                 tech: 'Claude Code',                       techColor: '#009A93', cost: '~$100/mes',   costType: 'paid' },
  { comp: 'IDE monitoreo',                 tech: 'Antigravity · Google Gemini',      techColor: undefined, cost: 'ya pagado',   costType: 'owned' },
]

const costColors: Record<string, string> = {
  free: '#4ade80',
  paid: '#E37200',
  owned: '#009A93',
}

const dbTables = [
  { name: 'portfolio',      desc: 'Posiciones actuales',       color: '#009A93' },
  { name: 'movements',      desc: 'Historial de transacciones', color: '#f08020' },
  { name: 'ai_decisions',   desc: 'Decisiones del agente IA',  color: '#c084fc' },
  { name: 'ml_predictions', desc: 'Resultados periódicos ML',  color: '#4ade80' },
  { name: 'performance',    desc: 'Ganancias y métricas',      color: '#00b5ad' },
]

export default function TechStack() {
  return (
    <section id="stack" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">04 — Stack tecnológico</div>
        <h2 className="font-sans font-black mb-9" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Tecnologías del proyecto
        </h2>

        <div className="rounded-[14px] overflow-hidden" style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.12)' }}>
          <div className="grid gap-4 px-6 py-3.5" style={{ gridTemplateColumns: '200px 1fr 100px', background: '#163330', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
            {['Componente', 'Tecnología', 'Costo'].map(h => (
              <span key={h} className="font-mono text-[10px] text-u-muted tracking-[0.1em] uppercase">{h}</span>
            ))}
          </div>
          {stackRows.map((r, i) => (
            <div key={r.comp}
              className="grid gap-4 px-6 py-3.5 items-center text-[14px] transition-colors duration-150 cursor-default"
              style={{ gridTemplateColumns: '200px 1fr 100px', borderBottom: i < stackRows.length - 1 ? '1px solid rgba(0,154,147,0.08)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#163330')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span className="text-u-muted text-[12px]">{r.comp}</span>
              <span className="font-semibold" style={{ color: r.techColor || '#e8f5f4' }}>{r.tech}</span>
              <span className="font-mono text-[12px]" style={{ color: costColors[r.costType] }}>{r.cost}</span>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <h3 className="text-[17px] font-bold mb-3.5">Tablas principales — Supabase</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {dbTables.map(t => (
              <div key={t.name} className="rounded-[14px] p-5"
                style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.1)' }}>
                <div className="font-mono text-[12px] mb-1.5" style={{ color: t.color }}>{t.name}</div>
                <div className="text-[12px] text-u-muted">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
