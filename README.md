# Portafolio de Inversiones Gestionado por IA

**Proyecto de Título — Magíster en Ciencia de Datos · Universidad de Santiago de Chile · 2026**
**Autor:** Daniel Carrasco U.

[![Production](https://img.shields.io/badge/Production-tesis--mcd--usach.vercel.app-009A93?style=flat-square)](https://tesis-mcd-usach.vercel.app)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20·%20TypeScript%20·%20Vite%20·%20Supabase-E37200?style=flat-square)](#stack-técnico)
[![License](https://img.shields.io/badge/License-MIT-333333?style=flat-square)](#)

> Sistema web que integra un agente de inteligencia artificial con modelos de machine learning para analizar, predecir y apoyar la toma de decisiones en un portafolio de acciones bursátiles en tiempo real, con foco en el índice chileno **IPSA** y su relación con el **Dow Jones**.

🌐 **Sitio en producción:** https://tesis-mcd-usach.vercel.app
🔐 **Portal demo:** https://tesis-mcd-usach.vercel.app/portal · `demo@tesis-mcd.cl` / `Portafolio2026`

---

## Tabla de contenidos

1. [Sobre el proyecto](#sobre-el-proyecto)
2. [Arquitectura del sistema](#arquitectura-del-sistema)
3. [Estructura del repositorio](#estructura-del-repositorio)
4. [Capa de datos: criterio editorial vs operacional](#capa-de-datos-criterio-editorial-vs-operacional)
5. [Base de datos (Supabase)](#base-de-datos-supabase)
6. [Páginas del sitio](#páginas-del-sitio)
7. [Portal operacional](#portal-operacional)
8. [Diseño y tipografía](#diseño-y-tipografía)
9. [Stack técnico](#stack-técnico)
10. [Setup local](#setup-local)
11. [Despliegue](#despliegue)
12. [CI/CD](#cicd)
13. [Calidad: skills y guidelines aplicadas](#calidad-skills-y-guidelines-aplicadas)
14. [Roadmap](#roadmap)

---

## Sobre el proyecto

Este repositorio aloja el **sitio web del proyecto de título** y el **portal operacional** que dará vida al sistema completo en producción.

El sistema final integra dos ámbitos académicos:

- **Machine Learning (clásico):** cuatro modelos predictivos sobre activos bursátiles del IPSA con el Dow Jones como variable exógena —
  - **LSTM** → precio futuro
  - **XGBoost** → señal compra/venta
  - **Prophet** → tendencia y estacionalidad
  - **Random Forest** → nivel de riesgo
- **Inteligencia Artificial Agéntica:** el agente **OpenClaw** consolida las 4 predicciones, razona sobre el contexto de mercado con motores LLM híbridos (Claude / GPT / Ollama) y genera recomendaciones explicables en lenguaje natural.

El usuario mantiene el control: las recomendaciones se ejecutan manualmente vía Alpaca (paper trading durante la fase académica).

---

## Arquitectura del sistema

```
┌──────────────┐    ┌───────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   DATOS DE   │    │  MODELOS ML   │    │   BACKEND    │    │  AGENTE IA   │    │  INTERFAZ    │
│   MERCADO    │    │  PREDICTIVOS  │    │     +        │    │  (OpenClaw)  │    │   USUARIO    │
│              │───▶│               │───▶│ PERSISTENCIA │───▶│              │───▶│              │
│ • Yahoo Fin. │    │ • LSTM        │    │ • FastAPI    │    │ • Skills     │    │ • React Web  │
│ • Alpaca API │    │ • XGBoost     │    │ • Supabase   │    │ • Memoria    │    │ • Telegram   │
│              │    │ • Prophet     │    │ (PostgreSQL) │    │ • Claude/GPT │    │              │
│              │    │ • Random For. │    │              │    │ • Ollama     │    │              │
└──────────────┘    └───────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

El **diagrama interactivo completo** vive en `/solucion` — cada caja despliega definición técnica, aplicación en este proyecto, inputs/outputs financieros, métricas de decisión y rationale de elección.

---

## Estructura del repositorio

```
web/
├── public/                     # Assets estáticos servidos en raíz (favicon)
├── src/
│   ├── App.tsx                 # Routing principal (BrowserRouter + AuthProvider)
│   ├── main.tsx                # Entry point
│   ├── index.css               # Tailwind base + tokens globales (.wrap, .section-tag, .card-shadow)
│   │
│   ├── types/index.ts          # Tipos de dominio compartidos (única fuente de tipos)
│   │
│   ├── data/                   # CONTENIDO ESTÁTICO EDITORIAL — única fuente de verdad
│   │   ├── site.ts             # Metadatos, hero, stats, PORTAL_PROMO
│   │   ├── models.ts           # 4 modelos ML (consumido por MLModels y MarcoTeorico)
│   │   ├── architecture.ts     # Capas, flujo deploy, vistas app
│   │   ├── stack.ts            # Stack tecnológico, tablas BD, presupuesto
│   │   ├── roadmap.ts          # Fases del proyecto
│   │   ├── system.ts           # Nodos/aristas del diagrama interactivo + detail técnico
│   │   └── presentation.ts     # Láminas y secciones del anteproyecto
│   │
│   ├── lib/                    # Capa de servicios
│   │   ├── supabase.ts         # Cliente tipado <Database>
│   │   ├── database.types.ts   # Tipos auto-generados desde Supabase
│   │   ├── queries.ts          # Funciones de acceso a datos OPERACIONALES
│   │   └── format.ts           # Formateadores i18n (USD, %, fechas es-CL)
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Sesión Supabase Auth + signIn/signOut
│   │
│   ├── hooks/
│   │   └── useSupabaseQuery.ts # Hook genérico loading/error/data (SWR-like)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.tsx, Footer.tsx
│   │   │   └── MarketingLayout.tsx     # Layout del sitio público
│   │   ├── sections/                   # 9 secciones de la home
│   │   │   ├── Hero, Overview, PortalPromo, Architecture
│   │   │   ├── MLModels, MarcoTeorico
│   │   │   └── TechStack, Budget, Roadmap
│   │   ├── ui/Lightbox.tsx             # Modal de imagen accesible
│   │   └── portal/
│   │       ├── PortalLayout.tsx        # Layout del portal (sidebar onyx)
│   │       ├── ProtectedRoute.tsx      # Guard de auth
│   │       ├── ui.tsx                  # PageHeader, Card, QueryState, Badge
│   │       ├── charts.tsx              # DonutChart, LineChartCompare, BarChartHorizontal
│   │       └── chartConfig.ts          # CHART_PALETTE
│   │
│   ├── pages/                          # Páginas del sitio
│   │   ├── ProyectoPage.tsx            # Home — ensambla las 9 secciones
│   │   ├── SolucionPage.tsx            # /solucion — diagrama interactivo
│   │   ├── AnteproyectoPage.tsx        # /anteproyecto
│   │   ├── PresentacionPage.tsx        # /presentacion
│   │   └── portal/                     # Páginas del portal autenticado
│   │       ├── LoginPage, PortalDashboard
│   │       ├── PortalMovimientos, PortalDecisiones
│   │       ├── PortalGanancias, PortalModelos
│   │       └── PortalAnalytics
│   │
│   └── assets/                         # Imágenes de diagramas + logo USACH
│
├── .github/workflows/ci.yml            # CI: lint + build en push/PR a main
├── CLAUDE.md                           # Contexto + workflow para asistentes IA
├── README.md                           # (este archivo)
├── package.json, tsconfig.*.json       # Configuración TS
├── tailwind.config.js, postcss.config.js
├── vite.config.ts
└── eslint.config.js
```

---

## Capa de datos: criterio editorial vs operacional

Decisión arquitectónica explícita del proyecto:

| Tipo de contenido | Dónde vive | Ejemplos |
|---|---|---|
| **Estático / editorial** (describe la tesis, cambia solo con redeploy) | `src/data/*.ts` (tipado) | modelos ML, arquitectura, stack, presupuesto, roadmap, diagrama del sistema, copy del hero, promo del portal, láminas |
| **Operacional / dinámico** (lo produce el sistema real, cambia en el tiempo) | **Supabase** (`src/lib/queries.ts` + `useSupabaseQuery`) | portfolio, movements, ai_decisions, ml_predictions, performance |

**Regla:** solo datos dinámicos van a Postgres. El contenido editorial vive versionado en `src/data/` para máxima velocidad y trazabilidad por commit.

---

## Base de datos (Supabase)

Proyecto Supabase: `PT_MCD_USACH_DCU` · PostgreSQL 15+ con Row-Level Security.

### Tablas

```sql
-- Posiciones actuales del portafolio
portfolio (
  id bigint identity PK,
  symbol text UNIQUE,
  quantity numeric(18,6),
  avg_price numeric(18,4),
  current_price numeric(18,4),
  market_value numeric(18,2),
  unrealized_pnl numeric(18,2),
  weight_pct numeric(6,3),
  updated_at timestamptz
)

-- Historial de transacciones (sincronizadas desde Alpaca)
movements (
  id bigint identity PK,
  symbol text,
  side text CHECK (side IN ('buy','sell')),
  quantity numeric(18,6),
  price numeric(18,4),
  amount numeric(18,2),
  alpaca_order_id text,
  executed_at timestamptz
)
-- índices: movements_symbol_idx, movements_executed_at_idx

-- Decisiones del agente OpenClaw
ai_decisions (
  id bigint identity PK,
  symbol text,
  action text CHECK (action IN ('buy','sell','hold','rebalance')),
  confidence numeric(5,2),
  rationale text,
  engine text,
  created_at timestamptz
)
-- índices: ai_decisions_created_at_idx, ai_decisions_symbol_idx

-- Predicciones de los 4 modelos ML
ml_predictions (
  id bigint identity PK,
  symbol text,
  model text CHECK (model IN ('lstm','xgboost','prophet','random_forest')),
  prediction_type text,
  predicted_value numeric(18,4),
  signal text,
  confidence numeric(5,2),
  horizon_days int,
  predicted_at timestamptz
)
-- índices: ml_predictions_symbol_model_idx, ml_predictions_predicted_at_idx

-- Snapshots diarios de rendimiento (gráficos)
performance (
  id bigint identity PK,
  snapshot_date date UNIQUE,
  total_value numeric(18,2),
  daily_return_pct numeric(8,4),
  cumulative_return_pct numeric(8,4),
  benchmark_return_pct numeric(8,4),
  created_at timestamptz
)
-- índice: performance_snapshot_date_idx
```

### RLS

Las 5 tablas tienen `enable row level security`. Solo usuarios `authenticated` pueden leer (`SELECT to authenticated using (true)`). El backend FastAPI escribirá con `service_role` (bypass RLS). El portal `/portal` requiere login para mostrar datos.

### Tipos TypeScript

`src/lib/database.types.ts` se regenera tras cada migración:

```bash
# Vía MCP:
# generate_typescript_types({ project_id: 'xzedmtnouzarsslyglbe' })
```

---

## Páginas del sitio

| Ruta | Componente | Contenido |
|------|------------|-----------|
| `/` | `ProyectoPage` | Home: 9 secciones (Hero, Overview, PortalPromo, Architecture, MLModels, MarcoTeorico, TechStack, Budget, Roadmap) |
| `/solucion` | `SolucionPage` | Diagrama SVG interactivo: 12 nodos + 15 conexiones animadas. Click → panel de detalle técnico con 6 secciones (definición / aplicación / inputs / outputs / métricas / rationale) |
| `/anteproyecto` | `AnteproyectoPage` | Placeholder para el PDF del anteproyecto |
| `/presentacion` | `PresentacionPage` | Placeholder para las láminas |
| `/portal/login` | `LoginPage` | Autenticación Supabase email+password |
| `/portal` | `PortalDashboard` | KPIs + donut distribución + top movers + tabla posiciones |
| `/portal/movimientos` | `PortalMovimientos` | Historial de transacciones |
| `/portal/decisiones` | `PortalDecisiones` | Feed de decisiones IA con rationale + confianza |
| `/portal/ganancias` | `PortalGanancias` | KPIs + LineChartCompare Portafolio vs IPSA (base 100) + detalle diario |
| `/portal/modelos` | `PortalModelos` | Cards con predicciones recientes por modelo |
| `/portal/analytics` | `PortalAnalytics` | 5 gráficos cruzados: predicciones por modelo, decisiones por acción, confianza por modelo ML, distribución de señales, confianza por motor LLM |

---

## Portal operacional

Sección autenticada separada del sitio público. Acceso desde el header del sitio (CTA naranja **"Portal IA"**) que abre `/portal` en **ventana nueva**.

- **Auth:** Supabase Auth real (email+password). Sin OAuth, sin terceros.
- **Sesión:** JWT en localStorage, refresh automático del SDK de Supabase.
- **Rutas:** todas las páginas internas envueltas en `<ProtectedRoute>` → redirige a `/portal/login` si no hay sesión.
- **Layout:** sidebar onyx fijo (desktop) / drawer (mobile).
- **Datos:** cada página usa `useSupabaseQuery(queryFn, deps)` para resolver loading/error/data de forma consistente.
- **Acceso demo:** `demo@tesis-mcd.cl` / `Portafolio2026` (usuario sembrado, datos demo realistas: NVDA, MSFT, AAPL, TSLA, GOOGL, SQM + 30 días de performance).

---

## Diseño y tipografía

Inspirado en el UX de **[distill.pub](https://distill.pub)** (diagramas claros, tipografía legible, layout académico) con la paleta del **brandbook USACH by Pomelli**.

| Token | Valor | Uso |
|-------|-------|-----|
| Teal | `#009A93` | Color primario, acentos, CTA secundario, líneas de portafolio |
| Saffron Orange | `#E37200` | CTAs principales, benchmark, advertencias suaves |
| Onyx | `#333333` | Texto principal, sidebar, navbar |
| Gris medio | `#4f4f4f` | Texto secundario, descripciones |
| Acentos derivados | `#1a7a3c`, `#6b21a8`, `#c0392b` | Diferenciación de modelos ML, semáforo de señales |

**Tipografía:**
- **[Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans)** — display + body (cargada vía `<link>` en `index.html`, no `@import`)
- **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** — labels, métricas, datos tabulares

**Logo USACH** en `src/assets/logoUsach.webp`; favicon (SVG inline) construido con el escudo embebido como base64.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | **React 19** + **TypeScript** |
| Build | **Vite 8** (`vite build` → `dist/`) |
| Estilos | **Tailwind CSS 3** + estilos inline para tokens del brandbook |
| Routing | **React Router DOM 6** (BrowserRouter + Layout Routes) |
| Backend (BaaS) | **Supabase** (PostgreSQL + Auth + RLS) |
| Iconos | **lucide-react** |
| Lint | **ESLint** con reglas `react-hooks`, `react-refresh`, `static-components` |
| CI | **GitHub Actions** (lint + build en push/PR) |
| Deploy | **Vercel** (alias estable: `tesis-mcd-usach.vercel.app`) |

Backend Python + ML viven fuera de este repo (proyecto FastAPI/Railway + OpenClaw/Hostinger).

---

## Setup local

```bash
# 1. Clonar e instalar
git clone https://github.com/Elcarrascou/Tesis-MCD-USACH.git
cd Tesis-MCD-USACH
npm install

# 2. Variables de entorno (.env en la raíz del repo)
VITE_SUPABASE_URL=https://xzedmtnouzarsslyglbe.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>

# 3. Dev server
npm run dev          # http://localhost:5173

# 4. Validación local (mismo que corre el CI)
npm run lint
npm run build        # output → dist/
```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Vite dev server con HMR |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run lint` | ESLint sobre todo el proyecto |
| `npm run preview` | Servir el bundle de `dist/` localmente |

---

## Despliegue

Producción servida desde **Vercel** con alias estable `tesis-mcd-usach.vercel.app`.

```bash
# Deploy manual a producción
npx vercel deploy --prod --yes

# Re-apuntar el alias estable al último deploy
npx vercel alias set <new-deploy-url> tesis-mcd-usach.vercel.app
```

Cada push a `main` también dispara un deploy automático vía la integración Git de Vercel.

**Variables de entorno requeridas en Vercel:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Deployment Protection (Vercel Authentication):** debe permanecer **OFF** para que el sitio sea públicamente accesible.

---

## CI/CD

`.github/workflows/ci.yml` corre en cada push y PR a `main`:

```yaml
- actions/checkout@v6
- actions/setup-node@v4 (Node 20, cache: npm)
- npm ci
- npm run lint
- npm run build
```

Una build/lint roja bloquea el merge en GitHub.

---

## Calidad: skills y guidelines aplicadas

El desarrollo siguió un conjunto de skills/guidelines explícitas:

### `vercel-react-best-practices` ([Vercel Engineering](https://vercel.com))
- Componentes hoisteados a nivel de módulo (`rerender-no-inline-components`, `react-hooks/static-components`)
- `useMemo` con dependencias estables (referencias constantes para arrays vacíos)
- Map O(1) en lookups de nodos del diagrama (`js-index-maps`)
- Sin `setState` síncrono dentro de `useEffect` (patrón SWR-like en `useSupabaseQuery`)

### `web-design-guidelines` ([Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines))
- `aria-label` y `role="img"` en cada gráfico SVG
- Botones-pseudo accesibles vía `role="button"` + `tabIndex` + `onKeyDown` (Enter/Space)
- `focus-visible:outline` en todos los interactivos
- `prefers-reduced-motion` honrado globalmente en `index.css`
- `loading="lazy"` en imágenes below-the-fold
- `tabular-nums` en columnas numéricas y montos
- `Intl.NumberFormat` / `Intl.DateTimeFormat` para formateo i18n (es-CL)

### `supabase-postgres-best-practices`
- Primary keys con `bigint generated always as identity`
- Índices sobre columnas de filtro y orden frecuente
- Row-Level Security activa en TODAS las tablas operacionales
- Tipos de columnas correctos (`numeric` para dinero, `timestamptz` para tiempo)
- Identifiers en minúscula, sin quoting

### `frontend-design`
- Aesthetic intencional alineada al brandbook USACH (paleta restringida)
- Tipografía distintiva (Nunito Sans + JetBrains Mono)
- SVG puros sin librerías de chart externas
- Animaciones discretas (entrada de diagrama, indicador "en vivo", spinners)

### `github-actions-docs`
- Workflow CI validado contra docs oficiales (versiones exactas de `actions/checkout@v6` y `actions/setup-node@v4`)

---

## Roadmap

| Fase | Estado | Descripción |
|------|--------|-------------|
| **1.** Setup & Configuración | En progreso | Repositorio, Supabase, RLS, esquema BD, sitio público |
| **2.** Modelos ML | Próximo | Extracción Yahoo Finance, entrenamiento + validación de los 4 modelos, endpoints FastAPI |
| **3.** Integración Agente IA | Próximo | OpenClaw en Hostinger, skills personalizadas, Telegram, conexión con ML |
| **4.** Desarrollo Frontend | En progreso | Sitio público y portal operacional (consumiendo Supabase) |
| **5.** Testing & Optimización | Próximo | Backtesting walk-forward, ajuste de hiperparámetros, evaluación del agente |
| **6.** Documentación & Presentación | Próximo | Informe final, láminas para el comité MCD |

---

## Licencia

MIT — Daniel Carrasco U., 2026.

## Créditos

- **Universidad de Santiago de Chile** — Magíster en Ciencia de Datos
- **Inspiración UX:** [distill.pub](https://distill.pub)
- **Brandbook:** USACH by Pomelli
- **Desarrollo asistido por IA** con [Claude Code](https://claude.com/claude-code) y [Anthropic Skills](https://github.com/anthropics/skills)
