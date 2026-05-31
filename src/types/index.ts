// ════════════════════════════════════════════════════════════
// Tipos de dominio compartidos — única fuente de verdad de tipos
// ════════════════════════════════════════════════════════════

export type CostType = 'free' | 'paid' | 'owned'

/** Barra de métrica (complejidad / interpretabilidad de un modelo) */
export interface ModelBar {
  label: string
  value: string
  percent: number
  color: string
}

/** Modelo de Machine Learning — usado en sección ML y Marco Teórico */
export interface MLModel {
  num: string
  name: string
  fullName: string
  role: string
  color: string
  formula: string
  output: string
  target: string
  shortDesc: string        // descripción breve (card de Modelos ML)
  description: string      // descripción extensa (Marco Teórico)
  points: string[]         // componentes clave
  image: string            // diagrama de arquitectura del modelo
  imgAlt: string
  bars: ModelBar[]
}

/** Capa de la arquitectura del sistema */
export interface ArchLayer {
  color: string
  label: string
  items: string[]
}

/** Paso del flujo de desarrollo / deploy */
export interface FlowStep {
  icon: string
  label: string
  bg: string
  border: string
}

/** Vista de la aplicación web */
export interface AppView {
  icon: string
  title: string
  desc: string
  top?: string
  special?: boolean
}

/** Fila del stack tecnológico */
export interface StackRow {
  comp: string
  tech: string
  techColor: string
  cost: string
  costType: CostType
}

/** Tabla de la base de datos (resumen visual) */
export interface DbTable {
  name: string
  desc: string
  color: string
}

/** Ítem de presupuesto */
export interface BudgetItem {
  name: string
  cost: string
  type: CostType
}

/** Fase del roadmap */
export interface RoadmapPhase {
  phase: string
  title: string
  desc: string
  color: string
  status: string
}

/** Nodo del diagrama interactivo del sistema */
export interface SystemNode {
  id: string
  label: string
  sub: string
  x: number
  y: number
  color: string
  desc: string
  tech: string
}

/** Conexión (arista) del diagrama interactivo */
export interface SystemEdge {
  from: string
  to: string
  color: string
  dash?: boolean
  dur: number
  delay: number
}

/** Lámina de la presentación */
export interface Slide {
  num: string
  title: string
  color: string
}

/** Sección del documento de anteproyecto */
export interface DocSection {
  num: string
  title: string
  done: boolean
}

/** Estadística destacada (hero) */
export interface Stat {
  val: string
  label: string
  color: string
}
