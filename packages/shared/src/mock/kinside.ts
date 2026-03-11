import type { KInsideQuestion } from '../types/kinside'

export const mockKInsideQuestions: KInsideQuestion[] = [
  {
    id: 'q-001',
    authorId: 'user-042',
    title: 'BTS 멤버별 솔로 앨범 발매일 총정리해주실 분?',
    body: '각 멤버의 솔로 앨범 발매일과 타이틀곡을 정리하고 싶은데, 최신 정보까지 포함해서 알려주실 분 계신가요?',
    bountyPop: 50,
    status: 'answered',
    acceptedAnswerId: 'a-001',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'q-002',
    authorId: 'user-088',
    title: '해외에서 K-POP 콘서트 티켓 예매하는 방법?',
    body: '미국에서 한국 콘서트 티켓을 예매하고 싶은데, 인터파크나 멜론 티켓 외국인도 사용 가능한가요? 꿀팁 공유 부탁드립니다.',
    bountyPop: 200,
    status: 'open',
    acceptedAnswerId: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'q-003',
    authorId: 'user-015',
    title: '팬덤 용어 정리해주실 분 있나요?',
    body: '입덕한 지 얼마 안 됐는데 총공, 스밍, 컴백, 뮤뱅 1위 조건 등 용어가 너무 많아요. 초보 팬을 위한 용어 정리 부탁드려요!',
    bountyPop: 100,
    status: 'open',
    acceptedAnswerId: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'q-004',
    authorId: 'user-033',
    title: 'aespa 월드투어 서울 공연 세트리 공유',
    body: '지난 주말 aespa 콘서트 다녀왔는데 세트리 기억나시는 분?',
    bountyPop: 30,
    status: 'answered',
    acceptedAnswerId: 'a-004',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]
