'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const features = [
  { icon: '⚡', label: 'Zap 포인트 수집' },
  { icon: '🚀', label: '부스트로 에너지 폭발' },
  { icon: '📋', label: '일일 미션 시스템' },
]

export default function FeatureQuest() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal relative flex min-h-dvh items-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80"
        alt="오로라 배경"
        fill
        loading="lazy"
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient Overlay — from RIGHT */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />

      {/* Content — aligned RIGHT */}
      <div className="relative z-10 ml-auto flex w-full max-w-lg flex-col px-6 py-20 text-right sm:px-10 md:px-16 lg:px-24">
        {/* Badge */}
        <span className="mb-4 ml-auto inline-block w-fit rounded-full bg-[#FF2D78]/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#FF2D78] sm:text-sm">
          Quest
        </span>

        {/* Title */}
        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
          매일 새로운
          <br />
          퀘스트
        </h2>

        {/* Description */}
        <p className="mb-8 text-base leading-relaxed text-white/70 sm:text-lg">
          매일 업데이트되는 미션을 완수하고 Zap 포인트를 모으세요.
          부스트로 팬덤의 에너지를 폭발시키고, 갤럭시를 더 밝게 빛내세요.
        </p>

        {/* Feature Bullets */}
        <ul className="flex flex-col gap-4">
          {features.map((f) => (
            <li key={f.label} className="flex items-center justify-end gap-4">
              <span className="text-sm font-medium text-white/90 sm:text-base">
                {f.label}
              </span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D78]/20 text-xl">
                {f.icon}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
