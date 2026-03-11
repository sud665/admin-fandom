import type { User } from '../types/user'

export const mockCurrentUser: User = {
  id: 'user-001',
  displayName: 'GalaxyFan',
  email: 'fan@example.com',
  tier: 'gold',
  popBalance: 25_000,
  totalPopEarned: 180_000,
  totalSteps: 1_200_000,
  totalFeeds: 18_000,
  campaignCount: 12,
  isPremium: false,
  createdAt: new Date('2025-06-01'),
}
