import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

/** Layout del sitio de documentación (marketing): Nav + contenido + Footer. */
export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-navy">
      <Nav />
      <main className="relative pt-[63px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
