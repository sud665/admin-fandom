import type { UserTier } from '../types/user'

export const TIER_THRESHOLDS: Record<UserTier, number> = {
  glass: 0,
  gold: 10000,
  obsidian: 50000,
}

export function getUserTier(totalFeeds: number): UserTier {
  if (totalFeeds >= TIER_THRESHOLDS.obsidian) return 'obsidian'
  if (totalFeeds >= TIER_THRESHOLDS.gold) return 'gold'
  return 'glass'
}
