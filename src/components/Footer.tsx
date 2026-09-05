import { ShieldCheck } from 'lucide-react'

export function Footer() { return <footer id="about" className="border-t border-slate-200 bg-medical-900 py-10 text-slate-300"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8"><div><div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck size={20} /> PneumoScan AI</div><p className="mt-2 text-sm">Pneumonia Detection Using Chest X-Ray Images</p></div><p className="text-sm">© {new Date().getFullYear()} PneumoScan AI. All rights reserved.</p></div></footer> }
