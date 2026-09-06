import { AlertTriangle } from 'lucide-react'

export function Disclaimer() {
  return <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} /><p><strong>Medical disclaimer:</strong> This AI tool is for educational and clinical decision-support purposes only. It does not replace diagnosis by a qualified healthcare professional.</p></div>
}
