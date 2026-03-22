import Link from 'next/link'

const serviceLinks = [
  { label: 'Galaxy', href: '/galaxy' },
  { label: '퀘스트', href: '/quest' },
  { label: '아카이브', href: '/archive' },
  { label: 'K-INSIDE', href: '/k-inside' },
]

const supportLinks = [
  { label: '도움말', href: '/help' },
  { label: '문의하기', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
]

const legalLinks = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '쿠키 정책', href: '/cookies' },
]

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="text-white/40 transition-colors hover:text-white/70"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="flex h-dvh snap-start snap-always flex-col justify-end bg-[#08080d] px-6 pb-8 pt-16 sm:px-10 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        {/* Top */}
        <div className="mb-12 flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Logo & tagline */}
          <div className="max-w-xs">
            <p className="mb-2 text-xl font-bold text-white">Fandom Galaxy</p>
            <p className="text-sm leading-relaxed text-white/40">
              차세대 시네마틱 글로벌 팬덤 플랫폼
            </p>
          </div>

          {/* Link columns — hidden on mobile */}
          <div className="hidden gap-16 md:flex">
            {/* 서비스 */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white/70">
                서비스
              </h3>
              <ul className="flex flex-col gap-2">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 지원 */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white/70">지원</h3>
              <ul className="flex flex-col gap-2">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 법적 고지 */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white/70">
                법적 고지
              </h3>
              <ul className="flex flex-col gap-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 border-t border-white/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; 2026 Fandom Galaxy. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {/* X / Twitter */}
            <SocialIcon
              label="X (Twitter)"
              path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
            {/* Instagram */}
            <SocialIcon
              label="Instagram"
              path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
            />
            {/* YouTube */}
            <SocialIcon
              label="YouTube"
              path="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
