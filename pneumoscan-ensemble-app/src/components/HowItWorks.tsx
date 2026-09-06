import { BrainCircuit, FileImage, BarChart3 } from 'lucide-react'

const steps = [
  { icon: FileImage, title: 'Upload chest X-ray', text: 'Choose a JPG, JPEG, or PNG image from your secure device.' },
  { icon: BrainCircuit, title: 'AI model analyzes image', text: 'Our trained deep-learning model evaluates visual patterns in the X-ray.' },
  { icon: BarChart3, title: 'Review prediction', text: 'View the predicted class and confidence score to support your review.' },
]

export function HowItWorks() {
  return <section id="how-it-works" className="bg-slate-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-medical-600">Simple workflow</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">How PneumoScan AI works</h2><p className="mt-4 leading-7 text-slate-600">A focused workflow designed to make image screening clear and efficient.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => <article key={step.title} className="relative rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"><span className="absolute right-6 top-6 text-sm font-bold text-slate-300">0{index + 1}</span><span className="grid h-12 w-12 place-items-center rounded-xl bg-medical-50 text-medical-700"><step.icon size={24} /></span><h3 className="mt-6 text-lg font-bold text-ink">{step.title}</h3><p className="mt-3 leading-7 text-slate-600">{step.text}</p></article>)}
      </div>
    </div>
  </section>
}
