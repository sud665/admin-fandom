import type { Campaign } from '../types/campaign'

export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    title: 'BTS 지민 생일 전광판 광고',
    creatorId: 'user-042',
    planetId: 'bts',
    targetPop: 50_000,
    currentPop: 39_000,
    dDay: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // D-12
    status: 'active',
    resultImages: [],
    resultNote: '',
  },
  {
    id: 'campaign-002',
    title: 'BLACKPINK 팬미팅 커피차 서포트',
    creatorId: 'user-088',
    planetId: 'blackpink',
    targetPop: 30_000,
    currentPop: 30_000,
    dDay: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전 종료
    status: 'success',
    resultImages: ['/result-1.jpg', '/result-2.jpg'],
    resultNote: '성공적으로 팬미팅 현장에 커피차를 보냈습니다! 멤버들이 인스타에 인증샷을 올려줬어요 🎉',
  },
  {
    id: 'campaign-003',
    title: 'NewJeans 버스 광고 캠페인',
    creatorId: 'user-015',
    planetId: 'newjeans',
    targetPop: 100_000,
    currentPop: 25_000,
    dDay: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // D-3
    status: 'active',
    resultImages: [],
    resultNote: '',
  },
  {
    id: 'campaign-004',
    title: 'Stray Kids 데뷔 기념 지하철 광고',
    creatorId: 'user-099',
    planetId: 'stray-kids',
    targetPop: 80_000,
    currentPop: 15_000,
    dDay: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전 종료
    status: 'failed',
    resultImages: [],
    resultNote: '',
  },
]
