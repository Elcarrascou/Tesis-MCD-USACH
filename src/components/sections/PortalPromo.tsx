import { ExternalLink, ArrowRight } from 'lucide-react'
import { PORTAL_PROMO } from '../../data/site'

// ─── SVG mock del portal: dashboard con KPIs + donut + barras ───
function DashboardMock() {
  return (
    <svg viewBox="0 0 520 360" className="w-full h-auto block" role="img" aria-label="Vista previa del portal de gestión">
      <defs>
        <linearGradient id="pm-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fefe" />
        </linearGradient>
        <linearGradient id="pm-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#009A93" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#009A93" stopOpacity="0" />
        </linearGradient>
        <filter id="pm-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#009A93" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="520" height="360" rx="16" fill="#f5fffe" />

      {/* Sidebar */}
      <rect x="0" y="0" width="90" height="360" rx="16" fill="#333333" />
      {/* Brand mark */}
      <rect x="14" y="16" width="62" height="6" rx="3" fill="#009A93" />
      <rect x="14" y="28" width="42" height="4" rx="2" fill="#ffffff" opacity="0.3" />
      {/* Nav items */}
      <rect x="10" y="60" width="70" height="28" rx="6" fill="#009A93" />
      <rect x="20" y="71" width="50" height="6" rx="2" fill="#ffffff" />
      {[100, 134, 168, 202, 236].map(y => (
        <g key={y} opacity="0.55">
          <rect x="20" y={y + 6} width="6" height="6" rx="2" fill="#ffffff" />
          <rect x="32" y={y + 7} width="44" height="5" rx="2" fill="#ffffff" opacity="0.5" />
        </g>
      ))}

      {/* Top bar */}
      <text x="108" y="36" fontSize="14" fontWeight="800" fill="#333333" style={{ fontFamily:'"Nunito Sans"' }}>
        Resumen del portafolio
      </text>
      <text x="108" y="50" fontSize="9" fontWeight="700" fill="#009A93" letterSpacing="1" style={{ fontFamily:'"JetBrains Mono"' }}>
        PORTAL · PORTAFOLIO
      </text>

      {/* KPI row */}
      <g filter="url(#pm-shadow)">
        <rect x="108" y="66" width="125" height="60" rx="10" fill="url(#pm-card)" stroke="#009A93" strokeWidth="0.6" strokeOpacity="0.3" />
        <rect x="108" y="66" width="125" height="3" rx="2" fill="#009A93" />
        <text x="118" y="86" fontSize="7" fontWeight="700" fill="#4f4f4f" letterSpacing="0.6" style={{ fontFamily:'"JetBrains Mono"' }}>VALOR</text>
        <text x="118" y="108" fontSize="18" fontWeight="900" fill="#009A93" style={{ fontFamily:'"Nunito Sans"' }}>$43,927</text>

        <rect x="240" y="66" width="125" height="60" rx="10" fill="url(#pm-card)" stroke="#009A93" strokeWidth="0.6" strokeOpacity="0.3" />
        <rect x="240" y="66" width="125" height="3" rx="2" fill="#1a7a3c" />
        <text x="250" y="86" fontSize="7" fontWeight="700" fill="#4f4f4f" letterSpacing="0.6" style={{ fontFamily:'"JetBrains Mono"' }}>P&amp;L</text>
        <text x="250" y="108" fontSize="18" fontWeight="900" fill="#1a7a3c" style={{ fontFamily:'"Nunito Sans"' }}>+$5,143</text>
        <text x="320" y="108" fontSize="10" fontWeight="800" fill="#1a7a3c" style={{ fontFamily:'"JetBrains Mono"' }}>+13.3%</text>

        <rect x="372" y="66" width="138" height="60" rx="10" fill="url(#pm-card)" stroke="#009A93" strokeWidth="0.6" strokeOpacity="0.3" />
        <rect x="372" y="66" width="138" height="3" rx="2" fill="#E37200" />
        <text x="382" y="86" fontSize="7" fontWeight="700" fill="#4f4f4f" letterSpacing="0.6" style={{ fontFamily:'"JetBrains Mono"' }}>POSICIONES</text>
        <text x="382" y="108" fontSize="18" fontWeight="900" fill="#333333" style={{ fontFamily:'"Nunito Sans"' }}>6</text>
      </g>

      {/* Chart area */}
      <g filter="url(#pm-shadow)">
        <rect x="108" y="140" width="257" height="180" rx="10" fill="url(#pm-card)" stroke="#009A93" strokeWidth="0.6" strokeOpacity="0.3" />
        <text x="120" y="160" fontSize="9" fontWeight="800" fill="#333333" style={{ fontFamily:'"Nunito Sans"' }}>
          Portafolio vs Benchmark IPSA
        </text>
        {/* Grid */}
        {[180, 220, 260, 300].map(y => (
          <line key={y} x1="120" x2="354" y1={y} y2={y} stroke="#009A93" strokeOpacity="0.08" strokeWidth="1" />
        ))}
        {/* Portfolio line (teal) - bullish */}
        <path
          d="M 120 285 Q 145 278 165 270 T 205 250 T 245 232 T 285 218 T 325 200 T 354 188"
          fill="none" stroke="#009A93" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M 120 285 Q 145 278 165 270 T 205 250 T 245 232 T 285 218 T 325 200 T 354 188 L 354 308 L 120 308 Z"
          fill="url(#pm-area)"
        />
        <circle cx="354" cy="188" r="3" fill="#009A93" />
        {/* Benchmark line (orange) - flat-up */}
        <path
          d="M 120 285 Q 150 282 180 277 T 240 268 T 300 258 T 354 250"
          fill="none" stroke="#E37200" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round"
        />
        <circle cx="354" cy="250" r="3" fill="#E37200" />
        {/* Legend */}
        <g transform="translate(120, 168)">
          <line x1="0" x2="14" y1="0" y2="0" stroke="#009A93" strokeWidth="2" />
          <text x="20" y="3" fontSize="7" fontWeight="700" fill="#333" style={{ fontFamily:'"JetBrains Mono"' }}>PORTAFOLIO</text>
          <line x1="86" x2="100" y1="0" y2="0" stroke="#E37200" strokeWidth="2" strokeDasharray="3 2" />
          <text x="106" y="3" fontSize="7" fontWeight="700" fill="#333" style={{ fontFamily:'"JetBrains Mono"' }}>IPSA</text>
        </g>
      </g>

      {/* Donut card */}
      <g filter="url(#pm-shadow)">
        <rect x="372" y="140" width="138" height="180" rx="10" fill="url(#pm-card)" stroke="#009A93" strokeWidth="0.6" strokeOpacity="0.3" />
        <text x="384" y="160" fontSize="9" fontWeight="800" fill="#333333" style={{ fontFamily:'"Nunito Sans"' }}>Distribución</text>
        {/* Donut */}
        <g transform="translate(441 222)">
          <circle r="36" fill="none" stroke="rgba(0,154,147,0.08)" strokeWidth="11" />
          {/* 28.9% NVDA teal */}
          <circle r="36" fill="none" stroke="#009A93" strokeWidth="11"
            strokeDasharray="65.3 226" transform="rotate(-90)" />
          {/* 21.1% MSFT orange */}
          <circle r="36" fill="none" stroke="#E37200" strokeWidth="11"
            strokeDasharray="47.7 226" strokeDashoffset="-65.3" transform="rotate(-90)" />
          {/* 15.6% AAPL purple */}
          <circle r="36" fill="none" stroke="#6b21a8" strokeWidth="11"
            strokeDasharray="35.2 226" strokeDashoffset="-113" transform="rotate(-90)" />
          {/* 11.2% TSLA green */}
          <circle r="36" fill="none" stroke="#1a7a3c" strokeWidth="11"
            strokeDasharray="25.3 226" strokeDashoffset="-148.2" transform="rotate(-90)" />
          {/* 9.3% GOOGL red */}
          <circle r="36" fill="none" stroke="#c0392b" strokeWidth="11"
            strokeDasharray="21 226" strokeDashoffset="-173.5" transform="rotate(-90)" />
          <text textAnchor="middle" y="2" fontSize="12" fontWeight="900" fill="#333" style={{ fontFamily:'"Nunito Sans"' }}>$43.9k</text>
          <text textAnchor="middle" y="13" fontSize="6" fontWeight="700" fill="#4f4f4f" letterSpacing="0.5" style={{ fontFamily:'"JetBrains Mono"' }}>TOTAL</text>
        </g>
        {/* Mini legend */}
        <g transform="translate(384, 285)" fontSize="6" fontWeight="700" style={{ fontFamily:'"JetBrains Mono"' }}>
          <rect x="0"  y="0" width="6" height="6" rx="1" fill="#009A93" /><text x="9"  y="5" fill="#333">NVDA</text>
          <rect x="35" y="0" width="6" height="6" rx="1" fill="#E37200" /><text x="44" y="5" fill="#333">MSFT</text>
          <rect x="70" y="0" width="6" height="6" rx="1" fill="#6b21a8" /><text x="79" y="5" fill="#333">AAPL</text>
          <rect x="0"  y="12" width="6" height="6" rx="1" fill="#1a7a3c" /><text x="9"  y="17" fill="#333">TSLA</text>
          <rect x="35" y="12" width="6" height="6" rx="1" fill="#c0392b" /><text x="44" y="17" fill="#333">GOOGL</text>
        </g>
      </g>

      {/* Animated cursor hint */}
      <g>
        <circle cx="240" cy="225" r="6" fill="none" stroke="#E37200" strokeWidth="2" opacity="0.9">
          <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="240" cy="225" r="3" fill="#E37200" />
      </g>
    </svg>
  )
}

export default function PortalPromo() {
  return (
    <section id="portal-promo" className="py-20 sm:py-24"
      style={{ background:'linear-gradient(180deg, #ffffff 0%, #eafaf8 60%, #ffffff 100%)', borderBottom:'1px solid rgba(0,154,147,0.12)' }}>
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">

          {/* ── Left: copy + CTA ── */}
          <div>
            <div className="section-tag">{PORTAL_PROMO.tag}</div>
            <h2 className="font-sans font-black mb-4" style={{ fontSize:'clamp(28px,4vw,46px)', color:'#333333' }}>
              {PORTAL_PROMO.title}
            </h2>
            <p className="leading-[1.8] mb-8" style={{ fontSize:'clamp(16px,2vw,18px)', color:'#4f4f4f' }}>
              {PORTAL_PROMO.subtitle}
            </p>

            {/* Features grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-9">
              {PORTAL_PROMO.features.map(f => (
                <li key={f.label}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background:'#ffffff', border:'1px solid rgba(0,154,147,0.15)' }}>
                  <span className="text-[22px] flex-shrink-0" aria-hidden="true">{f.icon}</span>
                  <span>
                    <span className="block font-bold text-[15px]" style={{ color:'#333333' }}>{f.label}</span>
                    <span className="block text-[13px] leading-[1.45]" style={{ color:'#4f4f4f' }}>{f.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a href={PORTAL_PROMO.href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold press"
                style={{ background:'#E37200', color:'#ffffff', fontSize:'16px', boxShadow:'0 6px 18px rgba(227,114,0,0.25)' }}>
                <ExternalLink size={17} aria-hidden="true" /> {PORTAL_PROMO.cta}
                <ArrowRight size={17} aria-hidden="true" />
              </a>

              {/* Demo credentials */}
              <div className="rounded-xl px-4 py-2.5 inline-flex flex-col"
                style={{ background:'#ffffff', border:'1px dashed rgba(0,154,147,0.35)' }}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:'#009A93' }}>
                  {PORTAL_PROMO.demoLabel}
                </span>
                <span className="font-mono text-[12px] mt-0.5 tabular-nums" style={{ color:'#4f4f4f' }}>
                  {PORTAL_PROMO.demoEmail} · {PORTAL_PROMO.demoPassword}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: SVG dashboard mock ── */}
          <div className="relative">
            <div className="rounded-[20px] overflow-hidden card-shadow"
              style={{ border:'1px solid rgba(0,154,147,0.2)', background:'#ffffff' }}>
              {/* Browser-like top bar */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ background:'#f8fefe', borderBottom:'1px solid rgba(0,154,147,0.12)' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background:'#ff5f57' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background:'#febc2e' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background:'#28c840' }} />
                <span className="ml-3 font-mono text-[10px] font-bold tabular-nums" style={{ color:'#4f4f4f' }}>
                  tesis-mcd-usach.vercel.app/portal
                </span>
              </div>
              <DashboardMock />
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-3.5 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-[0.08em] uppercase"
              style={{ background:'#1a7a3c', color:'#ffffff', boxShadow:'0 4px 14px rgba(26,122,60,0.35)' }}>
              ● en vivo
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
