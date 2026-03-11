export interface KInsideQuestion {
  id: string
  authorId: string
  title: string
  body: string
  bountyPop: number
  status: 'open' | 'answered'
  acceptedAnswerId: string | null
  createdAt: Date
}
