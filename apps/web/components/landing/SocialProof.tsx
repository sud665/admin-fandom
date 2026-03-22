'use client'

import { useEffect, useRef, useState } from 'react'
import { useParallax } from '@/hooks/useParallax'

/* ------------------------------------------------------------------ */
/*  CountUp — animates a number from 0 to `end` over `duration` ms   */
/* ------------------------------------------------------------------ */
function CountUp({
  end,
  suffix = '',
  duration = 2000,
  start,
}: {
  end: number
  suffix?: string
  duration?: number
  start: boolean
}) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return

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
  }, [start, end, duration])

  return (
    <span className="bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Stats data                                                        */
/* ------------------------------------------------------------------ */
const stats = [
  { end: 10, suffix: 'K+', label: '활성 팬덤', gauge: 75 },
  { end: 50, suffix: 'K+', label: '완료된 퀘스트', gauge: 90 },
  { end: 1200, suffix: '+', label: '캠페인 아카이브', gauge: 60 },
  { end: 99, suffix: '%', label: '만족도', gauge: 99 },
]

/* ------------------------------------------------------------------ */
/*  SocialProof — Fever 2-column layout + dot grid background         */
/* ------------------------------------------------------------------ */
export default function SocialProof() {
  const { ref, progress } = useParallax()
  const contentY = (progress - 0.5) * -30
  const [revealed, setRevealed] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative flex h-dvh snap-start snap-always items-center overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d15] to-[#0a0a0f]" />

      <div
        ref={innerRef}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 will-change-transform md:flex-row md:gap-16 md:px-12"
        style={{ transform: `translateY(${contentY}px)` }}
      >
        {/* Left — Text */}
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#00D4AA]" />
            <p className="text-xs font-medium tracking-[0.25em] text-[#00D4AA]">
              SOCIAL PROOF
            </p>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">
            팬들이 증명하는
            <br />
            <span className="bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] bg-clip-text text-transparent">
              짜릿한 순간
            </span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-white/50 sm:text-lg">
            수천 개의 팬덤이 매일 새로운 기록을 만들어가고 있습니다.
            당신의 열정이 우주를 밝히는 에너지가 됩니다.
          </p>
        </div>

        {/* Right — Gauge Cards */}
        <div className="grid w-full max-w-md grid-cols-2 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <CountUp end={stat.end} suffix={stat.suffix} start={revealed} />
              <p className="mt-1 text-xs text-white/40 sm:text-sm">
                {stat.label}
              </p>
              {/* Gauge bar */}
              <div className="mt-3 h-1 w-full rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] transition-[width] duration-[2s] ease-out"
                  style={{ width: revealed ? `${stat.gauge}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
