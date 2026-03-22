'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

/* ------------------------------------------------------------------ */
/*  CountUp — animates a number from 0 to `end` over `duration` ms   */
/* ------------------------------------------------------------------ */
function CountUp({
  end,
  suffix = '',
  duration = 2000,
  startOnReveal,
}: {
  end: number
  suffix?: string
  duration?: number
  startOnReveal: boolean
}) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!startOnReveal) return

    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setValue(Math.round(eased * end))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [startOnReveal, end, duration])

  return (
    <span className="bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Stats data                                                        */
/* ------------------------------------------------------------------ */
const stats = [
  { end: 10, suffix: 'K+', label: '활성 팬덤' },
  { end: 50, suffix: 'K+', label: '완료된 퀘스트' },
  { end: 1200, suffix: '+', label: '캠페인 아카이브' },
  { end: 99, suffix: '%', label: '만족도' },
]

/* ------------------------------------------------------------------ */
/*  SocialProof section                                               */
/* ------------------------------------------------------------------ */
export default function SocialProof() {
  const sectionRef = useScrollReveal<HTMLElement>()
  const [revealed, setRevealed] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Detect when the section is revealed to trigger counters
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observerRef.current.observe(el)
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal flex h-dvh snap-start snap-always items-center bg-gradient-to-b from-[var(--bg-primary,#0a0a0f)] to-[var(--bg-secondary,#12121a)]"
    >
      <div ref={innerRef} className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-y-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center gap-2 ${
                i < stats.length - 1
                  ? 'md:border-r md:border-white/10'
                  : ''
              }`}
            >
              <CountUp
                end={stat.end}
                suffix={stat.suffix}
                startOnReveal={revealed}
              />
              <span className="text-sm text-white/50 sm:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
