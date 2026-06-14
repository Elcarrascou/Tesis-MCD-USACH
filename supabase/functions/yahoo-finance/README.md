# Edge Function · `yahoo-finance`

Proxy autenticado a Yahoo Finance (chart API v8) para el portal. El browser no
puede llamar a Yahoo directo (CORS); esta función actúa de intermediario.
`verify_jwt: true` (requiere sesión Supabase del portal).

## Acciones (POST JSON)

| `action`  | Body                                            | Devuelve |
|-----------|-------------------------------------------------|----------|
| `quotes`  | `{ symbols: ['AAPL','^IPSA', ...] }` (máx 25)    | cotizaciones en vivo |
| `history` | `{ symbol, range='3mo', interval='1d' }`         | serie de cierres |
| `predict` | `{ symbol }`                                     | features técnicos + XGBoost (señal) + Random Forest (riesgo) + serie 6m |

`predict` es una **aproximación determinista** de los modelos de la tesis para
demo online (boosting de stumps / votación de árboles). Los modelos reales
(LSTM/XGBoost/Prophet/RF en PyTorch/Prophet) corren en el backend Python/FastAPI.

## Deploy

Esta función ya vive desplegada en el proyecto Supabase `PT_MCD_USACH_DCU`
(id `xzedmtnouzarsslyglbe`). Este archivo es la copia versionada en el repo.
Para re-desplegar con el CLI de Supabase:

```bash
supabase functions deploy yahoo-finance --project-ref xzedmtnouzarsslyglbe
```

> El runtime es **Deno**, no Node; por eso `supabase/functions` está excluido
> del eslint/tsc de la app web (ver `eslint.config.js`).
