export interface Campaign {
  id: string
  title: string
  creatorId: string
  planetId: string
  targetPop: number
  currentPop: number
  dDay: Date
  status: 'active' | 'success' | 'failed' | 'refunded'
  resultImages: string[]
  resultNote: string
}
