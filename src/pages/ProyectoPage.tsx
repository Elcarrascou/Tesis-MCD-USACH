import Hero from '../components/sections/Hero'
import Overview from '../components/sections/Overview'
import Architecture from '../components/sections/Architecture'
import MLModels from '../components/sections/MLModels'
import TechStack from '../components/sections/TechStack'
import Budget from '../components/sections/Budget'
import Roadmap from '../components/sections/Roadmap'

export default function ProyectoPage() {
  return (
    <>
      <Hero />
      <Overview />
      <Architecture />
      <MLModels />
      <TechStack />
      <Budget />
      <Roadmap />
    </>
  )
}
