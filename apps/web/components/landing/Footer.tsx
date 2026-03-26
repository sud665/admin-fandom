'use client'

import { ChevronDown } from 'lucide-react'

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a href="#" aria-label={label} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
        <path d={path} />
      </svg>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05050a] pt-16 pb-8 px-6 sm:px-12">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left: Logo + Address */}
        <div>
          <div className="font-bold text-lg tracking-tighter flex items-center gap-2 mb-4">
            FANDOM GALAXY
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            9, Seolleung-ro 127-gil, Gangnam-gu, Seoul, Korea
            <br />
            서울특별시 강남구 선릉로127길 9
          </p>
        </div>

        {/* Right: Social + Family site */}
        <div className="flex flex-col items-start md:items-end gap-6">
          <div className="flex items-center gap-4">
            <SocialIcon
              label="Instagram"
              path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
            />
            <SocialIcon
              label="X (Twitter)"
              path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
            <SocialIcon
              label="YouTube"
              path="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
            <div className="ml-4 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-8 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-xs text-gray-400">패밀리 사이트</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1600px] mx-auto mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-600">
        <p>&copy;FANDOM GALAXY ENTERTAINMENT Corp. ALL RIGHTS RESERVED. Site by VSTORY.</p>
        <a href="#" className="hover:text-gray-400 transition-colors">
          개인정보처리방침
        </a>
      </div>
    </footer>
  )
}
