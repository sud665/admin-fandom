'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const serviceLinks = [
  { label: 'Galaxy', href: '/galaxy' },
  { label: '퀘스트', href: '/home' },
  { label: '아카이브', href: '/archive' },
  { label: 'K-INSIDE', href: '/kinside' },
]

const supportLinks = [
  { label: '도움말', href: '#' },
  { label: '문의하기', href: '#' },
  { label: 'FAQ', href: '#' },
]

const legalLinks = [
  { label: '이용약관', href: '#' },
  { label: '개인정보처리방침', href: '#' },
  { label: '쿠키 정책', href: '#' },
]

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="text-white/30 transition-colors hover:text-white/60"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </a>
  )
}

export default function CTASection() {
  const sectionRef = useScrollReveal<HTMLElement>()

  const handleScrollToTop = () => {
    const container = document.querySelector('main')
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal relative flex h-dvh snap-start snap-always flex-col overflow-hidden"
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

      {/* Overlay — top lighter, bottom darker for footer readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/90" />

      {/* CTA Content — centered vertically in remaining space */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
          팬덤의 새로운 우주가
          <br />
          열립니다
        </h2>

        <p className="mb-10 text-base text-white/70 sm:text-lg md:text-xl">
          지금 바로 당신만의 갤럭시에 합류하세요
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/galaxy"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] px-8 py-4 text-base font-semibold text-white shadow-[0_0_32px_rgba(123,47,242,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_48px_rgba(123,47,242,0.6)] active:scale-100 sm:text-lg"
          >
            지금 시작하기
          </Link>

          <button
            type="button"
            onClick={handleScrollToTop}
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 active:bg-white/5 sm:text-lg"
          >
            더 알아보기
          </button>
        </div>
      </div>

      {/* Footer — pinned to bottom */}
      <footer className="relative z-10 border-t border-white/10 px-6 pb-6 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo & tagline */}
            <div>
              <p className="text-sm font-semibold text-white/50">Fandom Galaxy</p>
              <p className="text-xs text-white/25">차세대 시네마틱 글로벌 팬덤 플랫폼</p>
            </div>

            {/* Links — hidden on mobile */}
            <nav className="hidden items-center gap-6 md:flex">
              {[...serviceLinks, ...legalLinks].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-white/30 transition-colors hover:text-white/60"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social + Copyright */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <SocialIcon
                  label="X (Twitter)"
                  path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
                <SocialIcon
                  label="Instagram"
                  path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                />
                <SocialIcon
                  label="YouTube"
                  path="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </div>
              <span className="text-[10px] text-white/20">&copy; 2026 Fandom Galaxy</span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
