'use client'

import { Instagram, Twitter, Youtube, ChevronDown } from 'lucide-react'

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
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Instagram className="w-4 h-4 text-gray-400" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Twitter className="w-4 h-4 text-gray-400" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Youtube className="w-4 h-4 text-gray-400" />
            </a>
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
