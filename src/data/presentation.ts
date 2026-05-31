import type { Slide, DocSection } from '../types'

// ════════════════════════════════════════════════════════════
// Páginas /presentacion y /anteproyecto
// ════════════════════════════════════════════════════════════

export const SLIDES: Slide[] = [
  { num: '01', title: 'Portada',             color: '#009A93' },
  { num: '02', title: 'Introducción',         color: '#E37200' },
  { num: '03', title: 'Problemática',         color: '#6b21a8' },
  { num: '04', title: 'Hipótesis',            color: '#1a7a3c' },
  { num: '05', title: 'Marco Teórico',        color: '#009A93' },
  { num: '06', title: 'Arquitectura',         color: '#E37200' },
  { num: '07', title: 'Modelos ML',           color: '#009A93' },
  { num: '08', title: 'Agente IA',            color: '#6b21a8' },
  { num: '09', title: 'Stack tecnológico',    color: '#1a7a3c' },
  { num: '10', title: 'Resultados esperados', color: '#E37200' },
  { num: '11', title: 'Conclusiones',         color: '#009A93' },
  { num: '12', title: 'Preguntas',            color: '#4f4f4f' },
]

export const ANTEPROYECTO_SECTIONS: DocSection[] = [
  { num: '1.', title: 'Resumen ejecutivo',        done: true },
  { num: '2.', title: 'Introducción',             done: true },
  { num: '3.', title: 'Hipótesis y objetivos',    done: true },
  { num: '4.', title: 'Marco Teórico',            done: true },
  { num: '5.', title: 'Metodología',              done: false },
  { num: '6.', title: 'Plan de desarrollo',       done: false },
  { num: '7.', title: 'Presupuesto y cronograma', done: false },
]

export const PRESENTATION_STATS = [
  { val: '12', label: 'Láminas planificadas' },
  { val: '6',  label: 'Secciones temáticas' },
  { val: '15', label: 'Min. estimados' },
]
