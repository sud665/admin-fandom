'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParallax } from '@/hooks/useParallax'

export default function HeroSection() {
  const { ref, progress } = useParallax()
  const bgY = (progress - 0.5) * 80
  const textY = (progress - 0.5) * -40
  const phoneY = (progress - 0.5) * -60
  const phoneRotate = 6 + (progress - 0.5) * 4
  const opacity = 1 - Math.max(0, (progress - 0.7) * 3.3)

  return (
    <section ref={ref} className="relative flex h-dvh snap-start snap-always flex-col overflow-hidden">
      {/* Parallax BG */}
      <div className="absolute inset-0 will-change-transform" style={{ transform: `translateY(${bgY}px) scale(1.1)` }}>
        <Image src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80" alt="우주 갤럭시 배경" fill priority className="object-cover" sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0f]" />

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-8 md:px-12">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Fandom Galaxy" width={28} height={28} className="drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]" />
          <p className="text-xs font-semibold tracking-widest text-white/40">FANDOM GALAXY</p>
        </div>
        <Link href="/galaxy" className="text-xs text-white/40 transition-colors hover:text-white/70">로그인</Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center gap-12 px-8 xl:gap-20">
        {/* Left text with parallax */}
        <div className="max-w-xl will-change-transform" style={{ transform: `translateY(${textY}px)`, opacity }}>
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#00D4AA]" />
            <p className="text-xs font-medium tracking-[0.25em] text-[#00D4AA] sm:text-sm">CINEMATIC FANDOM PLATFORM</p>
          </div>

          {/* Word-by-word reveal title */}
          <h1 className="mb-8 text-5xl font-extrabold leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl">
            {['당신만의', ' '].map((word, i) => (
              <span key={i} className="inline-block animate-[wordReveal_0.6s_ease-out_both]" style={{ animationDelay: `${i * 200}ms` }}>
                {word === ' ' ? '\u00A0' : <span className="text-white">{word}</span>}
              </span>
            ))}
            <br />
            {['팬덤', ' ', '우주'].map((word, i) => (
              <span key={i} className="inline-block animate-[wordReveal_0.6s_ease-out_both]" style={{ animationDelay: `${(i + 2) * 200}ms` }}>
                {word === ' ' ? '\u00A0' : (
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #F97316 100%)' }}>
                    {word}
                  </span>
                )}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-md text-base leading-relaxed text-white/60 sm:text-lg animate-[wordReveal_0.6s_ease-out_both]" style={{ animationDelay: '800ms' }}>
            좋아하는 아티스트를 중심으로 펼쳐지는 시네마틱 갤럭시. 퀘스트를 완수하고, 팬덤의 궤도를 넓혀가세요.
          </p>

          {/* Glow border CTA */}
          <div className="animate-[wordReveal_0.6s_ease-out_both]" style={{ animationDelay: '1000ms' }}>
            <div className="group relative inline-block">
              {/* Glow blur behind */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] opacity-40 blur-lg transition-all duration-300 group-hover:opacity-70 group-hover:blur-xl" />
              {/* Gradient border wrapper */}
              <div className="relative rounded-full bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] p-[1.5px]">
                <Link href="/galaxy" className="flex items-center gap-3 rounded-full bg-[#0a0a0f] px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 group-hover:bg-[#0a0a0f]/80 sm:text-base">
                  우주로 입장하기
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Phone with parallax */}
        <div className="hidden lg:block">
          <div className="relative will-change-transform" style={{ transform: `rotate(${phoneRotate}deg) translateY(${phoneY}px)` }}>
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-[#7B2FF2]/20 via-[#EC4899]/10 to-transparent blur-3xl" />
            <div className="relative w-[300px] overflow-hidden rounded-[2rem] border-[2px] border-white/10 bg-black shadow-2xl shadow-purple-500/10 xl:w-[320px]">
              <div className="flex items-center justify-between bg-black px-5 pb-1 pt-3">
                <span className="text-[10px] font-medium text-white/40">9:41</span>
                <span className="text-[10px] text-white/30">●●●</span>
              </div>
              <iframe src="/galaxy" title="Fandom Galaxy 앱 미리보기" className="h-[560px] w-full border-0 xl:h-[620px]" style={{ pointerEvents: 'none' }} />
              <div className="flex justify-center bg-black pb-2 pt-1">
                <span className="h-1 w-28 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="absolute -left-8 bottom-24 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl" style={{ transform: `rotate(${-phoneRotate}deg)` }}>
              <p className="text-xs font-semibold text-white">⚡ 3D Galaxy</p>
              <p className="text-[10px] text-white/40">실시간 인터랙티브</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 h-8" />
    </section>
  )
}
