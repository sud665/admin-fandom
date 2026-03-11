export type UserTier = 'glass' | 'gold' | 'obsidian'

export interface User {
  id: string
  displayName: string
  email: string
  tier: UserTier
  totalPop: number
  totalSteps: number
  totalFeeds: number
  campaignCount: number
  isPremium: boolean
  createdAt: Date
}

export interface WalletTransaction {
  id: string
  userId: string
  amount: number
  type: 'earn' | 'spend' | 'refund'
  source: 'walk' | 'stream' | 'ad' | 'iap' | 'quest' | 'boost' | 'bounty'
  createdAt: Date
}
