import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import ProyectoPage from './pages/ProyectoPage'
import AnteproyectoPage from './pages/AnteproyectoPage'
import PresentacionPage from './pages/PresentacionPage'
import SolucionPage from './pages/SolucionPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy">
        <Nav />
        <main className="relative pt-[63px]">
          <Routes>
            <Route path="/" element={<ProyectoPage />} />
            <Route path="/anteproyecto" element={<AnteproyectoPage />} />
            <Route path="/presentacion" element={<PresentacionPage />} />
            <Route path="/solucion" element={<SolucionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
