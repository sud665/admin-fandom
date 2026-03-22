'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const features = [
  { icon: '💬', label: '실시간 Q&A' },
  { icon: '🧠', label: '팬덤 인사이트' },
  { icon: '🤝', label: '지식 공유 네트워크' },
]

export default function FeatureCommunity() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal relative flex min-h-dvh items-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80"
        alt="은하수 배경"
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
        <span className="mb-4 ml-auto inline-block w-fit rounded-full bg-[#00D4AA]/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#00D4AA] sm:text-sm">
          K-INSIDE
        </span>

        {/* Title */}
        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
          팬들이 만드는
          <br />
          지식 커뮤니티
        </h2>

        {/* Description */}
        <p className="mb-8 text-base leading-relaxed text-white/70 sm:text-lg">
          궁금한 것을 질문하고, 아는 것을 나누세요.
          팬들의 집단 지성이 만드는 가장 깊은 인사이트.
        </p>

        {/* Feature Bullets */}
        <ul className="flex flex-col gap-4">
          {features.map((f) => (
            <li key={f.label} className="flex items-center justify-end gap-4">
              <span className="text-sm font-medium text-white/90 sm:text-base">
                {f.label}
              </span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00D4AA]/20 text-xl">
                {f.icon}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
