'use client'

import { useGalaxyStore } from '@/store/galaxy-store'
import { mockRecentBoosts } from '@fandom/shared'

export function DemoControls() {
  const { triggerEclipse, resolveEclipse, triggerSuperBoost } = useGalaxyStore()

  return (
    <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">
      <button
        onClick={() => triggerEclipse('newjeans')}
        className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-red-600"
      >
        Eclipse: NewJeans
      </button>
      <button
        onClick={() => resolveEclipse('stray-kids')}
        className="rounded-lg bg-green-600/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-green-600"
      >
        Resolve: Stray Kids
      </button>
      <button
        onClick={() => triggerSuperBoost(mockRecentBoosts[0])}
        className="rounded-lg bg-[var(--accent-purple)]/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-[var(--accent-purple)]"
      >
        Super Boost!
      </button>
    </div>
  )
}
