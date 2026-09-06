import { ArrowRight, ScanLine, Upload } from 'lucide-react'

interface HeroProps {
  onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-medical-50 via-white to-white">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_75%_25%,rgba(78,174,214,0.16),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-medical-100 bg-white px-3 py-1.5 text-sm font-medium text-medical-700 shadow-sm">
            <ScanLine size={16} /> AI-assisted clinical decision support
          </div>
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">AI-Assisted Pneumonia Detection from Chest X-Rays</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Upload a chest X-ray to screen for <strong className="font-semibold text-slate-700">Normal</strong>, <strong className="font-semibold text-slate-700">Bacterial Pneumonia</strong>, or <strong className="font-semibold text-slate-700">Viral Pneumonia</strong> patterns in seconds.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={onStart} className="inline-flex items-center justify-center gap-2 rounded-xl bg-medical-700 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-medical-900 focus:outline-none focus:ring-4 focus:ring-medical-100"><Upload size={18} /> Upload X-Ray</button>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-medical-700 transition hover:border-medical-200 hover:bg-medical-50">Learn More <ArrowRight size={18} /></a>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">For educational and clinical decision-support purposes only.</p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-medical-100 bg-medical-900 p-5 shadow-soft">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#8dd7f2_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="relative rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between text-white/80"><span className="text-sm font-medium">Chest X-Ray Review</span><span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs text-emerald-200">AI ready</span></div>
              <div className="relative mx-auto grid aspect-[4/3] max-w-sm place-items-center overflow-hidden rounded-xl border border-white/20 bg-slate-900">
                <div className="absolute h-[76%] w-[42%] rounded-[48%] border border-cyan-100/40 bg-gradient-to-b from-slate-400/45 to-slate-100/20" />
                <div className="absolute h-[76%] w-[42%] translate-x-[47%] rounded-[48%] border border-cyan-100/40 bg-gradient-to-b from-slate-400/45 to-slate-100/20" />
                <div className="h-[70%] w-px bg-cyan-100/70" />
                <ScanLine className="absolute text-cyan-200" size={42} strokeWidth={1.4} />
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-cyan-100/80"><span>IMAGE ANALYSIS</span><span>SECURE SESSION</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
