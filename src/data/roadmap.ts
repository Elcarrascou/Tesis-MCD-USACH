import type { RoadmapPhase } from '../types'

// ════════════════════════════════════════════════════════════
// Sección 07 — Roadmap: fases de desarrollo del proyecto
// ════════════════════════════════════════════════════════════

export const ROADMAP_PHASES: RoadmapPhase[] = [
  { phase: 'Fase 1', title: 'Setup & Configuración',        color: '#009A93', status: 'En progreso',
    desc: 'Inicialización del repositorio, configuración de Supabase, Alpaca API y entorno de desarrollo. Diseño del esquema de base de datos y arquitectura del sistema.' },
  { phase: 'Fase 2', title: 'Modelos de Machine Learning',  color: '#E37200', status: 'Próximo',
    desc: 'Extracción de datos históricos con Yahoo Finance. Entrenamiento y validación de los 4 modelos: LSTM, XGBoost, Prophet y Random Forest. Implementación del endpoint FastAPI.' },
  { phase: 'Fase 3', title: 'Integración del Agente IA',    color: '#6b21a8', status: 'Próximo',
    desc: 'Configuración de OpenClaw en Hostinger. Desarrollo de skills personalizadas para análisis de portafolio. Integración con Telegram/WhatsApp y conexión con los modelos ML.' },
  { phase: 'Fase 4', title: 'Desarrollo Frontend',          color: '#1a7a3c', status: 'Próximo',
    desc: 'Construcción de la aplicación web con React + Tailwind. Implementación de todas las vistas: Portafolio, Movimientos, Decisiones IA, Ganancias y Modelos ML.' },
  { phase: 'Fase 5', title: 'Testing & Optimización',       color: '#009A93', status: 'Próximo',
    desc: 'Backtesting de los modelos ML con datos históricos. Evaluación de rendimiento del agente IA. Ajuste de hiperparámetros y métricas de comparación.' },
  { phase: 'Fase 6', title: 'Documentación & Presentación', color: '#E37200', status: 'Final',
    desc: 'Redacción del informe final de tesis. Preparación de láminas para la presentación ante el comité evaluador del Magíster en Ciencia de Datos.' },
]
