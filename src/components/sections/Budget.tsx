const devTools = [
  { name: 'Claude Code (suscripción alta)', cost: '~$100 USD', type: 'paid' },
  { name: 'Antigravity (IDE)',               cost: 'ya pagado',  type: 'owned' },
  { name: 'Google One 5TB + Gemini',         cost: 'ya pagado',  type: 'owned' },
  { name: 'GitHub',                          cost: '$0',         type: 'free' },
  { name: 'Vercel',                          cost: '$0',         type: 'free' },
]

const infra = [
  { name: 'Supabase Pro',             cost: '~$25 USD',  type: 'paid' },
  { name: 'Hostinger OpenClaw',       cost: '$6.29 USD', type: 'paid' },
  { name: 'Railway (backend)',        cost: '~$5 USD',   type: 'paid' },
  { name: 'Alpaca API',               cost: '$0',        type: 'free' },
  { name: 'Yahoo Finance (yfinance)', cost: '$0',        type: 'free' },
]

const costColors: Record<string, string> = {
  free: '#4ade80',
  paid: '#E37200',
  owned: '#009A93',
}

const BudgetCard = ({ title, rows }: { title: string; rows: typeof devTools }) => (
  <div className="rounded-[14px] overflow-hidden" style={{ background: '#112624', border: '1px solid rgba(0,154,147,0.12)' }}>
    <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(0,154,147,0.1)' }}>
      <span className="text-[13px] font-bold">{title}</span>
      <span className="font-mono text-[10px] text-u-muted uppercase tracking-[0.1em]">mensual</span>
    </div>
    {rows.map((r, i) => (
      <div key={r.name} className="flex justify-between items-center px-6 py-3 text-[13px] transition-colors duration-150"
        style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(0,154,147,0.08)' : 'none' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#163330')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
        <span className="text-u-muted">{r.name}</span>
        <span className="font-mono text-[12px]" style={{ color: costColors[r.type] }}>{r.cost}</span>
      </div>
    ))}
  </div>
)

export default function Budget() {
  return (
    <section id="budget" className="py-24" style={{ borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">05 — Presupuesto</div>
        <h2 className="font-sans font-black mb-9" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>
          Inversión del proyecto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <BudgetCard title="Herramientas de desarrollo" rows={devTools} />
          <BudgetCard title="Infraestructura" rows={infra} />
        </div>

        <div className="rounded-[14px] px-7 py-6 flex flex-wrap justify-between items-center gap-5"
          style={{ background: 'rgba(0,154,147,0.06)', border: '1px solid rgba(0,154,147,0.25)' }}>
          <div>
            <div className="font-mono text-[12px] text-u-muted mb-1">Costo mensual estimado</div>
            <div className="font-sans text-[44px] font-black leading-none" style={{ color: '#009A93' }}>~$136 USD</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[12px] text-u-muted mb-1">Presupuesto total (2 meses)</div>
            <div className="font-sans text-[44px] font-black leading-none text-u-white">~$272 USD</div>
          </div>
        </div>

        <p className="text-u-muted text-[13px] mt-4 leading-[1.7]">
          Los motores de IA para OpenClaw usarán modelos gratuitos o de bajo costo (Ollama, Qwen) para operación diaria.
          Claude/OpenAI se reservan para decisiones más complejas.
        </p>
      </div>
    </section>
  )
}
