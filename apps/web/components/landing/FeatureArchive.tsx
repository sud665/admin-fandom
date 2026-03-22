'use client'

import Image from 'next/image'
import { useParallax } from '@/hooks/useParallax'

const features = [
  { icon: '📦', label: '캠페인 아카이브' },
  { icon: '💰', label: '펀딩 히스토리' },
  { icon: '⭐', label: '팬덤 마일스톤' },
]

export default function FeatureArchive() {
  const { ref, progress } = useParallax()
  const bgY = (progress - 0.5) * 60
  const textY = (progress - 0.5) * -30

  return (
    <section
      ref={ref}
      className="relative flex h-dvh snap-start snap-always items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${bgY}px) scale(1.1)` }}
      >
        <Image
          src="https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&q=80"
          alt="성운 배경"
          fill
          loading="lazy"
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div
        className="relative z-10 flex w-full max-w-lg flex-col px-6 py-20 will-change-transform sm:px-10 md:px-16 lg:px-24"
        style={{ transform: `translateY(${textY}px)` }}
      >
        <span className="mb-4 inline-block w-fit rounded-full bg-[#00D4AA]/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#00D4AA] sm:text-sm">
          Archive
        </span>

        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
          팬덤의 역사를
          <br />
          기록하다
        </h2>

        <p className="mb-8 text-base leading-relaxed text-white/70 sm:text-lg">
          응원, 펀딩, 캠페인 — 팬덤의 모든 순간을 아카이브에 담습니다.
          함께 만들어온 기록이 우주의 별이 됩니다.
        </p>

        <ul className="flex flex-col gap-4">
          {features.map((f) => (
            <li key={f.label} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00D4AA]/20 text-xl">
                {f.icon}
              </span>
              <span className="text-sm font-medium text-white/90 sm:text-base">
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
