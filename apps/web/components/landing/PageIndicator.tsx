'use client'

import { useEffect, useState } from 'react'

const navItems = ['Home', 'Features', 'Stats', 'Start']

export default function FloatingNav() {
  const [active, setActive] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = main
      setScrollProgress(scrollTop / (scrollHeight - clientHeight))
      setVisible(scrollTop > clientHeight * 0.5)

      // Detect active section
      const sections = main.querySelectorAll(':scope > section')
      let closest = 0
      let minDist = Infinity
      sections.forEach((s, i) => {
        const dist = Math.abs(s.getBoundingClientRect().top - main.getBoundingClientRect().top)
        if (dist < minDist) { minDist = dist; closest = i }
      })
      setActive(closest)
    }

    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (index: number) => {
    const main = document.querySelector('main')
    if (!main) return
    const sections = main.querySelectorAll(':scope > section')
    sections[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-6 px-6 py-2.5">
          {navItems.map((item, i) => (
            <button
              key={item}
              type="button"
              onClick={() => scrollTo(i)}
              className={`text-xs font-medium transition-colors ${
                active === i ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        {/* Progress bar */}
        <div className="h-[2px] w-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] transition-[width] duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </nav>
  )
}
