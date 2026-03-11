export interface Quest {
  id: string
  title: string
  type: 'daily' | 'emergency'
  category: 'walk' | 'stream' | 'checkin' | 'special'
  requirement: number
  rewardPop: number
  adMultiplier: number
  isActive: boolean
}

export interface UserQuest {
  id: string
  userId: string
  questId: string
  progress: number
  status: 'active' | 'completed' | 'claimed'
  completedAt: Date | null
}
