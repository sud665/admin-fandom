# Phase 1: 핵심 루프 MVP 설계

## 목표
POP 재화 시스템의 핵심 루프(Earn → Feed → Defend)가 실제로 동작하는 React Native Expo 앱을 개발하여 iOS/Android 배포.

## 아키텍처

```
┌─────────────────────────────────────┐
│         React Native Expo App       │
│                                     │
│  ┌───────────┐  ┌───────────────┐   │
│  │ Native UI │  │  WebView      │   │
│  │ HOME/MY   │  │  (R3F Galaxy) │   │
│  │ Tabs      │  │  ← postMsg → │   │
│  └─────┬─────┘  └───────┬───────┘   │
│        │                │           │
│  ┌─────┴────────────────┴─────┐     │
│  │   packages/shared          │     │
│  │   (types, constants, utils)│     │
│  └─────────────┬──────────────┘     │
│                │                    │
│  ┌─────────────┴──────────────┐     │
│  │   packages/firebase        │     │
│  │   (Auth, Firestore, Fns)   │     │
│  └────────────────────────────┘     │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         Firebase Backend            │
│  Auth │ Firestore │ Cloud Functions │
└─────────────────────────────────────┘
```

## 기술 스택
- React Native Expo SDK 52 + Expo Router
- react-native-webview (3D 갤럭시 R3F 코드 재사용)
- Firebase Auth (Google/Apple 소셜 로그인)
- Firestore (실시간 데이터 동기화)
- Cloud Functions (이클립스 스케줄, POP 검증)
- expo-sensors (만보기)

## 개발 전략
- 핵심 루프 우선 (C전략): POP Earn → Feed → Defend 관통 구현
- RN 앱 먼저 (A전략): 웹 목업은 유지, 앱 중심 개발
- 3D는 WebView 재활용 (B전략): 기존 R3F 코드 postMessage 통신

## Phase 1 탭 범위
- GALAXY: WebView 3D + Zap 버튼 + 이클립스 실시간
- HOME: 만보기 퀘스트 + 출석 체크
- MY: ID 카드 + POP 잔액 + 통계
- ARCHIVE, K-INSIDE: Phase 2

## Firestore 스키마

### users/{uid}
- displayName, email, photoURL
- tier: 'glass' | 'gold' | 'obsidian'
- popBalance: number (현재 잔액)
- totalPopEarned: number (누적 획득)
- totalFeeds: number (누적 Zap)
- totalSteps: number (누적 걸음)
- isPremium: boolean
- createdAt, lastLoginAt
- **서브컬렉션** transactions/{txId}: { amount, type, source, createdAt }

### planets/{planetId}
- name, artistId, color
- fpi: number (0-100)
- totalPop: number
- orbitIndex: number
- isEclipsed: boolean
- eclipseStartedAt, eclipseEndsAt
- **서브컬렉션** feedHistory/{feedId}: { userId, amount, createdAt }

### eclipses/{eclipseId}
- planetId, startedAt, endsAt
- status: 'active' | 'defended' | 'failed'
- requiredPop: number
- currentDefensePop: number
- **서브컬렉션** defenders/

### quests/{questId}
- title, type, category, requirement, rewardPop, isActive

### userQuests/{uid}_{questId}
- progress, status, completedAt, claimedAt

## POP 재화 시스템

모든 POP 변동은 Firestore Transaction으로 원자적 처리.

- **Earn**: Cloud Function에서 검증 후 popBalance 증가 + tx 기록
- **Feed (Zap)**: popBalance 차감 + planet.totalPop 증가 + fpi 재계산
- **Defend**: Zap과 동일 + eclipse.currentDefensePop 증가, 임계 도달 시 자동 방어 성공

Security Rules로 클라이언트 직접 잔액 수정 차단.

## Cloud Functions

| 함수 | 트리거 | 역할 |
|------|--------|------|
| scheduleEclipse | Pub/Sub 매 6시간 | 랜덤 행성 이클립스 발생 |
| resolveEclipse | Firestore onUpdate | 방어 성공/실패 판정 |
| completeQuest | Callable | 퀘스트 완료 검증 + POP 지급 |
| dailyCheckin | Callable | 출석 중복 체크 + POP 지급 |
| syncSteps | Callable | 걸음 수 검증 + 퀘스트 진행 |
| onUserCreate | Auth onCreate | users 문서 초기 생성 |

## 인증
- Firebase Auth + Google/Apple 소셜 로그인
- 첫 로그인 시 users/{uid} 자동 생성 (onUserCreate)

## Phase 2 (이후)
- ARCHIVE (크라우드 펀딩)
- K-INSIDE (지식인)
- YouTube 스밍 미션
- AdMob / IAP
- 프리미엄 구독
- 글로벌 부스트 앰플
- AI Daily Briefing
