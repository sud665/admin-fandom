'use client'

import { useGalaxyStore } from '@/store/galaxy-store'

export function EclipseOverlay() {
  const { planets, isEclipseWarning } = useGalaxyStore()
  const eclipsedPlanets = planets.filter((p) => p.isEclipsed)

  if (!isEclipseWarning || eclipsedPlanets.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-0 animate-pulse shadow-[inset_0_0_80px_rgba(255,0,0,0.3)]" />
      <div className="pointer-events-auto absolute left-0 right-0 top-0 bg-red-900/80 px-4 py-2 text-center backdrop-blur-sm">
        <p className="animate-pulse text-sm font-bold text-red-200">
          ⚠ ECLIPSE WARNING — {eclipsedPlanets.map((p) => p.name).join(', ')} under attack!
        </p>
      </div>
    </div>
  )
}
