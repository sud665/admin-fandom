'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HeroSection() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal relative flex h-dvh snap-start snap-always flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80"
        alt="우주 갤럭시 배경"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0f]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Subtitle */}
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#00D4AA] sm:text-sm md:text-base">
          차세대 글로벌 팬덤 플랫폼
        </p>

        {/* Title */}
        <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-7xl">
          당신만의{' '}
          <span className="bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] bg-clip-text text-transparent">
            팬덤 우주
          </span>
        </h1>

        {/* Description */}
        <p className="mb-10 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
          좋아하는 아티스트를 중심으로 펼쳐지는 시네마틱 갤럭시.
          퀘스트를 완수하고, 팬덤의 궤도를 넓혀가세요.
        </p>

        {/* CTA Button */}
        <Link
          href="/galaxy"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] px-8 py-4 text-base font-semibold text-white shadow-[0_0_32px_rgba(123,47,242,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_48px_rgba(123,47,242,0.6)] active:scale-100 sm:text-lg"
        >
          우주로 입장하기 🚀
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  )
}
