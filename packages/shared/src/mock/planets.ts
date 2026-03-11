import type { Planet } from '../types/planet'

export const mockPlanets: Planet[] = [
  { id: 'bts', name: 'BTS', artistId: 'artist-bts', fpi: 85, totalPop: 1_250_000, orbitIndex: 0, color: '#7B2FF2', isEclipsed: false, eclipseEndsAt: null },
  { id: 'blackpink', name: 'BLACKPINK', artistId: 'artist-bp', fpi: 72, totalPop: 980_000, orbitIndex: 1, color: '#FF2D78', isEclipsed: false, eclipseEndsAt: null },
  { id: 'newjeans', name: 'NewJeans', artistId: 'artist-nj', fpi: 65, totalPop: 720_000, orbitIndex: 2, color: '#00D4AA', isEclipsed: false, eclipseEndsAt: null },
  { id: 'stray-kids', name: 'Stray Kids', artistId: 'artist-skz', fpi: 58, totalPop: 650_000, orbitIndex: 3, color: '#FF6B35', isEclipsed: true, eclipseEndsAt: new Date(Date.now() + 30 * 60 * 1000) },
  { id: 'aespa', name: 'aespa', artistId: 'artist-aespa', fpi: 45, totalPop: 420_000, orbitIndex: 4, color: '#C4B5FD', isEclipsed: false, eclipseEndsAt: null },
]
