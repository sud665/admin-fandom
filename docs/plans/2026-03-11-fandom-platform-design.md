# 차세대 글로벌 팬덤 플랫폼 — 설계 문서

## 1. 프로젝트 개요

성취 중심의 글로벌 팬덤 플랫폼 MVP. 팬덤의 연대와 위기 극복을 핵심 경험으로 하는 시네마틱 글로벌 팬덤 앱.

**목적**: 위시켓 지원을 위한 포트폴리오용 목업(Next.js PWA) + 실제 RN 프로젝트 구조 세팅

## 2. 프로젝트 구조

```
fandom-platform/
├── apps/
│   ├── web/                    # Next.js 15 PWA (목업 + 마케팅 웹)
│   │   ├── app/
│   │   │   ├── (galaxy)/       # GALAXY 메인 — 3D 은하계 뷰
│   │   │   ├── (home)/         # HOME — 활동센터 (스켈레톤)
│   │   │   ├── (archive)/      # ARCHIVE — 펀딩 (스켈레톤)
│   │   │   ├── (kinside)/      # K-INSIDE (스켈레톤)
│   │   │   └── (mypage)/       # MY PAGE (스켈레톤)
│   │   ├── components/
│   │   │   └── galaxy/         # 3D 은하계 전용 컴포넌트
│   │   └── public/
│   │       └── manifest.json   # PWA 매니페스트
│   │
│   └── mobile/                 # React Native Expo
│       ├── app/                # Expo Router
│       │   ├── (tabs)/         # 하단 탭 네비게이션
│       │   └── (auth)/         # 로그인/회원가입
│       └── components/
│
├── packages/
│   ├── shared/                 # 공유 타입, 상수, 유틸
│   │   ├── types/
│   │   │   ├── planet.ts
│   │   │   ├── user.ts
│   │   │   ├── quest.ts
│   │   │   └── campaign.ts
│   │   ├── constants/
│   │   │   ├── tiers.ts
│   │   │   └── fever.ts
│   │   └── mock/               # Mock 데이터
│   │
│   ├── firebase/               # Firebase 래퍼
│   │   ├── client.ts
│   │   ├── collections/
│   │   ├── functions/
│   │   └── emulator.ts
│   │
│   └── ui/                     # 공유 UI 컴포넌트
│       ├── galaxy/             # R3F 3D 컴포넌트
│       │   ├── Planet.tsx
│       │   ├── Orbit.tsx
│       │   ├── Eclipse.tsx
│       │   └── GalaxyScene.tsx
│       └── common/
│
├── turbo.json
├── package.json
└── firebase.json
```

## 3. 기술 스택

| 카테고리 | 기술 | 이유 |
|---------|------|------|
| 모노레포 | Turborepo + pnpm | 빌드 캐시, 병렬 실행 |
| 프론트(웹) | Next.js 15 (App Router) | PWA, SSR, Vercel 배포 |
| 프론트(앱) | React Native Expo (SDK 52) | Expo Router, EAS Build |
| 3D 렌더링 | React Three Fiber + Drei | 선언적 Three.js |
| 3D 후처리 | @react-three/postprocessing | Bloom, 발광 효과 |
| 상태관리 | Zustand | 가볍고 웹/RN 공유 가능 |
| 스타일(웹) | Tailwind CSS 4 | 유틸리티 퍼스트 |
| 스타일(앱) | Nativewind 4 | RN에서 Tailwind 문법 |
| 애니메이션(앱) | react-native-reanimated | 네이티브 스레드 애니메이션 |
| 백엔드 | Firebase 11 | Firestore, Auth, Functions |
| PWA | next-pwa (serwist) | 서비스워커, 오프라인 |

## 4. Firebase 전략

모든 Firebase 설정은 환경변수로 관리. 목업 단계에서는 mock 데이터로 동작.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_USE_EMULATOR=true
```

## 5. 3D GALAXY 뷰 설계

### R3F 컴포넌트 구조
```
GalaxyScene (Canvas)
├── CameraController        — 드래그/줌 카메라 조작
├── StarField               — 배경 별들 (파티클)
├── Sun                     — 중앙 발광체
├── OrbitalSystem           — 궤도 시스템
│   ├── Orbit               — 궤도 원형 라인
│   └── Planet              — 행성 (FPI 기반 크기/텍스처)
│       ├── PlanetMesh      — 구체 + 셰이더
│       ├── PlanetLabel     — 아티스트명 HTML 오버레이
│       └── PlanetGlow      — 외곽 발광 효과
├── EclipseEffect           — 이클립스 시 붉은 경고광
└── FlashNotification       — 슈퍼부스트 시 섬광 효과
```

### 행성 텍스처 (FPI 기반)
| FPI 범위 | 표면 | 셰이더 |
|---------|------|--------|
| 0-30% | 암석 (어두운 회색) | Lambert |
| 30-60% | 금속 (은빛 반사) | Standard + metalness |
| 60-90% | 보석 (프리즘 굴절) | Physical + iridescence |
| 90-100% | 태양급 (자체 발광) | Emissive + bloom |

## 6. 데이터 모델 (Firestore)

### users/{userId}
- displayName, email, tier ('glass'|'gold'|'obsidian')
- totalPop, totalSteps, totalFeeds, campaignCount
- isPremium, createdAt

### users/{userId}/wallet/{txId}
- amount, type ('earn'|'spend'|'refund'), source, createdAt

### planets/{planetId}
- name, artistId, fpi (0~100), totalPop
- orbitIndex, color, isEclipsed, eclipseEndsAt

### quests/{questId}
- title, type ('daily'|'emergency'), category
- requirement, rewardPop, adMultiplier, isActive

### userQuests/{userId}_{questId}_{date}
- userId, questId, progress, status, completedAt

### campaigns/{campaignId}
- title, creatorId, planetId, targetPop, currentPop
- dDay, status ('active'|'success'|'failed'|'refunded')
- resultImages, resultNote

### boosts/{boostId}
- userId, planetId, popAmount, isSuper, createdAt

### kinsideQuestions/{questionId}
- authorId, title, body, bountyPop
- status ('open'|'answered'), acceptedAnswerId, createdAt

## 7. 목업 범위

### 구현 (apps/web)
| 화면 | 완성도 | 설명 |
|------|--------|------|
| GALAXY 3D 뷰 | 100% | 행성 궤도, FPI 크기/텍스처, 카메라 조작 |
| 이클립스 이벤트 | 100% | 붉은 경고광, 행성 축소 애니메이션 |
| 슈퍼부스트 섬광 | 80% | 플래시 + 공지 배너 |
| 하단 탭 네비게이션 | 100% | 5개 탭 전환 |
| HOME 탭 | 30% | 퀘스트 카드 UI만 |
| MY PAGE | 30% | ID 카드 비주얼만 |
| ARCHIVE, K-INSIDE | 10% | Coming Soon 플레이스홀더 |

### 미구현
- 실제 로그인/회원가입, 걸음수 연동, YouTube API, 결제, 실시간 Firestore

### RN 프로젝트 (apps/mobile)
- Expo Router 탭 구조, 빈 화면 5개, Firebase 연결 코드 (환경변수)

## 8. 배포

- **웹**: Vercel 자동 배포 (main push)
- **데이터**: 하드코딩 mock 데이터 (Firebase 불필요)

## 9. Mock 데이터

```ts
export const mockPlanets = [
  { id: 'bts', name: 'BTS', fpi: 85, orbitIndex: 0, color: '#7B2FF2' },
  { id: 'blackpink', name: 'BLACKPINK', fpi: 72, orbitIndex: 1, color: '#FF2D78' },
  { id: 'newjeans', name: 'NewJeans', fpi: 65, orbitIndex: 2, color: '#00D4AA' },
  { id: 'stray-kids', name: 'Stray Kids', fpi: 58, orbitIndex: 3, color: '#FF6B35' },
  { id: 'aespa', name: 'aespa', fpi: 45, orbitIndex: 4, color: '#C4B5FD' },
]
```
