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
