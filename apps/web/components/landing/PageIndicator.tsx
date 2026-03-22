'use client'

import { useEffect, useState } from 'react'

const labels = ['Hero', 'Galaxy', 'Quest', 'Archive', 'Community', 'Stats', 'Start']

export default function PageIndicator() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    const sections = main.querySelectorAll(':scope > section')

    // Show indicator after first scroll
    const handleScroll = () => {
      if (!visible && main.scrollTop > 100) setVisible(true)

      // Find which section is most visible
      const mainRect = main.getBoundingClientRect()
      let closest = 0
      let minDistance = Infinity

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect()
        const distance = Math.abs(rect.top - mainRect.top)
        if (distance < minDistance) {
          minDistance = distance
          closest = i
        }
      })

      setActive(closest)
    }

    main.addEventListener('scroll', handleScroll, { passive: true })
    return () => main.removeEventListener('scroll', handleScroll)
  }, [visible])

  const scrollTo = (index: number) => {
    const main = document.querySelector('main')
    if (!main) return
    const sections = main.querySelectorAll(':scope > section')
    sections[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed right-4 top-1/2 z-50 -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-500 md:right-8 ${
        visible ? 'flex opacity-100' : 'hidden md:flex md:opacity-0'
      }`}
    >
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => scrollTo(i)}
          className="group flex items-center gap-3"
          aria-label={`${label} 섹션으로 이동`}
        >
          {/* Label — appears on hover */}
          <span
            className={`text-[10px] font-medium tracking-wider uppercase transition-all duration-300 ${
              active === i
                ? 'text-white/70'
                : 'translate-x-2 text-transparent group-hover:translate-x-0 group-hover:text-white/40'
            }`}
          >
            {label}
          </span>

          {/* Dot / bar */}
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === i
                ? 'h-1.5 w-6 bg-white'
                : 'h-1.5 w-1.5 bg-white/25 group-hover:bg-white/50'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
