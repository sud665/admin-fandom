import type { Boost } from '../types/boost'

export const mockRecentBoosts: Boost[] = [
  { id: 'boost-001', userId: 'user-042', userName: 'PurpleArmy_KR', planetId: 'bts', popAmount: 5000, isSuper: true, createdAt: new Date(Date.now() - 10_000) },
  { id: 'boost-002', userId: 'user-088', userName: 'BLINK_Global', planetId: 'blackpink', popAmount: 200, isSuper: false, createdAt: new Date(Date.now() - 30_000) },
]
