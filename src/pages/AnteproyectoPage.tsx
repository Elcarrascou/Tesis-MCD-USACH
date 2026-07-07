import { FileText, Download, CheckCircle2 } from 'lucide-react'
import { ANTEPROYECTO_SECTIONS } from '../data/presentation'

const PDF_URL = '/Anteproyecto_Tesis_MCD_2026.pdf'

export default function AnteproyectoPage() {
  return (
    <section className="min-h-screen py-20 sm:py-24" style={{ background: '#f5fffe' }}>
      <div className="wrap w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 sm:px-5 py-2 font-mono text-[12px] sm:text-[13px] tracking-[0.05em] font-bold"
            style={{ background: 'rgba(26,122,60,0.08)', border: '1px solid rgba(26,122,60,0.3)', color: '#1a7a3c' }}>
            <CheckCircle2 size={13} aria-hidden="true" />
            Documento disponible
          </div>
          <h1 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(32px,5vw,58px)', color: '#333333' }}>
            Anteproyecto de <span style={{ color: '#009A93' }}>Tesis</span>
          </h1>
          <p className="leading-[1.8] max-w-[520px] mx-auto" style={{ fontSize: 'clamp(15px,2vw,17px)', color: '#4f4f4f' }}>
            Documento formal del anteproyecto presentado al Magíster en Ciencia de Datos de la USACH,
            incluyendo marco teórico, hipótesis, metodología y resultados preliminares.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] max-w-6xl mx-auto items-start">
          {/* ── Visor PDF embebido ── */}
          <div className="rounded-[18px] overflow-hidden card-shadow"
            style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.18)' }}>
            <div className="flex items-center gap-2.5 px-5 py-3.5"
              style={{ background: 'rgba(0,154,147,0.06)', borderBottom: '1px solid rgba(0,154,147,0.15)' }}>
              <FileText size={16} style={{ color: '#009A93' }} aria-hidden="true" />
              <span className="font-mono text-[12px] font-bold truncate" style={{ color: '#333333' }}>
                Anteproyecto_Tesis_MCD_2026.pdf
              </span>
              <span className="ml-auto font-mono text-[11px] font-bold flex-shrink-0" style={{ color: '#4f4f4f' }}>24 págs.</span>
            </div>
            <object data={PDF_URL} type="application/pdf" className="w-full" style={{ height: 'min(75vh, 860px)' }}
              aria-label="Visor del anteproyecto de tesis en PDF">
              {/* Fallback: móviles / navegadores sin visor PDF nativo */}
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center gap-4 p-8 text-center">
                <FileText size={34} style={{ color: '#009A93' }} aria-hidden="true" />
                <p className="font-medium max-w-[36ch]" style={{ fontSize: '14px', color: '#4f4f4f' }}>
                  Tu navegador no puede mostrar el PDF embebido. Descárgalo para leerlo.
                </p>
                <a href={PDF_URL} download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold press"
                  style={{ fontSize: '14px', background: '#009A93', color: 'white' }}>
                  <Download size={15} aria-hidden="true" />
                  Descargar PDF
                </a>
              </div>
            </object>
          </div>

          {/* ── Índice + descarga ── */}
          <div className="rounded-[18px] overflow-hidden card-shadow lg:sticky lg:top-24"
            style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.18)' }}>
            <div className="p-6 sm:p-7">
              <h2 className="font-bold mb-5" style={{ fontSize: '17px', color: '#333333' }}>Contenido del documento</h2>
              <ul className="space-y-3">
                {ANTEPROYECTO_SECTIONS.map(item => (
                  <li key={item.num} className="flex items-center gap-3">
                    <span className="font-mono text-[12px] w-6 font-bold flex-shrink-0" style={{ color: '#4f4f4f' }}>{item.num}</span>
                    <span className="font-medium" style={{ fontSize: '15px', color: item.done ? '#333333' : '#4f4f4f' }}>{item.title}</span>
                    {item.done && (
                      <span className="ml-auto font-mono text-[11px] px-2 py-0.5 rounded font-bold flex-shrink-0"
                        aria-label="Sección completa"
                        style={{ background: 'rgba(0,154,147,0.1)', color: '#009A93' }}>✓</span>
                    )}
                  </li>
                ))}
              </ul>

              <a href={PDF_URL} download
                className="mt-7 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold press"
                style={{ fontSize: '15px', background: '#009A93', color: 'white' }}>
                <Download size={17} aria-hidden="true" />
                Descargar PDF
              </a>
              <p className="text-center mt-2.5 font-mono font-bold tabular-nums" style={{ fontSize: '12px', color: '#4f4f4f' }}>
                24 páginas · 0,4 MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
