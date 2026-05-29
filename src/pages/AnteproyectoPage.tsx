import { FileText, Download, Clock } from 'lucide-react'

export default function AnteproyectoPage() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 sm:py-24" style={{ background: '#f5fffe' }}>
      <div className="wrap w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 sm:px-5 py-2 font-mono text-[12px] sm:text-[13px] tracking-[0.05em] font-bold"
            style={{ background: 'rgba(0,154,147,0.08)', border: '1px solid rgba(0,154,147,0.3)', color: '#009A93' }}>
            <Clock size={13} />
            Documento próximamente disponible
          </div>
          <h1 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(32px,5vw,58px)', color: '#333333' }}>
            Anteproyecto de <span style={{ color: '#009A93' }}>Tesis</span>
          </h1>
          <p className="leading-[1.8] max-w-[520px] mx-auto" style={{ fontSize: 'clamp(15px,2vw,17px)', color: '#4f4f4f' }}>
            Documento formal del anteproyecto presentado al Magíster en Ciencia de Datos de la USACH,
            incluyendo marco teórico, hipótesis, metodología y planificación.
          </p>
        </div>

        <div className="max-w-lg mx-auto rounded-[18px] overflow-hidden card-shadow"
          style={{ background: '#ffffff', border: '1px solid rgba(0,154,147,0.18)' }}>
          <div className="h-56 sm:h-64 flex flex-col items-center justify-center gap-4"
            style={{ background: 'rgba(0,154,147,0.06)', borderBottom: '1px solid rgba(0,154,147,0.15)' }}>
            <div className="w-16 h-20 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,154,147,0.12)', border: '2px solid rgba(0,154,147,0.4)' }}>
              <FileText size={30} style={{ color: '#009A93' }} />
            </div>
            <div className="text-center">
              <p className="font-bold" style={{ fontSize: '14px', color: '#333333' }}>Anteproyecto_Tesis_MCD_2026.pdf</p>
              <p className="mt-0.5 font-medium" style={{ fontSize: '12px', color: '#4f4f4f' }}>Pendiente de carga</p>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <h3 className="font-bold mb-5" style={{ fontSize: '17px', color: '#333333' }}>Contenido del documento</h3>
            <div className="space-y-3">
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
                  <span className="font-mono text-[12px] w-6 font-bold flex-shrink-0" style={{ color: '#4f4f4f' }}>{item.num}</span>
                  <span className="font-medium" style={{ fontSize: '15px', color: item.done ? '#333333' : '#4f4f4f' }}>{item.title}</span>
                  {item.done && (
                    <span className="ml-auto font-mono text-[11px] px-2 py-0.5 rounded font-bold flex-shrink-0"
                      style={{ background: 'rgba(0,154,147,0.1)', color: '#009A93' }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            <button disabled
              className="mt-7 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold opacity-40 cursor-not-allowed"
              style={{ fontSize: '15px', background: '#009A93', color: 'white' }}>
              <Download size={17} />
              Descargar PDF
            </button>
            <p className="text-center mt-2.5 font-mono font-bold" style={{ fontSize: '12px', color: '#4f4f4f' }}>Disponible próximamente</p>
          </div>
        </div>
      </div>
    </section>
  )
}

