import { FileText, Download, Clock } from 'lucide-react'

export default function AnteproyectoPage() {
  return (
    <section className="min-h-screen flex items-center justify-center py-24" style={{ background: '#f4fefd' }}>
      <div className="max-w-5xl mx-auto px-9 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.05em] font-bold"
            style={{ background: 'rgba(0,154,147,0.1)', border: '1px solid rgba(0,154,147,0.3)', color: '#009A93' }}>
            <Clock size={12} />
            Documento próximamente disponible
          </div>
          <h1 className="font-sans font-black mb-4 text-u-white" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
            Anteproyecto de <span style={{ color: '#009A93' }}>Tesis</span>
          </h1>
          <p className="text-[15px] leading-[1.8] max-w-[520px] mx-auto" style={{ color: '#4a8a86' }}>
            Documento formal del anteproyecto presentado al Magíster en Ciencia de Datos de la USACH,
            incluyendo marco teórico, hipótesis, metodología y planificación.
          </p>
        </div>

        <div className="max-w-lg mx-auto rounded-[18px] overflow-hidden card-shadow"
          style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.18)' }}>
          <div className="h-64 flex flex-col items-center justify-center gap-4"
            style={{ background: '#e8faf8', borderBottom: '1px solid rgba(0,154,147,0.15)' }}>
            <div className="w-16 h-20 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,154,147,0.12)', border: '2px solid rgba(0,154,147,0.4)' }}>
              <FileText size={28} style={{ color: '#009A93' }} />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-u-white">Anteproyecto_Tesis_MCD_2026.pdf</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#4a8a86' }}>Pendiente de carga</p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-[15px] font-bold mb-4 text-u-white">Contenido del documento</h3>
            <div className="space-y-2.5">
              {[
                { num: '1.', title: 'Resumen ejecutivo',        done: true },
                { num: '2.', title: 'Introducción',             done: true },
                { num: '3.', title: 'Hipótesis y objetivos',    done: true },
                { num: '4.', title: 'Marco Teórico',            done: true },
                { num: '5.', title: 'Metodología',              done: false },
                { num: '6.', title: 'Plan de desarrollo',       done: false },
                { num: '7.', title: 'Presupuesto y cronograma', done: false },
              ].map(item => (
                <div key={item.num} className="flex items-center gap-3">
                  <span className="font-mono text-[11px] w-5 font-bold" style={{ color: '#4a8a86' }}>{item.num}</span>
                  <span className="text-[13px] font-medium" style={{ color: item.done ? '#1a3533' : '#4a8a86' }}>{item.title}</span>
                  {item.done && (
                    <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(0,154,147,0.1)', color: '#009A93' }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            <button disabled
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold opacity-40 cursor-not-allowed"
              style={{ background: '#009A93', color: 'white' }}>
              <Download size={16} />
              Descargar PDF
            </button>
            <p className="text-center text-[11px] mt-2 font-mono font-bold" style={{ color: '#4a8a86' }}>Disponible próximamente</p>
          </div>
        </div>
      </div>
    </section>
  )
}
