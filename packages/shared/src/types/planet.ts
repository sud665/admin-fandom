export interface Planet {
  id: string
  name: string
  artistId: string
  fpi: number // 0~100
  totalPop: number
  orbitIndex: number
  color: string
  isEclipsed: boolean
  eclipseEndsAt: Date | null
}

export type PlanetTexture = 'rock' | 'metal' | 'gem' | 'solar'

export function getPlanetTexture(fpi: number): PlanetTexture {
  if (fpi >= 90) return 'solar'
  if (fpi >= 60) return 'gem'
  if (fpi >= 30) return 'metal'
  return 'rock'
}
