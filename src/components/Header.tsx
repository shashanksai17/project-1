import { Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  onStart: () => void
}

export function Header({ onStart }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const links = [
    { label: 'Home', href: '#home' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
  ]

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3 font-semibold text-ink" onClick={closeMenu}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-medical-700 text-white shadow-sm"><ShieldCheck size={22} /></span>
          <span>PneumoScan <span className="text-medical-600">AI</span></span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
          {links.map((link) => <a key={link.href} href={link.href} className="transition hover:text-medical-700">{link.label}</a>)}
        </nav>
        <button onClick={onStart} className="hidden rounded-xl bg-medical-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-900 focus:outline-none focus:ring-4 focus:ring-medical-100 md:block">
          Start Analysis
        </button>
        <button className="rounded-lg p-2 text-medical-700 md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isOpen && <nav className="border-t border-slate-100 bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          {links.map((link) => <a key={link.href} href={link.href} onClick={closeMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-medical-50">{link.label}</a>)}
          <button onClick={() => { closeMenu(); onStart() }} className="mt-1 rounded-xl bg-medical-700 px-4 py-3 text-sm font-semibold text-white">Start Analysis</button>
        </div>
      </nav>}
    </header>
  )
}
