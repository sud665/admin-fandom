import type { Quest, UserQuest } from '../types/quest'

export const mockQuests: Quest[] = [
  { id: 'quest-walk', title: '오늘의 걸음수', type: 'daily', category: 'walk', requirement: 5000, rewardPop: 50, adMultiplier: 3, isActive: true },
  { id: 'quest-stream', title: '음원 스밍 미션', type: 'daily', category: 'stream', requirement: 300, rewardPop: 30, adMultiplier: 3, isActive: true },
  { id: 'quest-checkin', title: '출석 체크', type: 'daily', category: 'checkin', requirement: 1, rewardPop: 10, adMultiplier: 3, isActive: true },
  { id: 'quest-emergency', title: '긴급! 1시간 내 10만 POP', type: 'emergency', category: 'special', requirement: 100_000, rewardPop: 500, adMultiplier: 1, isActive: true },
]

export const mockUserQuests: UserQuest[] = [
  { id: 'user-001_quest-walk_2026-03-11', userId: 'user-001', questId: 'quest-walk', progress: 3200, status: 'active', completedAt: null },
  { id: 'user-001_quest-checkin_2026-03-11', userId: 'user-001', questId: 'quest-checkin', progress: 1, status: 'completed', completedAt: new Date() },
]
