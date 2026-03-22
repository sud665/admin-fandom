'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function CTASection() {
  const sectionRef = useScrollReveal<HTMLElement>()

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
        alt="우주에서 본 지구 배경"
        fill
        loading="lazy"
        className="object-cover"
        sizes="100vw"
      />

      {/* Heavy Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Title */}
        <h2 className="mb-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
          팬덤의 새로운 우주가
          <br />
          열립니다
        </h2>

        {/* Subtitle */}
        <p className="mb-10 text-base text-white/70 sm:text-lg md:text-xl">
          지금 바로 당신만의 갤럭시에 합류하세요
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Primary */}
          <Link
            href="/galaxy"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] px-8 py-4 text-base font-semibold text-white shadow-[0_0_32px_rgba(123,47,242,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_48px_rgba(123,47,242,0.6)] active:scale-100 sm:text-lg"
          >
            지금 시작하기
          </Link>

          {/* Secondary */}
          <button
            type="button"
            onClick={handleScrollToTop}
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 active:bg-white/5 sm:text-lg"
          >
            더 알아보기
          </button>
        </div>
      </div>
    </section>
  )
}
