// ════════════════════════════════════════════════════════════
// Formateadores i18n (web-design-guidelines: usar Intl.*)
// ════════════════════════════════════════════════════════════

const usd = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD' })
const num = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 })
const dateFmt = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' })
const dateTimeFmt = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' })

export const fmtUSD = (n: number | null | undefined) => (n == null ? '—' : usd.format(n))
export const fmtNum = (n: number | null | undefined) => (n == null ? '—' : num.format(n))
export const fmtPct = (n: number | null | undefined) =>
  n == null ? '—' : `${n >= 0 ? '+' : ''}${num.format(n)}%`
export const fmtDate = (iso: string) => dateFmt.format(new Date(iso))
export const fmtDateTime = (iso: string) => dateTimeFmt.format(new Date(iso))
