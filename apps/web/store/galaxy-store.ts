import { create } from 'zustand'
import type { Planet, Boost } from '@fandom/shared'
import { mockPlanets } from '@fandom/shared'

interface GalaxyState {
  planets: Planet[]
  activeBoost: Boost | null
  isEclipseWarning: boolean
  triggerEclipse: (planetId: string) => void
  resolveEclipse: (planetId: string) => void
  triggerSuperBoost: (boost: Boost) => void
  clearBoost: () => void
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
  planets: mockPlanets,
  activeBoost: null,
  isEclipseWarning: mockPlanets.some((p) => p.isEclipsed),

  triggerEclipse: (planetId) =>
    set((state) => ({
      planets: state.planets.map((p) =>
        p.id === planetId
          ? { ...p, isEclipsed: true, eclipseEndsAt: new Date(Date.now() + 60 * 60 * 1000) }
          : p
      ),
      isEclipseWarning: true,
    })),

  resolveEclipse: (planetId) =>
    set((state) => ({
      planets: state.planets.map((p) =>
        p.id === planetId ? { ...p, isEclipsed: false, eclipseEndsAt: null } : p
      ),
      isEclipseWarning: state.planets.some((p) => p.id !== planetId && p.isEclipsed),
    })),

  triggerSuperBoost: (boost) => set({ activeBoost: boost }),
  clearBoost: () => set({ activeBoost: null }),
}))
