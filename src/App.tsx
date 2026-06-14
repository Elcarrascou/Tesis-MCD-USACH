import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { RealtimeProvider } from './context/RealtimeContext'
import MarketingLayout from './components/layout/MarketingLayout'
import ProtectedRoute from './components/portal/ProtectedRoute'
import PortalLayout from './components/portal/PortalLayout'

import ProyectoPage from './pages/ProyectoPage'
import AnteproyectoPage from './pages/AnteproyectoPage'
import PresentacionPage from './pages/PresentacionPage'
import SolucionPage from './pages/SolucionPage'

import LoginPage from './pages/portal/LoginPage'
import PortalDashboard from './pages/portal/PortalDashboard'
import PortalMovimientos from './pages/portal/PortalMovimientos'
import PortalDecisiones from './pages/portal/PortalDecisiones'
import PortalGanancias from './pages/portal/PortalGanancias'
import PortalModelos from './pages/portal/PortalModelos'
import PortalEvaluacion from './pages/portal/PortalEvaluacion'
import PortalAnalytics from './pages/portal/PortalAnalytics'

export default function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* ── Sitio de documentación (marketing) ── */}
              <Route element={<MarketingLayout />}>
                <Route path="/" element={<ProyectoPage />} />
                <Route path="/solucion" element={<SolucionPage />} />
                <Route path="/anteproyecto" element={<AnteproyectoPage />} />
                <Route path="/presentacion" element={<PresentacionPage />} />
              </Route>

              {/* ── Portal de gestión (operacional, autenticado) ── */}
              <Route path="/portal/login" element={<LoginPage />} />
              <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
                <Route index element={<PortalDashboard />} />
                <Route path="movimientos" element={<PortalMovimientos />} />
                <Route path="decisiones" element={<PortalDecisiones />} />
                <Route path="ganancias" element={<PortalGanancias />} />
                <Route path="modelos" element={<PortalModelos />} />
                <Route path="evaluacion" element={<PortalEvaluacion />} />
                <Route path="analytics" element={<PortalAnalytics />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </RealtimeProvider>
    </AuthProvider>
  )
}
