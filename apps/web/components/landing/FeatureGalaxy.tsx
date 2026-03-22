'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const features = [
  { icon: '🪐', label: '인터랙티브 3D 행성 시스템' },
  { icon: '🌀', label: '실시간 궤도 시각화' },
  { icon: '🌑', label: '이클립스 이벤트' },
]

export default function FeatureGalaxy() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal relative flex h-dvh snap-start snap-always items-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920&q=80"
        alt="행성 배경"
        fill
        loading="lazy"
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient Overlay — from LEFT */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col px-6 py-20 sm:px-10 md:px-16 lg:px-24">
        {/* Badge */}
        <span className="mb-4 inline-block w-fit rounded-full bg-[#7B2FF2]/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#7B2FF2] sm:text-sm">
          Galaxy
        </span>

        {/* Title */}
        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
          나만의 갤럭시를
          <br />
          탐험하세요
        </h2>

        {/* Description */}
        <p className="mb-8 text-base leading-relaxed text-white/70 sm:text-lg">
          좋아하는 아티스트가 태양이 되고, 팬 활동이 행성의 궤도를 만듭니다.
          실시간으로 변화하는 3D 우주에서 팬덤의 에너지를 시각적으로 경험하세요.
        </p>

        {/* Feature Bullets */}
        <ul className="flex flex-col gap-4">
          {features.map((f) => (
            <li key={f.label} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7B2FF2]/20 text-xl">
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
