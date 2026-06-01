import Hero          from '../components/sections/Hero'
import Overview      from '../components/sections/Overview'
import PortalPromo   from '../components/sections/PortalPromo'
import Architecture  from '../components/sections/Architecture'
import MLModels      from '../components/sections/MLModels'
import MarcoTeorico  from '../components/sections/MarcoTeorico'
import TechStack     from '../components/sections/TechStack'
import Budget        from '../components/sections/Budget'
import Roadmap       from '../components/sections/Roadmap'

export default function ProyectoPage() {
  return (
    <>
      <Hero />
      <Overview />
      <PortalPromo />
      <Architecture />
      <MLModels />
      <MarcoTeorico />
      <TechStack />
      <Budget />
      <Roadmap />
    </>
  )
}
