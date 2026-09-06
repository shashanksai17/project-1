import { ImagePlus, LoaderCircle, RotateCcw, Trash2, UploadCloud } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import type { PredictionResult } from '../types'
import { requestPrediction } from '../services/predictionService'
import { ResultCard } from './ResultCard'

const supportedTypes = ['image/jpeg', 'image/png']

export function AnalysisPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const selectFile = (newFile?: File) => {
    if (!newFile) return
    if (!supportedTypes.includes(newFile.type)) { setError('Please select a JPG, JPEG, or PNG image.'); return }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(newFile); setPreviewUrl(URL.createObjectURL(newFile)); setError(null); setResult(null)
  }
  const removeImage = () => { if (previewUrl) URL.revokeObjectURL(previewUrl); setFile(null); setPreviewUrl(null); setResult(null); setError(null); if (inputRef.current) inputRef.current.value = '' }
  const analyze = async () => {
    if (!file) return
    setIsLoading(true); setError(null)
    try { setResult(await requestPrediction(file)) } catch { setError('We could not analyze this image. Please try again.') } finally { setIsLoading(false) }
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files[0]) }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0])

  return <section id="analysis" className="scroll-mt-20 py-16 sm:py-20">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center"><p className="text-sm font-bold uppercase tracking-widest text-medical-600">Screen an image</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">X-ray analysis</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Upload a clear chest X-ray image to receive an AI-generated screening result.</p></div>
      <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-8">
        {!result && <>
          <input ref={inputRef} type="file" className="sr-only" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleChange} />
          {!previewUrl ? <div onClick={() => inputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onDragEnter={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)} className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition sm:p-16 ${isDragging ? 'border-medical-600 bg-medical-50' : 'border-slate-200 bg-slate-50/70 hover:border-medical-400 hover:bg-medical-50/50'}`} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-medical-100 text-medical-700"><UploadCloud size={28} /></span><h3 className="mt-5 text-lg font-bold text-ink">Drag and drop your chest X-ray</h3><p className="mt-2 text-sm text-slate-500">or click to browse from your device</p><span className="mt-5 inline-block rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">JPG, JPEG, or PNG</span>
          </div> : <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"><img src={previewUrl} alt="Selected chest X-ray" className="aspect-[4/3] w-full object-contain" /></div><div><span className="inline-flex items-center gap-2 rounded-full bg-medical-50 px-3 py-1.5 text-sm font-medium text-medical-700"><ImagePlus size={16} /> Image ready</span><h3 className="mt-4 text-xl font-bold text-ink">Ready to analyze your X-ray</h3><p className="mt-2 break-all text-sm text-slate-500">{file?.name}</p><div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col"><button onClick={analyze} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-medical-700 px-5 py-3 font-semibold text-white transition hover:bg-medical-900 disabled:cursor-not-allowed disabled:bg-slate-300">{isLoading ? <><LoaderCircle className="animate-spin" size={19} /> Analyzing X-Ray…</> : <><UploadCloud size={19} /> Analyze X-Ray</>}</button><button onClick={removeImage} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed"><Trash2 size={18} /> Remove image</button></div></div></div>}
          {error && <p className="mt-4 text-sm font-medium text-red-600" role="alert">{error}</p>}
        </>}
        {result && previewUrl && <ResultCard imageUrl={previewUrl} result={result} onReset={removeImage} />}
      </div>
    </div>
  </section>
}
