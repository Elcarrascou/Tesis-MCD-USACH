import type { MLModel } from '../types'
import lstmImg    from '../assets/diagrama-lstm.png'
import xgboostImg from '../assets/diagrama-xgboost.png'
import prophetImg from '../assets/diagrama-prophet.jpg'
import rfImg      from '../assets/diagrama-random-forest.jpg'

// ════════════════════════════════════════════════════════════
// Los 4 modelos de Machine Learning — ÚNICA FUENTE DE VERDAD
// Consumido por: sections/MLModels.tsx y sections/MarcoTeorico.tsx
// ════════════════════════════════════════════════════════════

export const ML_MODELS: MLModel[] = [
  {
    num: '01',
    name: 'LSTM',
    fullName: 'Long Short-Term Memory',
    role: 'Long Short-Term Memory Network',
    color: '#009A93',
    formula: 'hₜ = oₜ ⊙ tanh(Cₜ)',
    output: 'Predicción de precio futuro',
    target: '→ Predice precio futuro',
    shortDesc: 'Red neuronal para series temporales. Aprende patrones históricos de precio y predice el valor futuro de un activo. Captura dependencias a largo plazo en datos del mercado.',
    description: 'Las redes LSTM son un tipo de red neuronal recurrente diseñada para aprender dependencias a largo plazo en datos secuenciales. Cuentan con tres compuertas: olvido (decide qué información descartar del estado anterior), entrada (guarda nueva información relevante) y salida (filtra el estado de la celda para generar el estado oculto). Esta arquitectura la hace ideal para predecir series temporales financieras, capturando patrones históricos de precio y volatilidad de las acciones del IPSA influenciadas por el Dow Jones.',
    points: [
      'Compuerta de olvido — descarta información irrelevante del pasado',
      'Compuerta de entrada — incorpora nueva información del mercado',
      'Estado de celda — "cinta transportadora" de memoria a largo plazo',
      'Compuerta de salida — genera la predicción de precio futuro',
    ],
    image: lstmImg,
    imgAlt: 'Anatomía de una Red Neuronal Recurrente LSTM — Flujo de información y compuertas',
    bars: [
      { label: 'Complejidad',       value: 'Alta', percent: 88, color: '#009A93' },
      { label: 'Interpretabilidad', value: 'Baja', percent: 22, color: '#E37200' },
    ],
  },
  {
    num: '02',
    name: 'XGBoost',
    fullName: 'Extreme Gradient Boosting',
    role: 'Extreme Gradient Boosting',
    color: '#E37200',
    formula: 'ŷ = Σₖ fₖ(xᵢ),  fₖ ∈ F',
    output: 'Señal de compra / venta',
    target: '→ Señal compra / venta',
    shortDesc: 'Árboles de decisión potenciados. Trabaja con variables mixtas: precio, volumen, volatilidad e indicadores técnicos. Rápido, robusto y con gran rendimiento en datasets financieros.',
    description: 'XGBoost construye un ensamble de árboles de decisión de forma secuencial, donde cada árbol corrige los errores residuales del modelo anterior. Trabaja con variables mixtas como precio, volumen, volatilidad e indicadores técnicos para generar una señal de trading. Su eficiencia computacional y robustez ante datos financieros ruidosos lo convierten en uno de los modelos más utilizados en predicción financiera cuantitativa.',
    points: [
      'Entrenamiento secuencial — cada árbol corrige el error del anterior',
      'Regularización L1/L2 — evita el sobreajuste en datos financieros',
      'Variables: precio, volumen, volatilidad, indicadores técnicos',
      'Salida: probabilidad de compra o venta (señal de trading)',
    ],
    image: xgboostImg,
    imgAlt: 'Arquitectura XGBoost — Entrenamiento secuencial de árboles de decisión',
    bars: [
      { label: 'Complejidad',       value: 'Media', percent: 58, color: '#E37200' },
      { label: 'Interpretabilidad', value: 'Media', percent: 62, color: '#E37200' },
    ],
  },
  {
    num: '03',
    name: 'Prophet',
    fullName: 'Time Series Forecasting — Meta AI',
    role: 'Time Series Forecasting — Meta AI',
    color: '#1a7a3c',
    formula: 'y(t) = g(t) + s(t) + h(t) + ε',
    output: 'Tendencia y estacionalidad del mercado',
    target: '→ Tendencia y estacionalidad',
    shortDesc: 'Desarrollado por Meta para series temporales con estacionalidad y tendencias. Detecta ciclos del mercado y proyecta tendencias a mediano plazo. Muy fácil de interpretar y explicar al comité.',
    description: 'Prophet descompone la serie temporal en tres componentes aditivos: tendencia g(t) que modela el crecimiento a largo plazo, estacionalidad s(t) que captura patrones cíclicos del mercado (diarios, semanales, anuales) y efectos de feriados h(t) como el cierre de bolsas. Esta transparencia y facilidad de interpretación lo hace muy valioso para presentar y explicar predicciones ante el comité evaluador del MCD.',
    points: [
      'g(t) — tendencia: modela el crecimiento general del activo',
      's(t) — estacionalidad: captura ciclos del mercado financiero',
      'h(t) — feriados: ajusta cierres de bolsa y eventos especiales',
      'ε — ruido: variabilidad residual no explicada por el modelo',
    ],
    image: prophetImg,
    imgAlt: 'Arquitectura del Modelo Prophet — Componentes de tendencia, estacionalidad y feriados',
    bars: [
      { label: 'Complejidad',       value: 'Baja-Media', percent: 38, color: '#1a7a3c' },
      { label: 'Interpretabilidad', value: 'Alta',       percent: 87, color: '#22c55e' },
    ],
  },
  {
    num: '04',
    name: 'Random Forest',
    fullName: 'Ensemble Classification (Bosque Aleatorio)',
    role: 'Ensemble Classification',
    color: '#6b21a8',
    formula: 'ŷ_final = Ensemble{ŷ₁, ŷ₂, … ŷₜ}',
    output: 'Nivel de riesgo del activo',
    target: '→ Nivel de riesgo del activo',
    shortDesc: 'Clasifica el nivel de riesgo del activo (bajo / medio / alto) evaluando múltiples variables en paralelo. Genera señales de zona: compra, venta o mantener, considerando el perfil de riesgo.',
    description: 'Random Forest construye múltiples árboles de decisión usando muestreo bootstrap (remuestreo con reemplazo) y subconjuntos aleatorios de características. La predicción final se obtiene por votación mayoritaria para clasificación o promedio para regresión. Clasifica el nivel de riesgo del activo (bajo/medio/alto) evaluando simultáneamente múltiples variables financieras, entregando al agente IA una señal confiable sobre el perfil de riesgo del portafolio.',
    points: [
      'Muestreo Bootstrap — cada árbol se entrena con datos distintos',
      'Votación mayoritaria — decisión colectiva de N árboles',
      'Clasificación: riesgo bajo / medio / alto del activo',
      'Alta interpretabilidad — importancia de variables financieras',
    ],
    image: rfImg,
    imgAlt: 'Arquitectura del Modelo Random Forest — Votación mayoritaria de árboles individuales',
    bars: [
      { label: 'Complejidad',       value: 'Media', percent: 50, color: '#7c3aed' },
      { label: 'Interpretabilidad', value: 'Alta',  percent: 82, color: '#a855f7' },
    ],
  },
]
