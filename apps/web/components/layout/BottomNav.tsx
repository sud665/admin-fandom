'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'GALAXY', icon: '🌌' },
  { href: '/home', label: 'HOME', icon: '⚡' },
  { href: '/archive', label: 'ARCHIVE', icon: '📦' },
  { href: '/kinside', label: 'K-INSIDE', icon: '💬' },
  { href: '/mypage', label: 'MY', icon: '👤' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[var(--bg-secondary)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md">
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? 'text-[var(--accent-purple)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
