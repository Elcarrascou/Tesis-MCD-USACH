import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoUsach from '../../assets/logoUsach.webp'

export default function LoginPage() {
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Si ya está autenticado, ir directo al portal
  useEffect(() => {
    if (!loading && user) navigate('/portal', { replace: true })
  }, [loading, user, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email.trim(), password)
    setSubmitting(false)
    if (error) setError(error)
    else navigate('/portal', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#333333' }}>
      {/* Accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg,#009A93,#1ab0a8,#E37200,#1ab0a8,#009A93)' }} />

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <img src={logoUsach} alt="USACH" className="h-12 w-auto object-contain mb-4" />
          <div className="font-bold text-[13px] tracking-[0.1em] uppercase" style={{ color: '#009A93' }}>
            Portal de Gestión de Portafolio
          </div>
          <div className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Magíster en Ciencia de Datos · USACH
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[18px] overflow-hidden card-shadow" style={{ background: '#ffffff' }}>
          <div className="px-7 py-5 flex items-center gap-2.5" style={{ background: 'rgba(0,154,147,0.08)', borderBottom: '1px solid rgba(0,154,147,0.15)' }}>
            <Lock size={16} aria-hidden="true" style={{ color: '#009A93' }} />
            <span className="font-bold text-[15px]" style={{ color: '#333333' }}>Iniciar sesión</span>
          </div>

          <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block font-mono text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: '#4f4f4f' }}>
                Correo
              </label>
              <input id="email" type="email" name="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="demo@tesis-mcd.cl"
                spellCheck={false}
                className="w-full px-4 py-2.5 rounded-xl text-[15px] outline-none transition-colors focus:border-[#009A93]"
                style={{ border: '1.5px solid rgba(0,154,147,0.25)', color: '#333333' }} />
            </div>

            <div>
              <label htmlFor="password" className="block font-mono text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: '#4f4f4f' }}>
                Contraseña
              </label>
              <input id="password" type="password" name="password" autoComplete="current-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-[15px] outline-none transition-colors focus:border-[#009A93]"
                style={{ border: '1.5px solid rgba(0,154,147,0.25)', color: '#333333' }} />
            </div>

            {error && (
              <div className="rounded-lg px-3.5 py-2.5 text-[13px] font-medium" aria-live="polite"
                style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.3)', color: '#c0392b' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-bold press disabled:opacity-50"
              style={{ background: '#009A93', color: '#ffffff' }}>
              <LogIn size={17} aria-hidden="true" />
              {submitting ? 'Ingresando…' : 'Ingresar'}
            </button>

            {/* Credenciales demo */}
            <div className="text-center mt-1 rounded-lg px-3 py-2.5" style={{ background: '#f5fffe', border: '1px dashed rgba(0,154,147,0.3)' }}>
              <p className="font-mono text-[11px] font-bold mb-0.5" style={{ color: '#009A93' }}>ACCESO DEMO</p>
              <p className="font-mono text-[12px]" style={{ color: '#4f4f4f' }}>demo@tesis-mcd.cl · Portafolio2026</p>
            </div>
          </form>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="font-mono text-[12px] font-bold transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}>
            ← Volver al sitio del proyecto
          </Link>
        </div>
      </div>
    </div>
  )
}
