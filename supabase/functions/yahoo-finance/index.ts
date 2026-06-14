import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ════════════════════════════════════════════════════════════
// Proxy a Yahoo Finance (API chart v8, sin auth) para el portal.
// El browser no puede llamar a Yahoo directo (CORS), así que esta
// función actúa de intermediario autenticado (verify_jwt: true).
//
// POST body:
//   { action: 'quotes',  symbols: ['AAPL','MSFT','^IPSA'] }
//   { action: 'history', symbol: 'AAPL', range: '3mo', interval: '1d' }
//   { action: 'predict', symbol: 'AAPL' }
//     → inferencia en vivo: features técnicos sobre 6 meses de
//       históricos + XGBoost (señal compra/venta, boosting aditivo
//       de stumps) + Random Forest (riesgo, votación de árboles).
//       Aproximación determinista de los modelos de la tesis para
//       demo online; los modelos reales corren en Python/FastAPI.
// ════════════════════════════════════════════════════════════

const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const JSON_HEADERS = { ...CORS_HEADERS, 'Content-Type': 'application/json' };

// User-Agent de navegador: Yahoo rechaza requests sin él (429/403)
const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Accept: 'application/json',
};

interface YahooMeta {
  symbol: string;
  longName?: string;
  shortName?: string;
  currency?: string;
  exchangeName?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketTime?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
}

async function fetchChart(symbol: string, range = '1d', interval = '1d') {
  const url = `${YAHOO_BASE}${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`Yahoo respondió ${res.status} para ${symbol}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) {
    throw new Error(json?.chart?.error?.description ?? `Sin datos para ${symbol}`);
  }
  return result;
}

function metaToQuote(meta: YahooMeta) {
  const price = meta.regularMarketPrice ?? null;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? null;
  const change = price !== null && prevClose !== null ? price - prevClose : null;
  const changePct = change !== null && prevClose ? (change / prevClose) * 100 : null;
  return {
    symbol: meta.symbol,
    name: meta.longName ?? meta.shortName ?? meta.symbol,
    price,
    previousClose: prevClose,
    change,
    changePct,
    currency: meta.currency ?? 'USD',
    exchange: meta.exchangeName ?? null,
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow: meta.regularMarketDayLow ?? null,
    volume: meta.regularMarketVolume ?? null,
    marketTime: meta.regularMarketTime ?? null,
  };
}

// ────────────────────────────────────────────────────
// Features técnicos (insumos de los dos modelos)
// ────────────────────────────────────────────────────

function sma(values: number[], window: number): number {
  const slice = values.slice(-window);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function rsi14(closes: number[]): number {
  const period = 14;
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function computeFeatures(closes: number[]) {
  const last = closes[closes.length - 1];
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) returns.push(closes[i] / closes[i - 1] - 1);

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const volAnnualPct = Math.sqrt(variance) * Math.sqrt(252) * 100;

  // Volatilidad reciente (20d) vs total: régimen de volatilidad
  const recent = returns.slice(-20);
  const rMean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const rVar = recent.reduce((a, b) => a + (b - rMean) ** 2, 0) / recent.length;
  const volRecentPct = Math.sqrt(rVar) * Math.sqrt(252) * 100;

  let peak = closes[0], maxDrawdownPct = 0;
  for (const c of closes) {
    if (c > peak) peak = c;
    const dd = (peak - c) / peak * 100;
    if (dd > maxDrawdownPct) maxDrawdownPct = dd;
  }

  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, Math.min(50, closes.length));
  const momentum20Pct = closes.length > 21 ? (last / closes[closes.length - 22] - 1) * 100 : 0;

  return {
    price: last,
    sma20: Number(sma20.toFixed(2)),
    sma50: Number(sma50.toFixed(2)),
    rsi14: Number(rsi14(closes).toFixed(1)),
    volAnnualPct: Number(volAnnualPct.toFixed(1)),
    volRecentPct: Number(volRecentPct.toFixed(1)),
    momentum20Pct: Number(momentum20Pct.toFixed(1)),
    maxDrawdownPct: Number(maxDrawdownPct.toFixed(1)),
    days: closes.length,
  };
}

type Features = ReturnType<typeof computeFeatures>;

// XGBoost (aprox.): boosting aditivo de decision stumps → sigmoide → señal
function xgboostSignal(f: Features) {
  const stumps = [
    { name: 'RSI sobreventa/sobrecompra', value: f.rsi14 < 30 ? 1.2 : f.rsi14 > 70 ? -1.2 : 0 },
    { name: 'Cruce SMA20/SMA50',          value: f.sma20 > f.sma50 ? 0.8 : -0.8 },
    { name: 'Momentum 20d',               value: f.momentum20Pct > 5 ? 0.7 : f.momentum20Pct < -5 ? -0.7 : 0 },
    { name: 'Precio vs SMA20',            value: f.price > f.sma20 ? 0.5 : -0.5 },
    { name: 'Penalidad volatilidad',      value: f.volAnnualPct > 60 ? -0.4 : 0 },
  ];
  const score = stumps.reduce((a, s) => a + s.value, 0);
  const prob = 1 / (1 + Math.exp(-score)); // sigmoide
  const signal = prob > 0.62 ? 'buy' : prob < 0.38 ? 'sell' : 'hold';
  const confidence = Number((55 + Math.abs(prob - 0.5) * 80).toFixed(1)); // 55–95
  return { signal, confidence, score: Number(score.toFixed(2)), prob: Number(prob.toFixed(3)), stumps };
}

// Random Forest (aprox.): 5 árboles de reglas votan clase de riesgo
function randomForestRisk(f: Features) {
  const trees: { name: string; vote: 'bajo' | 'medio' | 'alto' }[] = [
    { name: 'Volatilidad anualizada', vote: f.volAnnualPct > 45 ? 'alto' : f.volAnnualPct > 25 ? 'medio' : 'bajo' },
    { name: 'Máximo drawdown 6m',     vote: f.maxDrawdownPct > 25 ? 'alto' : f.maxDrawdownPct > 12 ? 'medio' : 'bajo' },
    { name: 'Régimen de volatilidad', vote: f.volRecentPct > f.volAnnualPct * 1.3 ? 'alto' : f.volRecentPct > f.volAnnualPct ? 'medio' : 'bajo' },
    { name: 'Momentum negativo',      vote: f.momentum20Pct < -10 ? 'alto' : f.momentum20Pct < 0 ? 'medio' : 'bajo' },
    { name: 'RSI en extremos',        vote: f.rsi14 > 75 || f.rsi14 < 25 ? 'medio' : 'bajo' },
  ];
  const counts = { bajo: 0, medio: 0, alto: 0 };
  for (const t of trees) counts[t.vote]++;
  const risk = (Object.entries(counts) as ['bajo' | 'medio' | 'alto', number][])
    .sort((a, b) => b[1] - a[1])[0][0];
  const confidence = Number((counts[risk] / trees.length * 100).toFixed(0));
  return { risk, confidence, votes: counts, trees };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers: JSON_HEADERS });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body?.action ?? 'quotes';

    if (action === 'history') {
      const symbol = String(body?.symbol ?? '').trim();
      if (!symbol) {
        return new Response(JSON.stringify({ error: 'Falta symbol' }), { status: 400, headers: JSON_HEADERS });
      }
      const range = String(body?.range ?? '3mo');
      const interval = String(body?.interval ?? '1d');
      const result = await fetchChart(symbol, range, interval);
      const timestamps: number[] = result.timestamp ?? [];
      const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];
      const points = timestamps
        .map((t, i) => ({ time: t, close: closes[i] ?? null }))
        .filter((p) => p.close !== null);
      return new Response(
        JSON.stringify({ symbol: result.meta?.symbol ?? symbol, currency: result.meta?.currency ?? 'USD', range, interval, points }),
        { headers: JSON_HEADERS },
      );
    }

    if (action === 'predict') {
      const symbol = String(body?.symbol ?? '').trim().toUpperCase();
      if (!symbol || !/^[A-Z0-9^.\-=]{1,12}$/.test(symbol)) {
        return new Response(JSON.stringify({ error: 'Símbolo inválido' }), { status: 400, headers: JSON_HEADERS });
      }
      const result = await fetchChart(symbol, '6mo', '1d');
      const rawCloses: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];
      const timestamps: number[] = result.timestamp ?? [];
      const series = timestamps
        .map((t, i) => ({ time: t, close: rawCloses[i] }))
        .filter((p): p is { time: number; close: number } => p.close != null);
      if (series.length < 30) {
        return new Response(JSON.stringify({ error: `Históricos insuficientes para ${symbol} (${series.length} días)` }), {
          status: 422, headers: JSON_HEADERS,
        });
      }
      const closes = series.map((p) => p.close);
      const features = computeFeatures(closes);
      return new Response(
        JSON.stringify({
          quote: metaToQuote(result.meta),
          features,
          xgboost: xgboostSignal(features),
          randomForest: randomForestRisk(features),
          series, // cierres 6m para sparkline
          generatedAt: Date.now(),
        }),
        { headers: JSON_HEADERS },
      );
    }

    // action === 'quotes'
    const symbols: string[] = Array.isArray(body?.symbols)
      ? body.symbols.map((s: unknown) => String(s).trim()).filter(Boolean).slice(0, 25)
      : [];
    if (symbols.length === 0) {
      return new Response(JSON.stringify({ error: 'Falta symbols (array)' }), { status: 400, headers: JSON_HEADERS });
    }

    const settled = await Promise.allSettled(symbols.map((s) => fetchChart(s, '1d', '1d')));
    const quotes = [];
    const errors: Record<string, string> = {};
    settled.forEach((r, i) => {
      if (r.status === 'fulfilled') quotes.push(metaToQuote(r.value.meta));
      else errors[symbols[i]] = r.reason?.message ?? 'error';
    });

    return new Response(
      JSON.stringify({ quotes, errors: Object.keys(errors).length ? errors : undefined, fetchedAt: Date.now() }),
      { headers: JSON_HEADERS },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Error interno' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
});
