import { CheckCircle2, RotateCcw, Stethoscope } from 'lucide-react'
import type { PredictionResult } from '../types'

interface ResultCardProps { imageUrl: string; result: PredictionResult; onReset: () => void }
const status = {
  Normal: { label: 'Normal', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', bar: 'bg-emerald-500', icon: 'text-emerald-600' },
  'Bacterial Pneumonia': { label: 'Bacterial Pneumonia', badge: 'bg-orange-50 text-orange-700 ring-orange-200', bar: 'bg-orange-500', icon: 'text-orange-600' },
  'Viral Pneumonia': { label: 'Viral Pneumonia', badge: 'bg-red-50 text-red-700 ring-red-200', bar: 'bg-red-500', icon: 'text-red-600' },
}

export function ResultCard({ imageUrl, result, onReset }: ResultCardProps) {
  const config = status[result.prediction]
  return <div className="grid gap-7 lg:grid-cols-[1fr_1.1fr] lg:items-center"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"><img src={imageUrl} alt="Analyzed chest X-ray" className="aspect-[4/3] w-full object-contain" /></div><div><div className="flex items-center gap-2 text-sm font-semibold text-medical-700"><Stethoscope size={18} /> Analysis complete</div><h3 className="mt-3 text-xl font-bold text-ink">Screening result</h3><div className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-lg font-bold ring-1 ${config.badge}`}><CheckCircle2 size={21} /> {config.label}</div><div className="mt-6"><div className="flex items-baseline justify-between gap-4"><span className="text-sm font-medium text-slate-600">Model confidence</span><span className={`text-2xl font-bold ${config.icon}`}>{result.confidence}%</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Model confidence" aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.confidence}><div className={`h-full rounded-full transition-all duration-700 ${config.bar}`} style={{ width: `${result.confidence}%` }} /></div></div><p className="mt-5 text-sm leading-6 text-slate-500">Review this result alongside patient history, clinical findings, and assessment by a qualified professional.</p><button onClick={onReset} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-medical-200 bg-medical-50 px-5 py-3 font-semibold text-medical-700 transition hover:bg-medical-100"><RotateCcw size={18} /> Analyze Another Image</button></div></div>
}
