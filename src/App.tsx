import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import ProyectoPage from './pages/ProyectoPage'
import AnteproyectoPage from './pages/AnteproyectoPage'
import PresentacionPage from './pages/PresentacionPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <div className="grid-bg" />
        <Nav />
        <main className="relative z-10 pt-[60px]">
          <Routes>
            <Route path="/" element={<ProyectoPage />} />
            <Route path="/anteproyecto" element={<AnteproyectoPage />} />
            <Route path="/presentacion" element={<PresentacionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
