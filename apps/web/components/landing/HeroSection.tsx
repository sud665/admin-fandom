'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HeroSection() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal relative flex h-dvh snap-start snap-always flex-col overflow-hidden"
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

      {/* Heavy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0f]" />

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-8 md:px-12">
        <p className="text-xs font-semibold tracking-widest text-white/40">FANDOM GALAXY</p>
        <Link
          href="/galaxy"
          className="text-xs text-white/40 transition-colors hover:text-white/70"
        >
          로그인
        </Link>
      </div>

      {/* Main content — two columns on desktop */}
      <div className="relative z-10 flex flex-1 items-center px-8 md:px-16 lg:px-24">
        {/* Left — text */}
        <div className="flex-1">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#00D4AA]" />
            <p className="text-xs font-medium tracking-[0.25em] text-[#00D4AA] sm:text-sm">
              CINEMATIC FANDOM PLATFORM
            </p>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            당신만의
          </h1>
          <h1 className="mb-8 text-5xl font-extrabold leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #F97316 100%)',
                WebkitTextStroke: '1px rgba(168, 85, 247, 0.3)',
              }}
            >
              팬덤 우주
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            좋아하는 아티스트를 중심으로 펼쳐지는 시네마틱 갤럭시.
            퀘스트를 완수하고, 팬덤의 궤도를 넓혀가세요.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <Link
              href="/galaxy"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0a0a0f] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] sm:text-base"
            >
              우주로 입장하기
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <span className="hidden text-xs text-white/30 sm:block">스크롤하여 더 알아보기</span>
          </div>
        </div>

        {/* Right — Phone mockup with live app iframe */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-[#7B2FF2]/20 via-[#EC4899]/10 to-transparent blur-2xl" />

            {/* Phone frame */}
            <div className="relative h-[580px] w-[280px] overflow-hidden rounded-[2.5rem] border-[3px] border-white/15 bg-black shadow-2xl shadow-purple-500/10">
              {/* Notch */}
              <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />

              {/* iframe — shows the actual Galaxy page */}
              <iframe
                src="/galaxy"
                title="Fandom Galaxy 앱 미리보기"
                className="h-full w-full border-0"
                style={{ pointerEvents: 'none' }}
              />

              {/* Subtle reflection overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -left-12 bottom-20 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <p className="text-xs font-semibold text-white">⚡ 3D Galaxy</p>
              <p className="text-[10px] text-white/40">실시간 인터랙티브</p>
            </div>

            {/* Floating badge top-right */}
            <div className="absolute -right-8 top-16 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <p className="text-xs font-semibold text-white">🪐 10K+</p>
              <p className="text-[10px] text-white/40">활성 팬덤</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="relative z-10 h-8" />
    </section>
  )
}
