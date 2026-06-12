# CLAUDE.md — Proyecto de Título MCD USACH

Web del proyecto de título: **Portafolio de Inversiones Gestionado por IA** (Magíster en Ciencia de Datos, USACH). Sitio de documentación/presentación de la tesis, inspirado en el UX de **distill.pub** (diagramas claros, tipografía legible, layout académico) con la paleta del **brandbook USACH by Pomelli**.

URL producción: **https://tesis-mcd-usach.vercel.app** · Repo: `Elcarrascou/Tesis-MCD-USACH`

---

## ⚙️ WORKFLOW OBLIGATORIO EN CADA TAREA

Antes y después de cualquier cambio, seguir SIEMPRE este orden (el usuario NO revisa localhost):

1. **Revisar las skills en detalle ANTES de codear.** Para cada tarea, abrir y aplicar las reglas concretas de las skills relevantes (no solo tenerlas instaladas):
   - `frontend-design` → al crear/ajustar UI
   - `vercel-react-best-practices` → al escribir/refactorizar React (memo, Map O(1), no componentes inline, etc.)
   - `web-design-guidelines` → al tocar UI: a11y (aria-label, focus-visible, teclado), `prefers-reduced-motion`, `loading=lazy`, `tabular-nums`
   - `supabase-postgres-best-practices` → al tocar BD: PK identity, índices FK, RLS, tipos correctos
   - `github-actions-docs` → al tocar CI/workflows (validar contra docs oficiales)
   Las skills viven en `.agents/skills/`. Leer los `references/`/`rules/` específicos, no asumir de memoria.

2. **Hacer los `git pull` necesarios** al inicio para sincronizar con remoto antes de trabajar.

3. **Analizar si la nueva funcionalidad necesita base de datos** (ver criterio abajo). Si corresponde, modelarla en Supabase con las best practices y generar tipos.

4. **Verificar → desplegar** (sin que el usuario lo pida):
   ```
   npm run lint && npm run build      # debe pasar (lo mismo que corre el CI)
   git add -A && git commit && git push
   npx vercel deploy --prod --yes
   npx vercel alias set <nuevo-deploy-url> tesis-mcd-usach.vercel.app
   ```

---

## 🗄️ CRITERIO: ¿va en base de datos o estático?

| Tipo de contenido | Dónde | Ejemplos |
|---|---|---|
| **Estático / editorial** (describe la tesis, cambia solo con redeploy) | `src/data/*.ts` (tipado) | modelos ML, arquitectura, stack, presupuesto, roadmap, diagrama del sistema, láminas |
| **Operacional / dinámico** (lo produce el sistema real, cambia en el tiempo) | **Supabase** (`src/lib/queries.ts` + `useSupabaseQuery`) | portfolio, movements, ai_decisions, ml_predictions, performance |

Regla: **solo lo dinámico va a Postgres.** No meter contenido editorial en BD (añade latencia y complejidad sin beneficio). Al agregar una feature, preguntarse: *¿este dato lo genera el sistema/usuario en runtime?* → sí = Supabase; *¿es texto que describe el proyecto?* → no = `src/data/`.

---

## 🏗️ Arquitectura

```
src/
├── types/index.ts        # tipos de dominio compartidos (única fuente de tipos)
├── data/                 # CONTENIDO ESTÁTICO (única fuente de verdad)
│   ├── site.ts           # metadatos, hero, stats
│   ├── models.ts         # 4 modelos ML (usado por MLModels + MarcoTeorico)
│   ├── architecture.ts   # capas, flujo deploy, vistas app
│   ├── stack.ts          # stack tecnológico, tablas BD, presupuesto
│   ├── roadmap.ts        # fases
│   ├── system.ts         # nodos/aristas del diagrama interactivo + helpers
│   └── presentation.ts   # láminas, secciones anteproyecto
├── lib/
│   ├── supabase.ts          # cliente tipado <Database>
│   ├── database.types.ts    # tipos generados de Supabase (regenerar tras migraciones)
│   ├── queries.ts           # funciones de acceso a datos OPERACIONALES
│   └── market.ts            # cotizaciones Yahoo Finance vía edge function (getQuotes/getHistory + MARKET_INDICES)
├── hooks/useSupabaseQuery.ts # hook genérico loading/error/data
├── hooks/useLiveQuotes.ts    # polling Yahoo 60s, pausa con tab oculta, refresca al volver
├── components/
│   ├── layout/  (Nav, Footer)
│   ├── sections/ (Hero, Overview, Architecture, MLModels, MarcoTeorico, TechStack, Budget, Roadmap)
│   └── ui/ (Lightbox)
└── pages/ (ProyectoPage, SolucionPage, AnteproyectoPage, PresentacionPage)
```

**Principio:** los componentes son presentación pura; los datos viven en `src/data/` o vienen de Supabase. No hardcodear arrays de contenido dentro de componentes.

---

## 🎨 Diseño (brandbook USACH by Pomelli)

- Colores ÚNICOS permitidos: Teal `#009A93`, Saffron Orange `#E37200`, Onyx `#333333`, blanco. (Acentos derivados puntuales: `#1a7a3c`, `#6b21a8` para diferenciar modelos.)
- Tipografía: **Nunito Sans** (cargada vía `<link>` en `index.html`, NO `@import`) + JetBrains Mono para mono/labels.
- Tema **claro** (fondo blanco / teal muy suave). Header y footer en Onyx `#333333`.
- Logo USACH en `src/assets/logoUsach.webp`; favicon con el logo embebido.
- Inspiración UX: distill.pub (diagramas SVG limpios e interactivos, mucho aire, foco en legibilidad).

---

## 🔌 Servicios

- **Supabase** proyecto `PT_MCD_USACH_DCU` (id `xzedmtnouzarsslyglbe`). Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (ya en Vercel). Tras cambios DDL: correr `get_advisors` (security) y regenerar `database.types.ts`.
- **Edge Function `yahoo-finance`** (verify_jwt ON): proxy a Yahoo Finance chart API v8 (browser no puede por CORS). POST body `{ action:'quotes', symbols:[...] }` o `{ action:'history', symbol, range, interval }`. Requiere User-Agent de navegador o Yahoo devuelve 429. Cliente: `lib/market.ts` + `hooks/useLiveQuotes.ts`; el Dashboard del portal muestra precios en vivo (KPIs/tabla recalculados) y `MarketStrip` con índices ^IPSA/^GSPC/^IXIC.
- **Vercel** proyecto `web`. Deployment Protection debe estar **OFF** (sitio público). Si un deploy reactiva 401, desactivar `ssoProtection`.

---

## 🔐 Portal de Gestión (operacional, autenticado)

Sección separada del sitio marketing. Se abre en **ventana nueva** desde el header (CTA naranja "Portal IA" → `target="_blank"` a `/portal`).

- **Auth:** Supabase Auth (email+password) vía `src/context/AuthContext.tsx` (`useAuth`). Rutas protegidas con `components/portal/ProtectedRoute.tsx`.
- **Credenciales demo:** `demo@tesis-mcd.cl` / `Portafolio2026` (usuario sembrado en `auth.users`).
  - ⚠️ Al sembrar usuarios por SQL, las columnas de token (`confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new/current`, `phone_change`, `phone_change_token`, `reauthentication_token`) DEBEN ser `''` (no NULL) o GoTrue devuelve 500 "error querying schema".
- **Layout:** `components/portal/PortalLayout.tsx` (sidebar onyx + outlet). Páginas en `src/pages/portal/`.
- **Páginas:** Portafolio (`/portal`), Movimientos, Decisiones IA, Ganancias, Modelos ML — todas leen de Supabase con `useSupabaseQuery` + `lib/queries.ts`. "Ejecutar en Alpaca" = link externo.
- **RLS:** las 5 tablas operacionales son `select to authenticated` (no anon). El portal requiere login para ver datos.
- **Datos demo** sembrados en las 5 tablas para que el portal no esté vacío.
- Formateo con `src/lib/format.ts` (Intl: USD, fechas es-CL, %).

## Stack técnico

Vite + React 19 + TypeScript + Tailwind CSS v3 + React Router + lucide-react + @supabase/supabase-js. CI en `.github/workflows/ci.yml` (lint + build en push/PR a main).
