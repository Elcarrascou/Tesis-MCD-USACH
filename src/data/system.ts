import type { SystemNode, SystemEdge } from '../types'

// ════════════════════════════════════════════════════════════
// Página /solucion — Diagrama interactivo del sistema completo
// Cada nodo lleva un `detail` con:
//  • Definición técnica/conceptual
//  • Cómo se aplica EN ESTE proyecto (IPSA + Dow Jones)
//  • Inputs / Outputs financieros
//  • Métricas que entrega para la toma de decisiones
//  • Rationale (por qué se eligió)
// ════════════════════════════════════════════════════════════

export const NODE_W = 112
export const NODE_H = 52
export const NODE_R = 10

export const SYSTEM_NODES: SystemNode[] = [
  // ─────────────────────────────────────────────  DATOS  ─────────────────────────────────────────────
  {
    id:'yahoo', label:'Yahoo Finance', sub:'Datos históricos', x:90, y:150, color:'#E37200',
    desc:'Proporciona series históricas de precios del IPSA y Dow Jones para entrenar los 4 modelos ML.',
    tech:'Python · yfinance',
    detail: {
      whatIs: 'Yahoo Finance es un proveedor gratuito de datos de mercado con cobertura global, accedido vía la librería Python yfinance. Entrega precios OHLCV (Open/High/Low/Close/Volume) ajustados por dividendos y splits, con resolución diaria desde 1970+.',
      usage: 'En el proyecto descarga >5 años de historia diaria del Dow Jones (^DJI) y de los principales tickers del IPSA chileno (SQM-B.SN, CHILE.SN, COPEC.SN, FALABELLA.SN, ENELCHILE.SN, entre otros). Estos datos alimentan el entrenamiento de LSTM, XGBoost, Prophet y Random Forest, y permiten construir features de cointegración Dow Jones ⇄ IPSA (variable de influencia central de la tesis).',
      inputs: ['Tickers (símbolos): IPSA, ^DJI, ^GSPC, ^VIX', 'Rango temporal: 2018-01-01 → fecha actual', 'Resolución: diaria (también 1m/5m/1h disponible)'],
      outputs: ['DataFrame OHLCV ajustado por splits/dividendos', 'Series de retornos logarítmicos rₜ = ln(Pₜ/Pₜ₋₁)', 'Indicadores técnicos derivados (SMA, EMA, RSI, MACD, ATR, Bollinger)'],
      decisionMetrics: ['Correlación rolling Dow Jones ⇄ IPSA (ventana 30/60/90 días)', 'Volatilidad histórica anualizada σ·√252', 'β del IPSA respecto al Dow Jones'],
      rationale: 'Es gratuito, suficiente para análisis académico de tesis y no requiere API key. Para producción real se sustituiría por Bloomberg/Refinitiv, pero el costo no se justifica en esta fase. La librería yfinance es estable y ampliamente usada en la academia.',
    },
  },
  {
    id:'alpaca', label:'Alpaca API', sub:'Tiempo real + broker', x:90, y:350, color:'#009A93',
    desc:'Broker API-first con paper trading global y datos de mercado en tiempo real para ejecutar órdenes.',
    tech:'Alpaca Trade API',
    detail: {
      whatIs: 'Alpaca es un broker API-first regulado en EE.UU. (SEC/FINRA) que ofrece market data streaming (WebSocket) y ejecución de órdenes vía REST. Soporta paper trading (sandbox con dinero ficticio) y trading real con comisión cero en acciones US.',
      usage: 'En el proyecto se usa exclusivamente paper trading. Cumple dos funciones críticas: (1) entrega precios intradía y bid/ask en tiempo real al backend FastAPI, (2) recibe las órdenes que el usuario decide ejecutar a partir de las recomendaciones del agente OpenClaw. Cada orden ejecutada se persiste en la tabla movements.',
      inputs: ['API key + secret (paper trading)', 'Símbolo, cantidad, tipo de orden (market/limit), TIF (DAY/GTC)', 'Subscripción WebSocket a trades/quotes/bars'],
      outputs: ['Precio actual y libro de órdenes (bid/ask)', 'Confirmaciones de orden (alpaca_order_id, fill_price, filled_qty)', 'Estado del portfolio (positions, cash, equity)'],
      decisionMetrics: ['Spread bid/ask en tiempo de ejecución', 'Slippage = (fill_price − decision_price) / decision_price', 'Latencia de ejecución end-to-end'],
      rationale: 'Es la única alternativa freemium con API moderna y paper trading global. Alternativas como Interactive Brokers requieren cuenta con depósito mínimo y su API es más compleja. Para la tesis, paper trading es suficiente y elimina riesgo financiero real.',
    },
  },
  // ─────────────────────────────────────────────  MODELOS ML  ─────────────────────────────────────────────
  {
    id:'lstm', label:'LSTM', sub:'Precio futuro', x:290, y:70, color:'#009A93',
    desc:'Red neuronal recurrente que aprende dependencias temporales y predice el precio futuro del activo.',
    tech:'TensorFlow · Keras',
    detail: {
      whatIs: 'Las Long Short-Term Memory (Hochreiter & Schmidhuber, 1997) son redes neuronales recurrentes con tres compuertas (olvido fₜ, entrada iₜ, salida oₜ) y un estado de celda Cₜ que actúa como memoria de largo plazo. Resuelven el problema de gradientes que desaparecen de las RNN clásicas, permitiendo aprender dependencias temporales de cientos de pasos.',
      usage: 'En el proyecto entrena con ventanas deslizantes de 60 días de retornos log + features técnicos del Dow Jones y del activo IPSA objetivo. Predice el precio de cierre a horizonte t+1, t+5 y t+20 días. El factor diferenciador es la inclusión del Dow Jones como variable exógena: la red aprende cómo movimientos del mercado US se propagan al IPSA con un rezago de 0–2 días (efecto spillover).',
      inputs: ['Ventana de 60 días de retornos OHLC del activo IPSA', 'Mismo período del Dow Jones (variable exógena clave)', 'Volatilidad realizada y volumen normalizado'],
      outputs: ['Precio predicho ŷₜ₊ₖ a horizontes 1/5/20 días', 'Intervalo de predicción (Monte Carlo Dropout)', 'Persistido en ml_predictions.predicted_value'],
      decisionMetrics: ['MAE (Mean Absolute Error) sobre conjunto de validación', 'RMSE y MAPE en backtesting walk-forward', 'Directional Accuracy: % de aciertos en signo del movimiento'],
      rationale: 'LSTM captura no-linealidades y memoria temporal que ARIMA/regresión lineal no pueden modelar. Frente a Transformers (más recientes), LSTM requiere menos datos y compute, lo que la hace adecuada para series financieras del IPSA que tienen menos liquidez y menos historia que activos US.',
    },
  },
  {
    id:'xgb', label:'XGBoost', sub:'Señal compra/venta', x:290, y:195, color:'#E37200',
    desc:'Gradient boosting con indicadores técnicos, precio y volumen para generar la señal de trading.',
    tech:'XGBoost · Python',
    detail: {
      whatIs: 'XGBoost (Chen & Guestrin, 2016) es un ensamble de árboles de decisión entrenado por gradient boosting: cada árbol nuevo corrige los residuos del anterior. Incluye regularización L1/L2, manejo nativo de valores NaN, paralelización y poda óptima. Domina competencias Kaggle de predicción financiera tabular.',
      usage: 'Se entrena como clasificador multiclase {Buy, Hold, Sell} usando ~25 features: retornos a 1/5/20 días del activo y del Dow Jones, RSI(14), MACD(12,26,9), Bollinger %B, ATR(14), volumen relativo, día de la semana, mes, y cointegración rolling Dow Jones ⇄ activo. La etiqueta se construye con retornos futuros umbralizados (>2σ → Buy, <−2σ → Sell, resto → Hold).',
      inputs: ['Features técnicos del activo (RSI, MACD, Bollinger, ATR)', 'Features macro del Dow Jones (retornos, volatilidad)', 'Calendar features (day-of-week, month, post-holiday)'],
      outputs: ['Clase predicha {Buy, Hold, Sell}', 'Probabilidades P(Buy), P(Hold), P(Sell)', 'Feature importances (gain/cover/frequency) — fundamental para explicabilidad'],
      decisionMetrics: ['Sharpe Ratio del backtest de la estrategia', 'Precision/Recall por clase (esp. evitar falsos Buy)', 'Maximum Drawdown', 'Profit Factor = ganancia bruta / pérdida bruta'],
      rationale: 'Tabular + features mixtas es exactamente el dominio donde XGBoost domina. Frente a Random Forest, captura interacciones más finas; frente a redes neuronales, es interpretable mediante feature importances y SHAP values, lo que permite explicar al comité por qué generó cada señal.',
    },
  },
  {
    id:'prophet', label:'Prophet', sub:'Tendencia IPSA', x:290, y:320, color:'#1a7a3c',
    desc:'Modelo de Meta AI que descompone estacionalidad y tendencia del mercado a mediano plazo.',
    tech:'Meta Prophet',
    detail: {
      whatIs: 'Prophet (Taylor & Letham, Meta 2018) es un modelo aditivo descomponible: y(t) = g(t) + s(t) + h(t) + εₜ. g(t) es la tendencia con cambios estructurales detectados automáticamente (piecewise lineal o logística), s(t) la estacionalidad via series de Fourier, h(t) el efecto de feriados, y ε el ruido. Diseñado para ser robusto a datos faltantes y outliers.',
      usage: 'Modela la tendencia macro del índice IPSA y de los activos individuales a horizonte mensual/trimestral. Detecta automáticamente changepoints (puntos donde la pendiente cambia, ej. crisis 2008, COVID-19, estallido social 2019). Los feriados se configuran con el calendario bursátil chileno (Año Nuevo, 18-21 sept, Navidad, Viernes Santo) que afecta liquidez. Es el modelo más interpretable y será central en la defensa de la tesis.',
      inputs: ['Serie histórica del activo (mínimo 2 años)', 'Calendario de feriados de la Bolsa de Santiago', 'Hiperparámetros: changepoint_prior_scale, seasonality_mode'],
      outputs: ['Forecast ŷ(t) con intervalo de confianza yhat_lower / yhat_upper', 'Descomposición visual: tendencia, estacionalidad anual/semanal, feriados', 'Lista de changepoints detectados con su importancia'],
      decisionMetrics: ['Coverage del intervalo de predicción (% de observaciones reales dentro)', 'MAPE en backtest cross-validation', 'Estabilidad de la tendencia (¿está en zona alcista o bajista?)'],
      rationale: 'Su transparencia es invaluable para el comité evaluador. Frente a modelos black-box, Prophet permite mostrar gráficamente "esta es la tendencia, esta es la estacionalidad, este es el efecto del 18 de septiembre". Es el componente pedagógico del ensemble.',
    },
  },
  {
    id:'rf', label:'Random Forest', sub:'Nivel de riesgo', x:290, y:445, color:'#6b21a8',
    desc:'Clasifica el riesgo del activo (bajo / medio / alto) mediante votación de múltiples árboles.',
    tech:'scikit-learn',
    detail: {
      whatIs: 'Random Forest (Breiman, 2001) es un ensamble bagging de árboles de decisión: cada árbol se entrena con (a) un subconjunto bootstrap de las filas y (b) un subconjunto aleatorio de las columnas en cada split. La predicción final es por voto mayoritario (clasificación) o promedio (regresión). Reduce la varianza vs un solo árbol sin sacrificar mucho sesgo.',
      usage: 'Se entrena como clasificador del nivel de riesgo del activo: {Bajo, Medio, Alto}. La etiqueta se construye con métricas de riesgo realizado: volatilidad anualizada, Value at Risk al 5%, Maximum Drawdown del último trimestre y β respecto al IPSA. Los features incluyen indicadores de volatilidad implícita (proxies vía ATR y Bollinger Width), liquidez (volumen promedio y bid-ask spread) y exposición al Dow Jones.',
      inputs: ['Volatilidad histórica 30/60/90 días', 'ATR(14), Bollinger Bandwidth', 'Volumen relativo + ratio bid-ask', 'β rolling vs IPSA y vs Dow Jones'],
      outputs: ['Clase de riesgo {Bajo, Medio, Alto} con probabilidades', 'Feature importance (qué métrica pesa más en la clasificación)', 'Distancia al hiperplano de decisión (confianza)'],
      decisionMetrics: ['Confusion matrix por clase de riesgo', 'F1-score balanceado (clases desbalanceadas típicamente)', 'Permutation importance (más robusta que gini importance)'],
      rationale: 'Complementa al stack predictivo con una visión defensiva: aunque LSTM diga "comprar", si Random Forest clasifica el activo como Alto riesgo, el agente OpenClaw modera la recomendación. Es resistente a overfitting (vs un árbol único) y muy interpretable vs modelos neuronales.',
    },
  },
  // ─────────────────────────────────────────────  BACKEND  ─────────────────────────────────────────────
  {
    id:'fastapi', label:'FastAPI', sub:'Consolidación', x:490, y:195, color:'#009A93',
    desc:'Consolida las 4 predicciones ML en un único endpoint REST que consume el agente OpenClaw.',
    tech:'FastAPI · Railway',
    detail: {
      whatIs: 'FastAPI es un framework web Python asíncrono basado en Starlette + Pydantic, con generación automática de OpenAPI/Swagger y validación de tipos. Es uno de los frameworks Python más rápidos (similar a Node.js/Go) y el estándar moderno para APIs ML en producción.',
      usage: 'Expone endpoints REST consumidos por OpenClaw: GET /predict/{symbol} (consolida las 4 predicciones del último cierre), GET /portfolio (estado actual), POST /backtest (corre simulación con parámetros). Cachea predicciones en Redis con TTL 1h para evitar recomputar. Convierte las salidas heterogéneas de los 4 modelos en un esquema unificado MlPrediction que se persiste en Supabase.',
      inputs: ['Símbolo, horizonte temporal', 'Parámetros de backtest (fechas, capital inicial)', 'Webhooks de eventos del agente'],
      outputs: ['JSON con predicciones consolidadas: precio LSTM, señal XGBoost, tendencia Prophet, riesgo RF', 'Métricas de performance del backtest', 'OpenAPI auto-generado para integración'],
      decisionMetrics: ['Latencia p50/p95/p99 por endpoint', 'Cache hit ratio (Redis)', 'Tasa de errores 5xx'],
      rationale: 'La asincronía permite paralelizar las 4 llamadas a modelos ML (asyncio.gather), reduciendo latencia de ~800ms a ~250ms. Pydantic garantiza que los datos que llegan a Supabase respetan el esquema. Railway proporciona deploy git-based gratis para hobby tier, ideal para tesis.',
    },
  },
  {
    id:'supa', label:'Supabase', sub:'PostgreSQL', x:490, y:390, color:'#555555',
    desc:'Almacena portfolio, movimientos, decisiones IA, predicciones ML y métricas de rendimiento.',
    tech:'Supabase Pro · PostgreSQL',
    detail: {
      whatIs: 'Supabase es Backend-as-a-Service open source construido sobre PostgreSQL 15+. Provee auth (GoTrue), storage, Realtime (basado en Postgres logical replication), Edge Functions (Deno) y dashboard. Sigue siendo SQL puro, sin abstracciones ORM.',
      usage: 'Es el corazón persistente del sistema. Tiene 5 tablas: portfolio (posiciones actuales), movements (historial de transacciones de Alpaca), ai_decisions (recomendaciones de OpenClaw con justificación y confianza), ml_predictions (output de los 4 modelos con horizonte y signal), performance (snapshots diarios para gráficos). Row-Level Security activa: las tablas operacionales sólo son legibles por usuarios authenticated, garantizando que el portal /portal requiera login.',
      inputs: ['Inserts desde FastAPI (predicciones, decisiones)', 'Inserts desde sync job Alpaca (movements)', 'Reads desde el portal React'],
      outputs: ['Query results tipados (database.types.ts auto-generado)', 'Eventos Realtime de cambios (canal de Postgres)', 'Logs de auditoría auth.audit_log_entries'],
      decisionMetrics: ['Query time promedio (target <100ms)', 'Tamaño de la BD (Free tier = 500MB)', '% de filas con índice utilizado en queries'],
      rationale: 'Versus Firebase: SQL puro permite joins complejos y queries analíticas que NoSQL no soporta. Versus self-hosted Postgres: ahorra horas de administración (backups, replicación, certs SSL). Versus AWS RDS: tiene auth + storage + realtime integrados sin pegamento adicional.',
    },
  },
  // ─────────────────────────────────────────────  AGENTE IA  ─────────────────────────────────────────────
  {
    id:'openclaw', label:'OpenClaw', sub:'Agente autónomo', x:690, y:195, color:'#6b21a8',
    desc:'Orquesta los modelos ML, razona sobre el mercado y genera recomendaciones de rebalanceo.',
    tech:'OpenClaw · Hostinger',
    detail: {
      whatIs: 'OpenClaw es un framework de orquestación de agentes LLM con skills (capacidades modulares) y memoria persistente. Permite encadenar razonamiento, llamadas a herramientas (function calling), y decidir cuándo invocar qué motor LLM. Es la capa cognitiva del sistema.',
      usage: 'Se ejecuta cada día tras cierre del mercado. Skills configuradas: (1) fetch_predictions: invoca FastAPI y consume las 4 predicciones ML, (2) read_portfolio: lee posiciones actuales y movimientos recientes, (3) detect_market_events: consulta noticias (Bloomberg RSS, SEC filings), (4) generate_decision: razona sobre todo el contexto y genera una decisión {Buy, Sell, Hold, Rebalance} con justificación en lenguaje natural, (5) persist_decision: graba en ai_decisions y dispara notificación Telegram.',
      inputs: ['Predicciones consolidadas de los 4 modelos ML', 'Estado actual del portfolio + movimientos', 'Contexto macro (eventos relevantes del día)', 'Memoria de decisiones anteriores'],
      outputs: ['Decisión estructurada: acción + símbolo + confianza ∈ [0,1] + rationale (texto)', 'Resumen diario en lenguaje natural via Telegram', 'Trace completo del razonamiento (auditable)'],
      decisionMetrics: ['Tasa de decisiones por tipo (% Buy, Sell, Hold, Rebalance)', 'Confianza promedio agregada', 'P&L atribuible a decisiones del agente vs buy-and-hold', 'Coherencia: ¿el rationale se alinea con las predicciones ML?'],
      rationale: 'Sin un agente que sintetice, las 4 predicciones ML serían 4 señales aisladas (potencialmente contradictorias) que el usuario tendría que interpretar manualmente. OpenClaw aporta la capa de razonamiento financiero: pondera las señales según contexto, modera con análisis de riesgo, y explica en lenguaje natural — lo que es el aporte académico central de la tesis (combinar ML clásico + LLMs).',
    },
  },
  {
    id:'llms', label:'Motores LLM', sub:'Claude/GPT/Ollama', x:690, y:370, color:'#333333',
    desc:'Motores de lenguaje que alimentan a OpenClaw: Claude para decisiones complejas, Ollama para uso diario.',
    tech:'Anthropic · OpenAI · Ollama',
    detail: {
      whatIs: 'Los Large Language Models (LLMs) son redes neuronales tipo Transformer entrenadas en corpora masivos. Claude (Anthropic), GPT (OpenAI) son modelos comerciales accedidos vía API. Ollama es un runtime local para correr modelos open-source (Llama 3, Qwen 2.5, Mistral) en hardware propio sin costo por token.',
      usage: 'Estrategia híbrida costo-eficiente: (1) Ollama corre los análisis diarios rutinarios (resumen del cierre, primera evaluación de señales ML) — costo cero. (2) Claude se invoca para decisiones complejas: rebalanceo de portafolio, eventos de mercado con incertidumbre alta, generación del rationale final que va al usuario. (3) GPT se usa como fallback de Claude. El routing se decide por la confianza de Ollama: si <0.7, escala a Claude.',
      inputs: ['System prompt con rol del agente financiero', 'Contexto: predicciones ML + portfolio + eventos', 'Memoria de decisiones recientes (RAG sobre ai_decisions)'],
      outputs: ['Razonamiento estructurado paso a paso', 'Decisión final con confianza calibrada', 'Justificación en lenguaje natural para el usuario'],
      decisionMetrics: ['Tokens consumidos por motor', 'Costo USD por decisión (target <$0.02)', 'Latencia de inferencia', 'Tasa de escalamiento Ollama → Claude'],
      rationale: 'Usar sólo Claude/GPT haría inviable el costo a escala. Usar sólo Ollama sacrifica calidad en decisiones críticas. La arquitectura por niveles optimiza costo/calidad — un patrón estándar en sistemas LLM en producción que vale la pena defender en la presentación.',
    },
  },
  // ─────────────────────────────────────────────  INTERFAZ  ─────────────────────────────────────────────
  {
    id:'webapp', label:'React Web App', sub:'Dashboard', x:890, y:155, color:'#009A93',
    desc:'Visualiza posiciones, predicciones ML, decisiones IA y rendimiento. Incluye enlace directo a Alpaca.',
    tech:'React · Tailwind · Vercel',
    detail: {
      whatIs: 'Single Page Application construida con React 19 + Vite + TypeScript + Tailwind CSS v3. Renderizado client-side con React Router. Deploy en Vercel con git-based CI/CD: cada push a main dispara build + deploy + invalidación de CDN.',
      usage: 'Es la cara visible del sistema. Dos secciones: (a) sitio de documentación pública (este sitio que ve el comité de tesis) y (b) /portal — portal operacional autenticado con 5 vistas que consumen Supabase: Portafolio (KPIs + posiciones), Movimientos (historial), Decisiones IA (feed con rationale), Ganancias (sparkline + retorno vs benchmark) y Modelos ML (predicciones detalladas).',
      inputs: ['Lectura de Supabase via SDK tipado', 'Session auth (JWT en localStorage)', 'Rutas de React Router'],
      outputs: ['Renderizado interactivo con accesibilidad (ARIA, focus-visible)', 'Estados loading/error/empty consistentes', 'Enlaces directos a Alpaca para ejecutar órdenes manualmente'],
      decisionMetrics: ['Tiempo de carga (Largest Contentful Paint <2.5s)', 'Bundle size (target <300kB gzipped)', 'Accesibilidad: score Lighthouse a11y'],
      rationale: 'React + Vite es el stack estándar moderno con la mejor DX. Vercel da SSL, CDN global y previews por PR sin configuración. El portal sirve dos propósitos: usabilidad real (gestión del portafolio) y demo viva para la defensa de la tesis.',
    },
  },
  {
    id:'telegram', label:'Telegram', sub:'Chatbot IA', x:890, y:350, color:'#E37200',
    desc:'Canal proactivo del agente para alertas, recomendaciones y resumen diario del portafolio.',
    tech:'Telegram Bot API',
    detail: {
      whatIs: 'Telegram Bot API es una interfaz REST/long-polling para construir bots conversacionales. Soporta mensajes con formato Markdown/HTML, botones inline (callback queries), comandos slash y media. No requiere mantener apps móviles propias.',
      usage: 'Es el canal proactivo del agente OpenClaw — al revés del web app que es pull (el usuario abre el portal), Telegram es push (el agente notifica). Casos de uso: (1) Resumen diario a las 18:00 con cierre del día y decisiones tomadas, (2) Alerta inmediata si una decisión es Sell por Random Forest alto riesgo, (3) Botones inline "Aprobar" / "Rechazar" para que el usuario confirme antes de que OpenClaw genere la orden sugerida en Alpaca, (4) Consultas conversacionales tipo "¿cómo está NVDA?" responde con predicciones consolidadas.',
      inputs: ['Webhook con mensajes/comandos del usuario', 'Eventos disparados por OpenClaw (decisiones, alertas)', 'Bot token + chat_id del usuario'],
      outputs: ['Mensajes formateados con Markdown', 'Botones inline para confirmaciones', 'Comandos slash: /portfolio, /predict <symbol>, /pause'],
      decisionMetrics: ['Tasa de aprobación de recomendaciones (clicks en "Aprobar")', 'Tiempo de respuesta del usuario tras alerta', 'Engagement: mensajes/día'],
      rationale: 'WhatsApp Business API tiene costo por mensaje y aprobación lenta de plantillas. Email es asíncrono y los usuarios no lo revisan. Telegram tiene API gratis, instantánea y soporta UX rica (botones, media). El componente human-in-the-loop (aprobar/rechazar) es éticamente importante: el agente sugiere, el usuario decide y ejecuta.',
    },
  },
]

export const SYSTEM_EDGES: SystemEdge[] = [
  { from:'yahoo',   to:'lstm',     color:'#E37200', dur:2.2, delay:0   },
  { from:'yahoo',   to:'xgb',      color:'#E37200', dur:2.5, delay:0.4 },
  { from:'yahoo',   to:'prophet',  color:'#E37200', dur:2.8, delay:0.8 },
  { from:'yahoo',   to:'rf',       color:'#E37200', dur:3.1, delay:1.2 },
  { from:'alpaca',  to:'fastapi',  color:'#009A93', dur:2.0, delay:0.3 },
  { from:'lstm',    to:'fastapi',  color:'#009A93', dur:2.0, delay:0.6 },
  { from:'xgb',     to:'fastapi',  color:'#E37200', dur:2.0, delay:0.9 },
  { from:'prophet', to:'fastapi',  color:'#1a7a3c', dur:2.0, delay:1.1 },
  { from:'rf',      to:'fastapi',  color:'#6b21a8', dur:2.0, delay:1.4 },
  { from:'fastapi', to:'openclaw', color:'#6b21a8', dur:1.8, delay:0.5 },
  { from:'fastapi', to:'supa',     color:'#555555', dur:2.2, delay:0.8 },
  { from:'llms',    to:'openclaw', color:'#555555', dur:1.6, delay:0.2 },
  { from:'supa',    to:'webapp',   color:'#555555', dur:2.0, delay:0.6 },
  { from:'openclaw',to:'webapp',   color:'#009A93', dur:1.8, delay:0.3 },
  { from:'openclaw',to:'telegram', color:'#E37200', dur:1.8, delay:0.7 },
]

export const SYSTEM_LAYERS = [
  { label:'Datos de mercado', x:90  },
  { label:'Modelos ML',       x:290 },
  { label:'Backend',          x:490 },
  { label:'Agente IA',        x:690 },
  { label:'Interfaz usuario', x:890 },
]

export const SYSTEM_LEGEND = [
  { color:'#009A93', label:'Flujo de datos / predicciones' },
  { color:'#E37200', label:'Señales y alertas' },
  { color:'#6b21a8', label:'Decisiones del agente IA' },
  { color:'#555555', label:'Persistencia y almacenamiento' },
]

// Índice O(1) para lookup de nodos (js-index-maps)
export const NODE_MAP = new Map(SYSTEM_NODES.map(n => [n.id, n]))

export function getSystemNode(id: string) {
  return NODE_MAP.get(id)!
}

export function systemEdgePath(e: SystemEdge) {
  const a = getSystemNode(e.from), b = getSystemNode(e.to)
  const x1 = a.x + NODE_W / 2, y1 = a.y
  const x2 = b.x - NODE_W / 2, y2 = b.y
  const cx = (x1 + x2) / 2
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`
}

export function connectedToNode(id: string) {
  return new Set(
    SYSTEM_EDGES.filter(e => e.from === id || e.to === id).flatMap(e => [e.from, e.to])
  )
}
