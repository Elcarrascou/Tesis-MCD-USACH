import { useMemo } from 'react'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { getMlPredictions, getAiDecisions } from '../../lib/queries'
import { fmtPct } from '../../lib/format'
import { PageHeader, Card, QueryState } from '../../components/portal/ui'
import { DonutChart, BarChartHorizontal } from '../../components/portal/charts'

const MODEL_LABELS: Record<string, { label: string; color: string }> = {
  lstm:          { label: 'LSTM',          color: '#009A93' },
  xgboost:       { label: 'XGBoost',       color: '#E37200' },
  prophet:       { label: 'Prophet',       color: '#1a7a3c' },
  random_forest: { label: 'Random Forest', color: '#6b21a8' },
}

const ACTION_COLORS: Record<string, string> = {
  buy: '#1a7a3c', sell: '#c0392b', hold: '#E37200', rebalance: '#6b21a8',
}

export default function PortalAnalytics() {
  const predictions = useSupabaseQuery(() => getMlPredictions({ limit: 500 }), [])
  const decisions   = useSupabaseQuery(() => getAiDecisions(500), [])

  // 1. Predicciones por modelo (donut)
  const byModel = useMemo(() => {
    if (!predictions.data) return []
    const counts: Record<string, number> = {}
    for (const p of predictions.data) counts[p.model] = (counts[p.model] ?? 0) + 1
    return Object.entries(counts).map(([k, v]) => ({
      label: MODEL_LABELS[k]?.label ?? k,
      value: v,
      color: MODEL_LABELS[k]?.color,
    }))
  }, [predictions.data])

  // 2. Confianza promedio por modelo (barras)
  const avgConfidence = useMemo(() => {
    if (!predictions.data) return []
    const acc: Record<string, { sum: number; n: number }> = {}
    for (const p of predictions.data) {
      if (p.confidence == null) continue
      acc[p.model] ??= { sum: 0, n: 0 }
      acc[p.model].sum += p.confidence
      acc[p.model].n += 1
    }
    return Object.entries(acc).map(([k, { sum, n }]) => ({
      label: MODEL_LABELS[k]?.label ?? k,
      value: n > 0 ? sum / n : 0,
      color: MODEL_LABELS[k]?.color,
    })).sort((a, b) => b.value - a.value)
  }, [predictions.data])

  // 3. Distribución de señales (todas las predictions con signal no null)
  const signalDist = useMemo(() => {
    if (!predictions.data) return []
    const counts: Record<string, number> = {}
    for (const p of predictions.data) {
      if (!p.signal) continue
      counts[p.signal] = (counts[p.signal] ?? 0) + 1
    }
    return Object.entries(counts).map(([k, v]) => ({ label: k, value: v }))
  }, [predictions.data])

  // 4. Decisiones IA por acción (donut)
  const decisionsByAction = useMemo(() => {
    if (!decisions.data) return []
    const counts: Record<string, number> = {}
    for (const d of decisions.data) counts[d.action] = (counts[d.action] ?? 0) + 1
    return Object.entries(counts).map(([k, v]) => ({
      label: k.charAt(0).toUpperCase() + k.slice(1),
      value: v,
      color: ACTION_COLORS[k],
    }))
  }, [decisions.data])

  // 5. Confianza promedio por motor LLM
  const confByEngine = useMemo(() => {
    if (!decisions.data) return []
    const acc: Record<string, { sum: number; n: number }> = {}
    for (const d of decisions.data) {
      if (!d.engine || d.confidence == null) continue
      acc[d.engine] ??= { sum: 0, n: 0 }
      acc[d.engine].sum += d.confidence
      acc[d.engine].n += 1
    }
    return Object.entries(acc).map(([k, { sum, n }]) => ({
      label: k,
      value: n > 0 ? sum / n : 0,
    })).sort((a, b) => b.value - a.value)
  }, [decisions.data])

  const totalPredictions = predictions.data?.length ?? 0
  const totalDecisions   = decisions.data?.length ?? 0

  return (
    <>
      <PageHeader tag="Portal · Analytics" title="Análisis cruzado del sistema"
        subtitle="Métricas agregadas sobre la actividad de los modelos ML y el agente IA, útiles para evaluar el comportamiento del sistema." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Predicciones por modelo */}
        <Card className="p-6">
          <h2 className="font-bold text-[16px] mb-4" style={{ color:'#333333' }}>Predicciones por modelo ML</h2>
          <QueryState skeleton="block" loading={predictions.loading} error={predictions.error} empty={byModel.length === 0} emptyLabel="Sin predicciones registradas.">
            <DonutChart
              data={byModel}
              centerValue={String(totalPredictions)}
              centerLabel="Total"
              title="Distribución de predicciones por modelo ML"
            />
          </QueryState>
        </Card>

        {/* Decisiones por acción */}
        <Card className="p-6">
          <h2 className="font-bold text-[16px] mb-4" style={{ color:'#333333' }}>Decisiones del agente IA por acción</h2>
          <QueryState skeleton="block" loading={decisions.loading} error={decisions.error} empty={decisionsByAction.length === 0} emptyLabel="Sin decisiones registradas.">
            <DonutChart
              data={decisionsByAction}
              centerValue={String(totalDecisions)}
              centerLabel="Total"
              title="Distribución de decisiones por tipo"
            />
          </QueryState>
        </Card>

        {/* Confianza promedio por modelo */}
        <Card className="p-6">
          <h2 className="font-bold text-[16px] mb-1" style={{ color:'#333333' }}>Confianza promedio por modelo</h2>
          <p className="text-[12px] mb-4" style={{ color:'#4f4f4f' }}>
            Promedio del campo confidence en todas las predicciones del modelo.
          </p>
          <QueryState skeleton="block" loading={predictions.loading} error={predictions.error} empty={avgConfidence.length === 0} emptyLabel="Sin datos de confianza.">
            <BarChartHorizontal
              items={avgConfidence}
              maxValue={100}
              valueFormatter={(v) => fmtPct(v)}
              title="Confianza promedio por modelo ML"
            />
          </QueryState>
        </Card>

        {/* Distribución de señales */}
        <Card className="p-6">
          <h2 className="font-bold text-[16px] mb-1" style={{ color:'#333333' }}>Distribución de señales emitidas</h2>
          <p className="text-[12px] mb-4" style={{ color:'#4f4f4f' }}>
            Cuenta de cada señal categórica (compra, venta, tendencias, riesgo) producida por los modelos.
          </p>
          <QueryState skeleton="block" loading={predictions.loading} error={predictions.error} empty={signalDist.length === 0} emptyLabel="Sin señales categóricas.">
            <BarChartHorizontal
              items={signalDist}
              valueFormatter={(v) => v.toFixed(0)}
              title="Frecuencia de señales emitidas"
            />
          </QueryState>
        </Card>

        {/* Confianza por engine LLM */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-bold text-[16px] mb-1" style={{ color:'#333333' }}>Confianza promedio del agente por motor LLM</h2>
          <p className="text-[12px] mb-4" style={{ color:'#4f4f4f' }}>
            Promedio de confianza en las decisiones según el motor LLM utilizado por OpenClaw (Claude, GPT, Ollama).
            Útil para evaluar la estrategia de routing y costo-calidad.
          </p>
          <QueryState skeleton="block" loading={decisions.loading} error={decisions.error} empty={confByEngine.length === 0} emptyLabel="Sin métricas por motor.">
            <BarChartHorizontal
              items={confByEngine}
              maxValue={100}
              valueFormatter={(v) => fmtPct(v)}
              title="Confianza promedio por motor LLM"
            />
          </QueryState>
        </Card>
      </div>
    </>
  )
}
