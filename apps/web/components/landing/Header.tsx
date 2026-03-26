'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05050a]/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
          FANDOM GALAXY
        </div>
        <button className="text-white hover:text-orange-400 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  )
}
