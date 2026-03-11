# Fandom Galaxy Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 위시켓 포트폴리오용 3D 팬덤 은하계 목업(Next.js PWA)을 Vercel에 배포하고, RN Expo 프로젝트 구조를 세팅한다.

**Architecture:** Turborepo + pnpm 모노레포. apps/web(Next.js 15 PWA)에서 React Three Fiber로 3D 은하계 뷰를 구현하고, apps/mobile(Expo)에서 탭 구조를 세팅한다. packages/shared에서 타입과 mock 데이터를 공유한다.

**Tech Stack:** Next.js 15, React Three Fiber, Drei, Tailwind CSS 4, Zustand, Expo SDK 52, Expo Router, Firebase 11, Turborepo, pnpm

---

## Phase 1: 모노레포 기반 세팅

### Task 1: 모노레포 루트 초기화

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`
- Create: `.npmrc`

**Step 1: pnpm workspace 루트 초기화**

```bash
cd /Users/max/Desktop/wishket/admin-fandom
```

`package.json`:
```json
{
  "name": "fandom-platform",
  "private": true,
  "packageManager": "pnpm@10.32.0",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "clean": "turbo clean"
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "typescript": "^5.7.0"
  }
}
```

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

`.npmrc`:
```
auto-install-peers=true
strict-peer-dependencies=false
```

`.gitignore`:
```
node_modules
.next
.expo
dist
.turbo
.env
.env.local
*.tsbuildinfo
```

**Step 2: 설치 및 확인**

Run: `pnpm install`
Expected: turbo, typescript 설치 완료

**Step 3: 커밋**

```bash
git add -A
git commit -m "chore: 모노레포 루트 초기화 (Turborepo + pnpm)"
```

---

### Task 2: shared 패키지 — 타입, 상수, Mock 데이터

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/types/planet.ts`
- Create: `packages/shared/src/types/user.ts`
- Create: `packages/shared/src/types/quest.ts`
- Create: `packages/shared/src/types/campaign.ts`
- Create: `packages/shared/src/types/boost.ts`
- Create: `packages/shared/src/types/kinside.ts`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/constants/tiers.ts`
- Create: `packages/shared/src/constants/eclipse.ts`
- Create: `packages/shared/src/constants/index.ts`
- Create: `packages/shared/src/mock/planets.ts`
- Create: `packages/shared/src/mock/users.ts`
- Create: `packages/shared/src/mock/quests.ts`
- Create: `packages/shared/src/mock/boosts.ts`
- Create: `packages/shared/src/mock/index.ts`
- Create: `packages/shared/src/index.ts`

**Step 1: 패키지 설정**

`packages/shared/package.json`:
```json
{
  "name": "@fandom/shared",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

`packages/shared/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 2: 타입 정의**

`packages/shared/src/types/planet.ts`:
```ts
export interface Planet {
  id: string
  name: string
  artistId: string
  fpi: number // 0~100
  totalPop: number
  orbitIndex: number
  color: string
  isEclipsed: boolean
  eclipseEndsAt: Date | null
}

export type PlanetTexture = 'rock' | 'metal' | 'gem' | 'solar'

export function getPlanetTexture(fpi: number): PlanetTexture {
  if (fpi >= 90) return 'solar'
  if (fpi >= 60) return 'gem'
  if (fpi >= 30) return 'metal'
  return 'rock'
}
```

`packages/shared/src/types/user.ts`:
```ts
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
```

`packages/shared/src/types/quest.ts`:
```ts
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
  id: string // {userId}_{questId}_{date}
  userId: string
  questId: string
  progress: number
  status: 'active' | 'completed' | 'claimed'
  completedAt: Date | null
}
```

`packages/shared/src/types/campaign.ts`:
```ts
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
```

`packages/shared/src/types/boost.ts`:
```ts
export interface Boost {
  id: string
  userId: string
  userName: string
  planetId: string
  popAmount: number
  isSuper: boolean
  createdAt: Date
}
```

`packages/shared/src/types/kinside.ts`:
```ts
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
```

`packages/shared/src/types/index.ts`:
```ts
export * from './planet'
export * from './user'
export * from './quest'
export * from './campaign'
export * from './boost'
export * from './kinside'
```

**Step 3: 상수 정의**

`packages/shared/src/constants/tiers.ts`:
```ts
import type { UserTier } from '../types/user'

export const TIER_THRESHOLDS: Record<UserTier, number> = {
  glass: 0,
  gold: 10000,
  obsidian: 50000,
}

export function getUserTier(totalFeeds: number): UserTier {
  if (totalFeeds >= TIER_THRESHOLDS.obsidian) return 'obsidian'
  if (totalFeeds >= TIER_THRESHOLDS.gold) return 'gold'
  return 'glass'
}
```

`packages/shared/src/constants/eclipse.ts`:
```ts
export const ECLIPSE_CONFIG = {
  minIntervalHours: 24,
  maxIntervalHours: 72,
  durationMinutes: 60,
  shrinkRatePerMinute: 0.5, // FPI 감소율
  defensePopMultiplier: 2, // 방어 시 POP 효과 2배
} as const
```

`packages/shared/src/constants/index.ts`:
```ts
export * from './tiers'
export * from './eclipse'
```

**Step 4: Mock 데이터**

`packages/shared/src/mock/planets.ts`:
```ts
import type { Planet } from '../types/planet'

export const mockPlanets: Planet[] = [
  {
    id: 'bts',
    name: 'BTS',
    artistId: 'artist-bts',
    fpi: 85,
    totalPop: 1_250_000,
    orbitIndex: 0,
    color: '#7B2FF2',
    isEclipsed: false,
    eclipseEndsAt: null,
  },
  {
    id: 'blackpink',
    name: 'BLACKPINK',
    artistId: 'artist-bp',
    fpi: 72,
    totalPop: 980_000,
    orbitIndex: 1,
    color: '#FF2D78',
    isEclipsed: false,
    eclipseEndsAt: null,
  },
  {
    id: 'newjeans',
    name: 'NewJeans',
    artistId: 'artist-nj',
    fpi: 65,
    totalPop: 720_000,
    orbitIndex: 2,
    color: '#00D4AA',
    isEclipsed: false,
    eclipseEndsAt: null,
  },
  {
    id: 'stray-kids',
    name: 'Stray Kids',
    artistId: 'artist-skz',
    fpi: 58,
    totalPop: 650_000,
    orbitIndex: 3,
    color: '#FF6B35',
    isEclipsed: true,
    eclipseEndsAt: new Date(Date.now() + 30 * 60 * 1000), // 30분 후 종료
  },
  {
    id: 'aespa',
    name: 'aespa',
    artistId: 'artist-aespa',
    fpi: 45,
    totalPop: 420_000,
    orbitIndex: 4,
    color: '#C4B5FD',
    isEclipsed: false,
    eclipseEndsAt: null,
  },
]
```

`packages/shared/src/mock/users.ts`:
```ts
import type { User } from '../types/user'

export const mockCurrentUser: User = {
  id: 'user-001',
  displayName: 'GalaxyFan',
  email: 'fan@example.com',
  tier: 'gold',
  totalPop: 25_000,
  totalSteps: 1_200_000,
  totalFeeds: 18_000,
  campaignCount: 12,
  isPremium: false,
  createdAt: new Date('2025-06-01'),
}
```

`packages/shared/src/mock/quests.ts`:
```ts
import type { Quest, UserQuest } from '../types/quest'

export const mockQuests: Quest[] = [
  {
    id: 'quest-walk',
    title: '오늘의 걸음수',
    type: 'daily',
    category: 'walk',
    requirement: 5000,
    rewardPop: 50,
    adMultiplier: 3,
    isActive: true,
  },
  {
    id: 'quest-stream',
    title: '음원 스밍 미션',
    type: 'daily',
    category: 'stream',
    requirement: 300, // 초
    rewardPop: 30,
    adMultiplier: 3,
    isActive: true,
  },
  {
    id: 'quest-checkin',
    title: '출석 체크',
    type: 'daily',
    category: 'checkin',
    requirement: 1,
    rewardPop: 10,
    adMultiplier: 3,
    isActive: true,
  },
  {
    id: 'quest-emergency',
    title: '긴급! 1시간 내 10만 POP',
    type: 'emergency',
    category: 'special',
    requirement: 100_000,
    rewardPop: 500,
    adMultiplier: 1,
    isActive: true,
  },
]

export const mockUserQuests: UserQuest[] = [
  {
    id: 'user-001_quest-walk_2026-03-11',
    userId: 'user-001',
    questId: 'quest-walk',
    progress: 3200,
    status: 'active',
    completedAt: null,
  },
  {
    id: 'user-001_quest-checkin_2026-03-11',
    userId: 'user-001',
    questId: 'quest-checkin',
    progress: 1,
    status: 'completed',
    completedAt: new Date(),
  },
]
```

`packages/shared/src/mock/boosts.ts`:
```ts
import type { Boost } from '../types/boost'

export const mockRecentBoosts: Boost[] = [
  {
    id: 'boost-001',
    userId: 'user-042',
    userName: 'PurpleArmy_KR',
    planetId: 'bts',
    popAmount: 5000,
    isSuper: true,
    createdAt: new Date(Date.now() - 10_000),
  },
  {
    id: 'boost-002',
    userId: 'user-088',
    userName: 'BLINK_Global',
    planetId: 'blackpink',
    popAmount: 200,
    isSuper: false,
    createdAt: new Date(Date.now() - 30_000),
  },
]
```

`packages/shared/src/mock/index.ts`:
```ts
export * from './planets'
export * from './users'
export * from './quests'
export * from './boosts'
```

`packages/shared/src/index.ts`:
```ts
export * from './types'
export * from './constants'
export * from './mock'
```

**Step 5: 설치 및 타입 체크**

Run: `pnpm install && cd packages/shared && pnpm lint`
Expected: tsc 성공, 에러 없음

**Step 6: 커밋**

```bash
git add packages/shared
git commit -m "feat: shared 패키지 — 타입, 상수, mock 데이터"
```

---

### Task 3: firebase 패키지 — 환경변수 기반 래퍼

**Files:**
- Create: `packages/firebase/package.json`
- Create: `packages/firebase/tsconfig.json`
- Create: `packages/firebase/src/config.ts`
- Create: `packages/firebase/src/client.ts`
- Create: `packages/firebase/src/index.ts`
- Create: `.env.example`

**Step 1: 패키지 설정**

`packages/firebase/package.json`:
```json
{
  "name": "@fandom/firebase",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "firebase": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

**Step 2: Firebase 설정 (환경변수)**

`packages/firebase/src/config.ts`:
```ts
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  }
  return config
}

export function isEmulatorMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_EMULATOR === 'true'
}
```

`packages/firebase/src/client.ts`:
```ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { getFirebaseConfig, isEmulatorMode } from './config'

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

export function getApp(): FirebaseApp {
  if (!app) {
    const existing = getApps()
    app = existing.length > 0 ? existing[0] : initializeApp(getFirebaseConfig())
  }
  return app
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getApp())
    if (isEmulatorMode()) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
  }
  return db
}

export function getAuthInstance(): Auth {
  if (!auth) {
    auth = getAuth(getApp())
    if (isEmulatorMode()) {
      connectAuthEmulator(auth, 'http://localhost:9099')
    }
  }
  return auth
}
```

`packages/firebase/src/index.ts`:
```ts
export { getApp, getDb, getAuthInstance } from './client'
export { getFirebaseConfig, isEmulatorMode } from './config'
```

`.env.example` (프로젝트 루트):
```env
# Firebase 설정 — Firebase Console에서 복사
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# true = Firebase Emulator 사용, false = 실제 Firebase
NEXT_PUBLIC_USE_EMULATOR=true
```

**Step 3: 설치 및 타입 체크**

Run: `pnpm install && cd packages/firebase && pnpm lint`
Expected: 성공

**Step 4: 커밋**

```bash
git add packages/firebase .env.example
git commit -m "feat: firebase 패키지 — 환경변수 기반 래퍼"
```

---

## Phase 2: Next.js PWA 웹 앱 (목업)

### Task 4: Next.js 앱 초기화

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`
- Create: `apps/web/public/manifest.json`

**Step 1: Next.js 프로젝트 생성**

`apps/web/package.json`:
```json
{
  "name": "@fandom/web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@fandom/shared": "workspace:*",
    "@fandom/firebase": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.0"
  }
}
```

`apps/web/next.config.ts`:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@fandom/shared', '@fandom/firebase'],
}

export default nextConfig
```

`apps/web/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`apps/web/postcss.config.mjs`:
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
export default config
```

`apps/web/app/globals.css`:
```css
@import "tailwindcss";

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --accent-purple: #7B2FF2;
  --accent-pink: #FF2D78;
  --accent-cyan: #00D4AA;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

`apps/web/app/layout.tsx`:
```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fandom Galaxy',
  description: '차세대 시네마틱 글로벌 팬덤 플랫폼',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
```

`apps/web/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <h1 className="text-2xl font-bold text-[var(--accent-purple)]">
        Fandom Galaxy
      </h1>
    </main>
  )
}
```

`apps/web/public/manifest.json`:
```json
{
  "name": "Fandom Galaxy",
  "short_name": "FandomGalaxy",
  "description": "차세대 시네마틱 글로벌 팬덤 플랫폼",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#0a0a0f",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Step 2: 설치 및 dev 서버 확인**

Run: `cd /Users/max/Desktop/wishket/admin-fandom && pnpm install && cd apps/web && pnpm dev`
Expected: localhost:3000에서 "Fandom Galaxy" 텍스트 확인

**Step 3: 커밋**

```bash
git add apps/web
git commit -m "feat: Next.js 15 PWA 앱 초기화"
```

---

### Task 5: 하단 탭 네비게이션 + 라우트 그룹

**Files:**
- Create: `apps/web/components/layout/BottomNav.tsx`
- Create: `apps/web/components/layout/AppShell.tsx`
- Create: `apps/web/app/(galaxy)/page.tsx`
- Create: `apps/web/app/(home)/home/page.tsx`
- Create: `apps/web/app/(archive)/archive/page.tsx`
- Create: `apps/web/app/(kinside)/kinside/page.tsx`
- Create: `apps/web/app/(mypage)/mypage/page.tsx`
- Modify: `apps/web/app/page.tsx` — 리다이렉트

**Step 1: BottomNav 컴포넌트**

`apps/web/components/layout/BottomNav.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'GALAXY', icon: '🌌' },
  { href: '/home', label: 'HOME', icon: '⚡' },
  { href: '/archive', label: 'ARCHIVE', icon: '📦' },
  { href: '/kinside', label: 'K-INSIDE', icon: '💬' },
  { href: '/mypage', label: 'MY', icon: '👤' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[var(--bg-secondary)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? 'text-[var(--accent-purple)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

`apps/web/components/layout/AppShell.tsx`:
```tsx
import { BottomNav } from './BottomNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md pb-16">
      {children}
      <BottomNav />
    </div>
  )
}
```

**Step 2: 각 탭 페이지**

`apps/web/app/page.tsx` (GALAXY — 메인):
```tsx
import { AppShell } from '@/components/layout/AppShell'

export default function GalaxyPage() {
  return (
    <AppShell>
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-[var(--text-secondary)]">3D Galaxy View (Task 6에서 구현)</p>
      </div>
    </AppShell>
  )
}
```

`apps/web/app/home/page.tsx`:
```tsx
import { AppShell } from '@/components/layout/AppShell'

export default function HomePage() {
  return (
    <AppShell>
      <div className="p-4">
        <h1 className="text-xl font-bold">HOME</h1>
        <p className="mt-2 text-[var(--text-secondary)]">활동센터 (Task 10에서 구현)</p>
      </div>
    </AppShell>
  )
}
```

`apps/web/app/archive/page.tsx`:
```tsx
import { AppShell } from '@/components/layout/AppShell'

export default function ArchivePage() {
  return (
    <AppShell>
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-lg text-[var(--text-secondary)]">Coming Soon</p>
      </div>
    </AppShell>
  )
}
```

`apps/web/app/kinside/page.tsx`:
```tsx
import { AppShell } from '@/components/layout/AppShell'

export default function KInsidePage() {
  return (
    <AppShell>
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-lg text-[var(--text-secondary)]">Coming Soon</p>
      </div>
    </AppShell>
  )
}
```

`apps/web/app/mypage/page.tsx`:
```tsx
import { AppShell } from '@/components/layout/AppShell'

export default function MyPage() {
  return (
    <AppShell>
      <div className="p-4">
        <h1 className="text-xl font-bold">MY PAGE</h1>
        <p className="mt-2 text-[var(--text-secondary)]">ID 카드 (Task 11에서 구현)</p>
      </div>
    </AppShell>
  )
}
```

**Step 3: dev 서버에서 탭 전환 확인**

Run: `cd apps/web && pnpm dev`
Expected: 하단 탭 클릭 시 5개 페이지 전환 동작

**Step 4: 커밋**

```bash
git add apps/web
git commit -m "feat: 하단 탭 네비게이션 + 5개 탭 페이지"
```

---

### Task 6: 3D Galaxy — StarField + Sun

**Files:**
- Create: `apps/web/components/galaxy/GalaxyCanvas.tsx`
- Create: `apps/web/components/galaxy/StarField.tsx`
- Create: `apps/web/components/galaxy/Sun.tsx`
- Create: `apps/web/components/galaxy/CameraController.tsx`
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/package.json` — R3F 의존성 추가

**Step 1: R3F 의존성 추가**

`apps/web/package.json`에 dependencies 추가:
```json
{
  "dependencies": {
    "@react-three/fiber": "^9.0.0",
    "@react-three/drei": "^10.0.0",
    "@react-three/postprocessing": "^3.0.0",
    "three": "^0.172.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/three": "^0.172.0"
  }
}
```

Run: `pnpm install`

**Step 2: StarField 컴포넌트**

`apps/web/components/galaxy/StarField.tsx`:
```tsx
'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function StarField({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count])

  const sizes = useMemo(() => {
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      s[i] = 0.1 + Math.random() * 0.4
    }
    return s
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
```

**Step 3: Sun 컴포넌트**

`apps/web/components/galaxy/Sun.tsx`:
```tsx
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1
      const scale = 1 + Math.sin(t * 2) * 0.03
      meshRef.current.scale.setScalar(scale)
    }
    if (glowRef.current) {
      const glowScale = 1.8 + Math.sin(t * 1.5) * 0.1
      glowRef.current.scale.setScalar(glowScale)
    }
  })

  return (
    <group>
      {/* 핵심 구체 */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          emissive="#ffaa00"
          emissiveIntensity={3}
          color="#ffdd44"
          toneMapped={false}
        />
      </mesh>
      {/* 외곽 발광 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      {/* 포인트 라이트 */}
      <pointLight color="#ffaa00" intensity={50} distance={100} />
    </group>
  )
}
```

**Step 4: CameraController**

`apps/web/components/galaxy/CameraController.tsx`:
```tsx
'use client'

import { OrbitControls } from '@react-three/drei'

export function CameraController() {
  return (
    <OrbitControls
      enablePan={false}
      minDistance={8}
      maxDistance={40}
      autoRotate
      autoRotateSpeed={0.3}
      enableDamping
      dampingFactor={0.05}
    />
  )
}
```

**Step 5: GalaxyCanvas 래퍼**

`apps/web/components/galaxy/GalaxyCanvas.tsx`:
```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { StarField } from './StarField'
import { Sun } from './Sun'
import { CameraController } from './CameraController'

export function GalaxyCanvas() {
  return (
    <div className="h-dvh w-full">
      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0f' }}
      >
        <ambientLight intensity={0.1} />
        <CameraController />
        <StarField />
        <Sun />
      </Canvas>
    </div>
  )
}
```

**Step 6: GALAXY 페이지에 연결**

`apps/web/app/page.tsx`:
```tsx
import dynamic from 'next/dynamic'
import { AppShell } from '@/components/layout/AppShell'

const GalaxyCanvas = dynamic(
  () => import('@/components/galaxy/GalaxyCanvas').then((m) => m.GalaxyCanvas),
  { ssr: false }
)

export default function GalaxyPage() {
  return (
    <AppShell>
      <GalaxyCanvas />
    </AppShell>
  )
}
```

**Step 7: dev 서버 확인**

Run: `pnpm dev`
Expected: 중앙에 빛나는 태양, 주변에 별들, 마우스 드래그로 카메라 회전

**Step 8: 커밋**

```bash
git add apps/web
git commit -m "feat: 3D Galaxy — StarField + Sun + 카메라 컨트롤"
```

---

### Task 7: 3D Galaxy — 행성 궤도 + FPI 기반 텍스처

**Files:**
- Create: `apps/web/components/galaxy/Orbit.tsx`
- Create: `apps/web/components/galaxy/Planet.tsx`
- Create: `apps/web/components/galaxy/OrbitalSystem.tsx`
- Modify: `apps/web/components/galaxy/GalaxyCanvas.tsx`

**Step 1: Orbit 컴포넌트**

`apps/web/components/galaxy/Orbit.tsx`:
```tsx
'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface OrbitProps {
  radius: number
  color?: string
  opacity?: number
}

export function Orbit({ radius, color = '#ffffff', opacity = 0.15 }: OrbitProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}
```

**Step 2: Planet 컴포넌트**

`apps/web/components/galaxy/Planet.tsx`:
```tsx
'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Planet as PlanetType } from '@fandom/shared'
import { getPlanetTexture } from '@fandom/shared'

interface PlanetProps {
  planet: PlanetType
  orbitRadius: number
}

function getMaterialProps(fpi: number) {
  const texture = getPlanetTexture(fpi)
  switch (texture) {
    case 'solar':
      return {
        emissive: '#ffaa00',
        emissiveIntensity: 2,
        color: '#ffdd44',
        metalness: 1,
        roughness: 0,
        toneMapped: false,
      }
    case 'gem':
      return {
        color: '#88ccff',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#4488ff',
        emissiveIntensity: 0.5,
      }
    case 'metal':
      return {
        color: '#cccccc',
        metalness: 0.8,
        roughness: 0.3,
      }
    case 'rock':
    default:
      return {
        color: '#555555',
        metalness: 0.1,
        roughness: 0.9,
      }
  }
}

export function Planet({ planet, orbitRadius }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const size = 0.3 + (planet.fpi / 100) * 0.7 // FPI에 따라 0.3~1.0
  const speed = 0.15 + (planet.orbitIndex * 0.05) // 궤도별 속도 차이
  const materialProps = getMaterialProps(planet.fpi)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const angle = t * speed + planet.orbitIndex * ((Math.PI * 2) / 5)
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * orbitRadius
      groupRef.current.position.z = Math.sin(angle) * orbitRadius
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial {...materialProps} color={planet.color} />
      </mesh>

      {/* 외곽 발광 */}
      <mesh>
        <sphereGeometry args={[size * 1.3, 16, 16]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={hovered ? 0.2 : 0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 이클립스 표시 */}
      {planet.isEclipsed && (
        <mesh>
          <sphereGeometry args={[size * 1.6, 16, 16]} />
          <meshBasicMaterial
            color="#ff0000"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* 라벨 */}
      <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div className="whitespace-nowrap text-center">
          <p className="text-xs font-bold text-white drop-shadow-lg">{planet.name}</p>
          <p className="text-[10px] text-white/60">FPI {planet.fpi}</p>
          {planet.isEclipsed && (
            <p className="text-[10px] font-bold text-red-400 animate-pulse">ECLIPSE</p>
          )}
        </div>
      </Html>
    </group>
  )
}
```

**Step 3: OrbitalSystem 컴포넌트**

`apps/web/components/galaxy/OrbitalSystem.tsx`:
```tsx
'use client'

import type { Planet as PlanetType } from '@fandom/shared'
import { Orbit } from './Orbit'
import { Planet } from './Planet'

interface OrbitalSystemProps {
  planets: PlanetType[]
}

const BASE_ORBIT_RADIUS = 5
const ORBIT_SPACING = 3

export function OrbitalSystem({ planets }: OrbitalSystemProps) {
  return (
    <group>
      {planets.map((planet) => {
        const orbitRadius = BASE_ORBIT_RADIUS + planet.orbitIndex * ORBIT_SPACING
        return (
          <group key={planet.id}>
            <Orbit
              radius={orbitRadius}
              color={planet.isEclipsed ? '#ff3333' : planet.color}
              opacity={planet.isEclipsed ? 0.3 : 0.15}
            />
            <Planet planet={planet} orbitRadius={orbitRadius} />
          </group>
        )
      })}
    </group>
  )
}
```

**Step 4: GalaxyCanvas에 통합**

`apps/web/components/galaxy/GalaxyCanvas.tsx`:
```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { mockPlanets } from '@fandom/shared'
import { StarField } from './StarField'
import { Sun } from './Sun'
import { CameraController } from './CameraController'
import { OrbitalSystem } from './OrbitalSystem'

export function GalaxyCanvas() {
  return (
    <div className="h-dvh w-full">
      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0f' }}
      >
        <ambientLight intensity={0.1} />
        <CameraController />
        <StarField />
        <Sun />
        <OrbitalSystem planets={mockPlanets} />
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
```

**Step 5: dev 서버 확인**

Run: `pnpm dev`
Expected: 태양 주변 5개 행성이 궤도를 돌며, FPI에 따라 크기와 텍스처가 다름. Stray Kids 행성에 붉은 이클립스 표시.

**Step 6: 커밋**

```bash
git add apps/web
git commit -m "feat: 3D Galaxy — 행성 궤도 + FPI 기반 텍스처 + Bloom"
```

---

### Task 8: 이클립스 이벤트 + 슈퍼부스트 섬광

**Files:**
- Create: `apps/web/components/galaxy/EclipseOverlay.tsx`
- Create: `apps/web/components/galaxy/BoostFlash.tsx`
- Create: `apps/web/store/galaxy-store.ts`
- Modify: `apps/web/components/galaxy/GalaxyCanvas.tsx`
- Modify: `apps/web/app/page.tsx`

**Step 1: Zustand 갤럭시 스토어**

`apps/web/store/galaxy-store.ts`:
```ts
import { create } from 'zustand'
import type { Planet, Boost } from '@fandom/shared'
import { mockPlanets, mockRecentBoosts } from '@fandom/shared'

interface GalaxyState {
  planets: Planet[]
  activeBoost: Boost | null
  isEclipseWarning: boolean

  triggerEclipse: (planetId: string) => void
  resolveEclipse: (planetId: string) => void
  triggerSuperBoost: (boost: Boost) => void
  clearBoost: () => void
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
  planets: mockPlanets,
  activeBoost: null,
  isEclipseWarning: mockPlanets.some((p) => p.isEclipsed),

  triggerEclipse: (planetId) =>
    set((state) => ({
      planets: state.planets.map((p) =>
        p.id === planetId
          ? { ...p, isEclipsed: true, eclipseEndsAt: new Date(Date.now() + 60 * 60 * 1000) }
          : p
      ),
      isEclipseWarning: true,
    })),

  resolveEclipse: (planetId) =>
    set((state) => ({
      planets: state.planets.map((p) =>
        p.id === planetId ? { ...p, isEclipsed: false, eclipseEndsAt: null } : p
      ),
      isEclipseWarning: state.planets.some((p) => p.id !== planetId && p.isEclipsed),
    })),

  triggerSuperBoost: (boost) => set({ activeBoost: boost }),
  clearBoost: () => set({ activeBoost: null }),
}))
```

**Step 2: 이클립스 오버레이 (HTML)**

`apps/web/components/galaxy/EclipseOverlay.tsx`:
```tsx
'use client'

import { useGalaxyStore } from '@/store/galaxy-store'

export function EclipseOverlay() {
  const { planets, isEclipseWarning } = useGalaxyStore()
  const eclipsedPlanets = planets.filter((p) => p.isEclipsed)

  if (!isEclipseWarning || eclipsedPlanets.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* 화면 테두리 붉은 바이닝 */}
      <div className="absolute inset-0 animate-pulse shadow-[inset_0_0_80px_rgba(255,0,0,0.3)]" />

      {/* 상단 경고 배너 */}
      <div className="pointer-events-auto absolute left-0 right-0 top-0 bg-red-900/80 px-4 py-2 text-center backdrop-blur-sm">
        <p className="animate-pulse text-sm font-bold text-red-200">
          ⚠ ECLIPSE WARNING — {eclipsedPlanets.map((p) => p.name).join(', ')} under attack!
        </p>
      </div>
    </div>
  )
}
```

**Step 3: 슈퍼부스트 섬광**

`apps/web/components/galaxy/BoostFlash.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useGalaxyStore } from '@/store/galaxy-store'

export function BoostFlash() {
  const { activeBoost, clearBoost } = useGalaxyStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (activeBoost) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        clearBoost()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [activeBoost, clearBoost])

  if (!visible || !activeBoost) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* 화면 전체 섬광 */}
      <div className="absolute inset-0 animate-[flash_0.5s_ease-out] bg-white/30" />

      {/* 공지 배너 */}
      <div className="absolute bottom-20 left-0 right-0 px-4">
        <div className="mx-auto max-w-md animate-[slideUp_0.5s_ease-out] rounded-xl bg-[var(--accent-purple)]/90 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-sm font-bold text-white">
            ⚡ {activeBoost.userName}님이 팬덤을 위해 슈퍼 부스팅을 시작했습니다!
          </p>
          <p className="mt-1 text-xs text-white/70">
            +{activeBoost.popAmount.toLocaleString()} POP
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: globals.css에 애니메이션 추가**

`apps/web/app/globals.css`에 추가:
```css
@keyframes flash {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

**Step 5: GALAXY 페이지에 통합 + 데모 버튼**

`apps/web/app/page.tsx`:
```tsx
import dynamic from 'next/dynamic'
import { AppShell } from '@/components/layout/AppShell'
import { EclipseOverlay } from '@/components/galaxy/EclipseOverlay'
import { BoostFlash } from '@/components/galaxy/BoostFlash'
import { DemoControls } from '@/components/galaxy/DemoControls'

const GalaxyCanvas = dynamic(
  () => import('@/components/galaxy/GalaxyCanvas').then((m) => m.GalaxyCanvas),
  { ssr: false }
)

export default function GalaxyPage() {
  return (
    <AppShell>
      <div className="relative h-dvh w-full">
        <GalaxyCanvas />
        <EclipseOverlay />
        <BoostFlash />
        <DemoControls />
      </div>
    </AppShell>
  )
}
```

**Step 6: 데모 컨트롤 (포트폴리오 시연용)**

`apps/web/components/galaxy/DemoControls.tsx`:
```tsx
'use client'

import { useGalaxyStore } from '@/store/galaxy-store'
import { mockRecentBoosts } from '@fandom/shared'

export function DemoControls() {
  const { triggerEclipse, resolveEclipse, triggerSuperBoost } = useGalaxyStore()

  return (
    <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">
      <button
        onClick={() => triggerEclipse('newjeans')}
        className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-red-600"
      >
        Eclipse: NewJeans
      </button>
      <button
        onClick={() => resolveEclipse('stray-kids')}
        className="rounded-lg bg-green-600/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-green-600"
      >
        Resolve: Stray Kids
      </button>
      <button
        onClick={() => triggerSuperBoost(mockRecentBoosts[0])}
        className="rounded-lg bg-[var(--accent-purple)]/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-[var(--accent-purple)]"
      >
        Super Boost!
      </button>
    </div>
  )
}
```

**Step 7: dev 서버 확인**

Run: `pnpm dev`
Expected:
- 이미 Stray Kids에 이클립스 경고 표시
- "Eclipse: NewJeans" 클릭 → NewJeans 행성에 붉은 궤도, 화면 상단 경고 배너
- "Super Boost!" 클릭 → 화면 전체 섬광 + 하단 공지 배너

**Step 8: 커밋**

```bash
git add apps/web
git commit -m "feat: 이클립스 경고 + 슈퍼부스트 섬광 효과"
```

---

### Task 9: Vercel 배포

**Files:**
- Create: `apps/web/vercel.json` (필요시)

**Step 1: Vercel CLI로 배포**

```bash
cd /Users/max/Desktop/wishket/admin-fandom
npx vercel --yes
```

프롬프트 응답:
- Scope: 본인 계정
- Link to existing project? No
- Project name: fandom-galaxy
- Directory: ./apps/web
- Override settings? No

**Step 2: 배포 URL 확인**

Expected: `https://fandom-galaxy.vercel.app` 또는 유사한 URL 제공됨. 3D 은하계 뷰 동작 확인.

**Step 3: 환경변수 (선택)**

Vercel 대시보드에서 환경변수 설정 가능. 목업이므로 Firebase 환경변수 없이도 동작함.

**Step 4: 커밋**

```bash
git add -A
git commit -m "chore: Vercel 배포 설정"
```

---

## Phase 3: 추가 목업 화면

### Task 10: HOME 탭 — 퀘스트 카드 UI

**Files:**
- Create: `apps/web/components/home/QuestCard.tsx`
- Create: `apps/web/components/home/QuestList.tsx`
- Modify: `apps/web/app/home/page.tsx`

**Step 1: QuestCard 컴포넌트**

`apps/web/components/home/QuestCard.tsx`:
```tsx
import type { Quest, UserQuest } from '@fandom/shared'

interface QuestCardProps {
  quest: Quest
  userQuest?: UserQuest
}

const categoryIcons: Record<string, string> = {
  walk: '🚶',
  stream: '🎵',
  checkin: '📋',
  special: '⚡',
}

export function QuestCard({ quest, userQuest }: QuestCardProps) {
  const progress = userQuest?.progress ?? 0
  const percentage = Math.min((progress / quest.requirement) * 100, 100)
  const isCompleted = userQuest?.status === 'completed' || userQuest?.status === 'claimed'

  return (
    <div className={`rounded-xl border p-4 transition ${
      isCompleted
        ? 'border-green-500/30 bg-green-500/5'
        : quest.type === 'emergency'
          ? 'border-red-500/30 bg-red-500/5 animate-pulse'
          : 'border-white/10 bg-white/5'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[quest.category] ?? '⚡'}</span>
          <div>
            <h3 className="font-medium text-white">{quest.title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              +{quest.rewardPop} POP
              {quest.adMultiplier > 1 && ` (광고 시청 시 x${quest.adMultiplier})`}
            </p>
          </div>
        </div>
        {isCompleted && <span className="text-green-400 text-sm">✓</span>}
        {quest.type === 'emergency' && !isCompleted && (
          <span className="text-xs font-bold text-red-400">URGENT</span>
        )}
      </div>

      {/* 프로그레스 바 */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
          <span>{progress.toLocaleString()} / {quest.requirement.toLocaleString()}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--accent-purple)] transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
```

**Step 2: QuestList 컴포넌트**

`apps/web/components/home/QuestList.tsx`:
```tsx
import { mockQuests, mockUserQuests } from '@fandom/shared'
import { QuestCard } from './QuestCard'

export function QuestList() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Today&apos;s Quest</h2>
      {mockQuests.map((quest) => {
        const userQuest = mockUserQuests.find((uq) => uq.questId === quest.id)
        return <QuestCard key={quest.id} quest={quest} userQuest={userQuest} />
      })}
    </div>
  )
}
```

**Step 3: HOME 페이지 업데이트**

`apps/web/app/home/page.tsx`:
```tsx
import { AppShell } from '@/components/layout/AppShell'
import { QuestList } from '@/components/home/QuestList'

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 pt-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-xl font-bold">활동 센터</h1>
          <p className="text-sm text-[var(--text-secondary)]">오늘의 미션을 완료하고 POP을 획득하세요</p>
        </div>

        {/* AI 브리핑 카드 (스켈레톤) */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-[var(--accent-cyan)]">AI Daily Briefing</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            BTS 행성이 FPI 85를 기록하며 1위를 유지하고 있습니다. Stray Kids 행성에 이클립스가 진행 중입니다!
          </p>
        </div>

        {/* 퀘스트 목록 */}
        <QuestList />
      </div>
    </AppShell>
  )
}
```

**Step 4: 확인 및 커밋**

Run: `pnpm dev` → /home 탭에서 퀘스트 카드 확인

```bash
git add apps/web
git commit -m "feat: HOME 탭 — 퀘스트 카드 UI"
```

---

### Task 11: MY PAGE — 진화형 ID 카드

**Files:**
- Create: `apps/web/components/mypage/IdCard.tsx`
- Create: `apps/web/components/mypage/StatGrid.tsx`
- Modify: `apps/web/app/mypage/page.tsx`

**Step 1: ID 카드 컴포넌트**

`apps/web/components/mypage/IdCard.tsx`:
```tsx
import type { User, UserTier } from '@fandom/shared'

interface IdCardProps {
  user: User
}

const tierStyles: Record<UserTier, { bg: string; border: string; label: string; glow: string }> = {
  glass: {
    bg: 'bg-gradient-to-br from-white/10 to-white/5',
    border: 'border-white/20',
    label: 'GLASS',
    glow: '',
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-600/10',
    border: 'border-yellow-500/40',
    label: 'GOLD',
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]',
  },
  obsidian: {
    bg: 'bg-gradient-to-br from-purple-900/30 to-slate-900/50',
    border: 'border-purple-500/40',
    label: 'OBSIDIAN',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.3)]',
  },
}

export function IdCard({ user }: IdCardProps) {
  const style = tierStyles[user.tier]

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 ${style.bg} ${style.border} ${style.glow}`}>
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,currentColor_10px,currentColor_11px)]" />
      </div>

      <div className="relative">
        {/* 티어 배지 */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-[var(--text-secondary)]">
            FANDOM GALAXY
          </span>
          <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold tracking-wider">
            {style.label}
          </span>
        </div>

        {/* 유저 정보 */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{user.email}</p>
        </div>

        {/* POP 잔액 */}
        <div className="mt-6">
          <p className="text-xs text-[var(--text-secondary)]">Total POP</p>
          <p className="text-3xl font-bold text-[var(--accent-purple)]">
            {user.totalPop.toLocaleString()}
          </p>
        </div>

        {/* 가입일 */}
        <div className="mt-4 text-xs text-[var(--text-secondary)]">
          Member since {user.createdAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: 통계 그리드**

`apps/web/components/mypage/StatGrid.tsx`:
```tsx
import type { User } from '@fandom/shared'

interface StatGridProps {
  user: User
}

export function StatGrid({ user }: StatGridProps) {
  const stats = [
    { label: '누적 걸음수', value: user.totalSteps.toLocaleString(), icon: '🚶' },
    { label: '총 기여 POP', value: user.totalFeeds.toLocaleString(), icon: '⚡' },
    { label: '참여 캠페인', value: `${user.campaignCount}건`, icon: '📦' },
    { label: '구독 상태', value: user.isPremium ? 'Premium' : 'Free', icon: '👑' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-xl">{stat.icon}</span>
          <p className="mt-2 text-lg font-bold">{stat.value}</p>
          <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
```

**Step 3: MY PAGE 업데이트**

`apps/web/app/mypage/page.tsx`:
```tsx
import { AppShell } from '@/components/layout/AppShell'
import { IdCard } from '@/components/mypage/IdCard'
import { StatGrid } from '@/components/mypage/StatGrid'
import { mockCurrentUser } from '@fandom/shared'

export default function MyPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 pt-6">
        <h1 className="text-xl font-bold">MY PAGE</h1>
        <IdCard user={mockCurrentUser} />
        <StatGrid user={mockCurrentUser} />
      </div>
    </AppShell>
  )
}
```

**Step 4: 확인 및 커밋**

Run: `pnpm dev` → /mypage에서 Gold 등급 ID 카드 확인

```bash
git add apps/web
git commit -m "feat: MY PAGE — 진화형 ID 카드 + 통계 그리드"
```

---

## Phase 4: React Native Expo 프로젝트

### Task 12: Expo 프로젝트 초기화

**Files:**
- Create: `apps/mobile/` (Expo 프로젝트)

**Step 1: Expo 프로젝트 생성**

```bash
cd /Users/max/Desktop/wishket/admin-fandom/apps
npx create-expo-app@latest mobile --template tabs
```

**Step 2: 워크스페이스 연결**

`apps/mobile/package.json`에 수정:
```json
{
  "name": "@fandom/mobile",
  "dependencies": {
    "@fandom/shared": "workspace:*"
  }
}
```

**Step 3: 탭 구조 확인**

Expo Router 탭이 기본 생성됨. 다음 탭으로 이름 변경:
- `app/(tabs)/galaxy.tsx`
- `app/(tabs)/home.tsx`
- `app/(tabs)/archive.tsx`
- `app/(tabs)/kinside.tsx`
- `app/(tabs)/mypage.tsx`

각 파일은 빈 화면 + 탭 이름 텍스트만 표시.

**Step 4: 실행 확인**

```bash
cd apps/mobile && npx expo start
```
Expected: Expo Go에서 5개 탭 전환 동작

**Step 5: 커밋**

```bash
git add apps/mobile
git commit -m "feat: Expo 프로젝트 초기화 — 5탭 구조"
```

---

### Task 13: Expo Firebase 연결 코드

**Files:**
- Create: `apps/mobile/lib/firebase.ts`
- Create: `apps/mobile/.env.example`

**Step 1: Firebase 초기화 (환경변수)**

`apps/mobile/lib/firebase.ts`:
```ts
import { getApp, getDb, getAuthInstance } from '@fandom/firebase'

// Expo에서는 환경변수를 app.config.ts의 extra로 전달
// 현재는 @fandom/firebase의 래퍼를 그대로 사용
export { getApp, getDb, getAuthInstance }
```

`apps/mobile/.env.example`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_USE_EMULATOR=true
```

**Step 2: 커밋**

```bash
git add apps/mobile
git commit -m "feat: Expo Firebase 연결 코드 (환경변수)"
```

---

## Phase 5: 최종 점검 & 배포

### Task 14: Vercel 프로덕션 배포

**Step 1: 빌드 확인**

```bash
cd /Users/max/Desktop/wishket/admin-fandom
pnpm build --filter=@fandom/web
```
Expected: 빌드 성공, 에러 없음

**Step 2: Vercel 배포**

```bash
npx vercel --prod
```
Expected: 프로덕션 URL 제공

**Step 3: 최종 확인**

배포된 URL에서:
- [ ] 3D 은하계 뷰 동작
- [ ] 행성 궤도 회전
- [ ] 이클립스 경고
- [ ] 슈퍼부스트 섬광
- [ ] 탭 전환 동작
- [ ] HOME 퀘스트 카드
- [ ] MY PAGE ID 카드
- [ ] 모바일 브라우저에서 동작
- [ ] PWA 설치 가능

**Step 4: 최종 커밋**

```bash
git add -A
git commit -m "chore: 최종 점검 및 Vercel 프로덕션 배포 완료"
```

---

## 태스크 요약

| Phase | Task | 설명 | 예상 |
|-------|------|------|------|
| 1 | Task 1 | 모노레포 루트 초기화 | 5분 |
| 1 | Task 2 | shared 패키지 (타입, 상수, mock) | 10분 |
| 1 | Task 3 | firebase 패키지 (환경변수 래퍼) | 5분 |
| 2 | Task 4 | Next.js 앱 초기화 | 5분 |
| 2 | Task 5 | 하단 탭 + 라우트 | 5분 |
| 2 | Task 6 | 3D StarField + Sun | 15분 |
| 2 | Task 7 | 행성 궤도 + FPI 텍스처 | 20분 |
| 2 | Task 8 | 이클립스 + 슈퍼부스트 | 15분 |
| 2 | Task 9 | Vercel 배포 | 5분 |
| 3 | Task 10 | HOME 퀘스트 카드 | 10분 |
| 3 | Task 11 | MY PAGE ID 카드 | 10분 |
| 4 | Task 12 | Expo 프로젝트 초기화 | 10분 |
| 4 | Task 13 | Expo Firebase 연결 | 5분 |
| 5 | Task 14 | 최종 점검 + 프로덕션 배포 | 5분 |
