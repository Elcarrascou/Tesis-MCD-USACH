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
│   └── queries.ts           # funciones de acceso a datos OPERACIONALES
├── hooks/useSupabaseQuery.ts # hook genérico loading/error/data
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
- **Vercel** proyecto `web`. Deployment Protection debe estar **OFF** (sitio público). Si un deploy reactiva 401, desactivar `ssoProtection`.

---

## Stack técnico

Vite + React 19 + TypeScript + Tailwind CSS v3 + React Router + lucide-react + @supabase/supabase-js. CI en `.github/workflows/ci.yml` (lint + build en push/PR a main).
