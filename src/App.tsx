import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { AnalysisPanel } from './components/AnalysisPanel'

function App() {
  const scrollToAnalysis = () => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return <div className="min-h-screen bg-white text-ink"><Header onStart={scrollToAnalysis} /><main><Hero onStart={scrollToAnalysis} /><HowItWorks /><AnalysisPanel /></main><Footer /></div>
}

export default App
