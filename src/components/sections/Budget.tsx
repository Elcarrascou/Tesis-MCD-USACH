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
const costColors: Record<string, string> = { free: '#1a7a3c', paid: '#E37200', owned: '#009A93' }

const BudgetCard = ({ title, rows }: { title: string; rows: typeof devTools }) => (
  <div className="rounded-[16px] overflow-hidden card-shadow" style={{ border: '1px solid rgba(0,154,147,0.18)' }}>
    <div className="px-7 py-4 flex justify-between items-center" style={{ background: 'rgba(0,154,147,0.08)', borderBottom: '2px solid rgba(0,154,147,0.2)' }}>
      <span className="text-[15px] font-bold" style={{ color: '#333333' }}>{title}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: '#009A93' }}>mensual</span>
    </div>
    {rows.map((r, i) => (
      <div key={r.name}
        className="flex justify-between items-center px-7 py-4 text-[15px] transition-colors duration-150"
        style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(0,154,147,0.08)' : 'none', background: '#ffffff' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f5fffe')}
        onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
        <span className="font-medium" style={{ color: '#777777' }}>{r.name}</span>
        <span className="font-mono text-[14px] font-bold" style={{ color: costColors[r.type] }}>{r.cost}</span>
      </div>
    ))}
  </div>
)

export default function Budget() {
  return (
    <section id="budget" className="py-24" style={{ background: '#f5fffe', borderBottom: '1px solid rgba(0,154,147,0.12)' }}>
      <div className="max-w-5xl mx-auto px-9">
        <div className="section-tag">05 — Presupuesto</div>
        <h2 className="font-sans font-black mb-10" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#333333' }}>
          Inversión del proyecto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <BudgetCard title="Herramientas de desarrollo" rows={devTools} />
          <BudgetCard title="Infraestructura" rows={infra} />
        </div>

        <div className="rounded-[16px] px-8 py-7 flex flex-wrap justify-between items-center gap-6 card-shadow"
          style={{ background: '#ffffff', border: '2px solid rgba(0,154,147,0.25)' }}>
          <div>
            <div className="font-mono text-[12px] mb-1.5 font-bold uppercase tracking-[0.1em]" style={{ color: '#777777' }}>Costo mensual estimado</div>
            <div className="font-sans text-[48px] font-black leading-none" style={{ color: '#009A93' }}>~$136 USD</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[12px] mb-1.5 font-bold uppercase tracking-[0.1em]" style={{ color: '#777777' }}>Presupuesto total (2 meses)</div>
            <div className="font-sans text-[48px] font-black leading-none" style={{ color: '#333333' }}>~$272 USD</div>
          </div>
        </div>

        <p className="mt-5 leading-[1.75]" style={{ fontSize: '15px', color: '#777777' }}>
          Los motores de IA para OpenClaw usarán modelos gratuitos o de bajo costo (Ollama, Qwen) para operación diaria.
          Claude/OpenAI se reservan para decisiones más complejas.
        </p>
      </div>
    </section>
  )
}
