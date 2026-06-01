import type { Stat } from '../types'

// ════════════════════════════════════════════════════════════
// Metadatos del sitio y copy principal
// ════════════════════════════════════════════════════════════

export const SITE = {
  university: 'USACH',
  program: 'Magíster en Ciencia de Datos',
  year: '2026',
  author: 'D. Carrasco U.',
  projectTitle: 'Portafolio de Inversiones Gestionado por IA',
  heroTitle: ['Portafolio de Inversiones', 'Gestionado por IA'],
  heroSubtitle:
    'Aplicación web que integra un agente de inteligencia artificial con modelos de machine learning para analizar, predecir y apoyar la toma de decisiones en un portafolio de acciones bursátiles en tiempo real.',
} as const

export const HERO_STATS: Stat[] = [
  { val: '4',     label: 'Modelos ML',        color: '#009A93' },
  { val: '3',     label: 'Motores de IA',      color: '#E37200' },
  { val: '2',     label: 'Ámbitos académicos', color: '#333333' },
  { val: '~$136', label: 'USD / mes',          color: '#009A93' },
]

// ── Promo del portal operacional ──────────────────────────────
export const PORTAL_PROMO = {
  tag: 'Demo en vivo',
  title: 'Explora el portal de gestión',
  subtitle:
    'Sistema operacional con autenticación, dashboard de portafolio en tiempo real, decisiones del agente IA y gráficos cruzados de los 4 modelos ML.',
  features: [
    { icon: '📊', label: 'Dashboard',  desc: 'KPIs, distribución de activos y top movers' },
    { icon: '🧠', label: 'Decisiones IA', desc: 'Feed con justificación y confianza' },
    { icon: '📈', label: 'Ganancias',  desc: 'Portafolio vs benchmark IPSA (base 100)' },
    { icon: '🔬', label: 'Analytics',  desc: 'Predicciones por modelo y motor LLM' },
  ],
  cta: 'Abrir Portal IA',
  href: '/portal',
  demoLabel: 'Acceso demo',
  demoEmail: 'demo@tesis-mcd.cl',
  demoPassword: 'Portafolio2026',
}
