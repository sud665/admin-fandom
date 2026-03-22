# Fandom 랜딩페이지 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 루트(`/`)를 풀페이지 스크롤 랜딩페이지로 교체하고, 기존 Galaxy를 `/galaxy`로 이동하여 신규 방문자에게 서비스를 소개하는 프리미엄 랜딩 경험 제공

**Architecture:** Next.js App Router에서 `app/page.tsx`를 랜딩페이지로 교체. 랜딩 컴포넌트는 `components/landing/`에 분리. BottomNav는 랜딩에서 숨김 처리. Unsplash 이미지 + IntersectionObserver 스크롤 애니메이션.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, Unsplash (next/image), IntersectionObserver

---

### Task 1: Galaxy 페이지를 `/galaxy`로 이동

**Files:**
- Create: `apps/web/app/galaxy/page.tsx`
- Modify: `apps/web/app/page.tsx` (내용을 galaxy로 이동 후 랜딩으로 교체)
- Modify: `apps/web/components/layout/BottomNav.tsx:7` (Galaxy 탭 href를 `/galaxy`로 변경)

**Step 1: Galaxy 페이지 이동**

`apps/web/app/galaxy/page.tsx` 생성 — 현재 `app/page.tsx`의 내용을 그대로 복사:

```tsx
'use client'

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

**Step 2: BottomNav Galaxy 탭 경로 업데이트**

`apps/web/components/layout/BottomNav.tsx` — tabs 배열에서 Galaxy href 변경:

```tsx
// 변경 전
{ href: '/', label: 'GALAXY', icon: '🌌' },
// 변경 후
{ href: '/galaxy', label: 'GALAXY', icon: '🌌' },
```

isActive 로직도 업데이트:

```tsx
// 변경 전
const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
// 변경 후
const isActive = pathname === tab.href || (tab.href !== '/galaxy' && pathname.startsWith(tab.href))
```

**Step 3: 빌드 확인**

Run: `cd apps/web && pnpm build`
Expected: 빌드 성공, `/galaxy` 라우트 생성

**Step 4: Commit**

```bash
git add apps/web/app/galaxy/page.tsx apps/web/components/layout/BottomNav.tsx
git commit -m "refactor: move Galaxy page to /galaxy route"
```

---

### Task 2: 스크롤 애니메이션 훅 생성

**Files:**
- Create: `apps/web/hooks/useScrollReveal.ts`

**Step 1: IntersectionObserver 커스텀 훅 작성**

```tsx
'use client'

import { useEffect, useRef } from 'react'

export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
```

**Step 2: globals.css에 애니메이션 클래스 추가**

`apps/web/app/globals.css`에 추가:

```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

**Step 3: Commit**

```bash
git add apps/web/hooks/useScrollReveal.ts apps/web/app/globals.css
git commit -m "feat: add useScrollReveal hook + CSS animation classes"
```

---

### Task 3: next.config에 Unsplash 이미지 도메인 허용

**Files:**
- Modify: `apps/web/next.config.ts`

**Step 1: images.remotePatterns 추가**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@fandom/shared', '@fandom/firebase'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

**Step 2: Commit**

```bash
git add apps/web/next.config.ts
git commit -m "feat: allow Unsplash images in next.config"
```

---

### Task 4: 랜딩페이지 컴포넌트 — HeroSection

**Files:**
- Create: `apps/web/components/landing/HeroSection.tsx`

**Step 1: HeroSection 컴포넌트 작성**

풀스크린 100vh 히어로. Unsplash 우주 배경 + 오버레이 + 서비스 타이틀 + CTA 버튼.
Supanova 원칙: 실제 한국어 콘텐츠, 풀 반응형, 글로우 CTA.

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function HeroSection() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal relative flex h-dvh items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80"
        alt="우주 은하 배경"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0f]" />
      <div className="relative z-10 px-6 text-center">
        <p className="mb-4 text-sm font-medium tracking-[0.3em] text-[var(--accent-cyan)] uppercase">
          차세대 글로벌 팬덤 플랫폼
        </p>
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
          당신만의<br />
          <span className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] bg-clip-text text-transparent">
            팬덤 우주
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-md text-lg text-white/70 md:text-xl">
          좋아하는 아티스트를 중심으로 펼쳐지는 시네마틱 갤럭시.
          퀘스트를 완수하고, 팬덤의 궤도를 넓혀가세요.
        </p>
        <Link
          href="/galaxy"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] px-8 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(123,47,242,0.4)] transition-all hover:shadow-[0_0_50px_rgba(123,47,242,0.6)] hover:scale-105"
        >
          우주로 입장하기
          <span className="text-xl">🚀</span>
        </Link>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
        </svg>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/HeroSection.tsx
git commit -m "feat: add landing HeroSection component"
```

---

### Task 5: 랜딩 컴포넌트 — FeatureGalaxy, FeatureQuest, FeatureArchive, FeatureCommunity

**Files:**
- Create: `apps/web/components/landing/FeatureGalaxy.tsx`
- Create: `apps/web/components/landing/FeatureQuest.tsx`
- Create: `apps/web/components/landing/FeatureArchive.tsx`
- Create: `apps/web/components/landing/FeatureCommunity.tsx`

**Step 1: 4개 Feature 섹션 작성**

각 섹션은 100vh 풀페이지, Unsplash 배경, 오버레이, 기능 설명.
좌우 번갈아가며 텍스트 배치 (모바일은 세로 스택).

FeatureGalaxy — 3D 우주 시각화 소개
- 이미지: 행성 클로즈업 (`photo-1614732414444-096e5f1122d5`)
- 핵심 카피: "나만의 갤럭시를 탐험하세요"
- 설명: 행성, 궤도, 이클립스 시스템

FeatureQuest — 퀘스트/미션 시스템
- 이미지: 오로라 (`photo-1531366936337-7c912a4589a7`)
- 핵심 카피: "매일 새로운 퀘스트"
- 설명: Zap 포인트, 부스트, 일일 미션

FeatureArchive — 아카이브
- 이미지: 성운 (`photo-1464802686167-b939a6910659`)
- 핵심 카피: "팬덤의 역사를 기록하다"
- 설명: 펀딩, 캠페인, 활동 아카이브

FeatureCommunity — K-INSIDE
- 이미지: 은하수 (`photo-1519681393784-d120267933ba`)
- 핵심 카피: "팬들이 만드는 지식 커뮤니티"
- 설명: Q&A, 정보 공유, 팬덤 인사이트

각 컴포넌트 패턴 (FeatureGalaxy 예시):

```tsx
'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function FeatureGalaxy() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal relative flex min-h-dvh items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920&q=80"
        alt="행성 클로즈업"
        fill
        loading="lazy"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20">
        <div className="max-w-lg">
          <span className="mb-3 inline-block rounded-full bg-[var(--accent-purple)]/20 px-4 py-1.5 text-sm font-medium text-[var(--accent-purple)]">
            Galaxy
          </span>
          <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
            나만의 갤럭시를<br />탐험하세요
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-white/70">
            좋아하는 아티스트가 태양이 되고, 팬 활동이 행성의 궤도를 만듭니다.
            실시간으로 변화하는 3D 우주에서 팬덤의 에너지를 시각적으로 경험하세요.
          </p>
          <ul className="space-y-3 text-white/60">
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-purple)]/20 text-sm">🪐</span>
              인터랙티브 3D 행성 시스템
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-purple)]/20 text-sm">🌀</span>
              실시간 궤도 시각화
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-purple)]/20 text-sm">🌑</span>
              이클립스 이벤트
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
```

나머지 3개도 동일 패턴, 그라데이션 방향/색상/콘텐츠만 다르게.

**Step 2: Commit**

```bash
git add apps/web/components/landing/Feature*.tsx
git commit -m "feat: add 4 feature section components for landing"
```

---

### Task 6: 랜딩 컴포넌트 — SocialProof + CTASection + Footer

**Files:**
- Create: `apps/web/components/landing/SocialProof.tsx`
- Create: `apps/web/components/landing/CTASection.tsx`
- Create: `apps/web/components/landing/Footer.tsx`

**Step 1: SocialProof — 숫자 카운터 섹션**

배경 이미지 없이 다크 그라데이션. 4개 숫자 카운터 (유저, 퀘스트, 캠페인, 커뮤니티).
카운터 애니메이션은 IntersectionObserver로 뷰포트 진입 시 0→목표값 카운트업.

**Step 2: CTASection — 최종 진입 유도**

Unsplash 딥스페이스 배경. 큰 타이틀 + 글로우 CTA 버튼 → `/galaxy`.

**Step 3: Footer**

미니멀 다크. 로고, 링크 (서비스 소개, 이용약관, 개인정보처리방침), 저작권.

**Step 4: Commit**

```bash
git add apps/web/components/landing/SocialProof.tsx apps/web/components/landing/CTASection.tsx apps/web/components/landing/Footer.tsx
git commit -m "feat: add SocialProof, CTA, Footer landing components"
```

---

### Task 7: 랜딩페이지 조립 + AppShell 조건부 BottomNav

**Files:**
- Modify: `apps/web/app/page.tsx` (랜딩페이지로 교체)
- Modify: `apps/web/components/layout/AppShell.tsx` (BottomNav 조건부 표시)

**Step 1: app/page.tsx를 랜딩페이지로 교체**

```tsx
import { HeroSection } from '@/components/landing/HeroSection'
import { FeatureGalaxy } from '@/components/landing/FeatureGalaxy'
import { FeatureQuest } from '@/components/landing/FeatureQuest'
import { FeatureArchive } from '@/components/landing/FeatureArchive'
import { FeatureCommunity } from '@/components/landing/FeatureCommunity'
import { SocialProof } from '@/components/landing/SocialProof'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeatureGalaxy />
      <FeatureQuest />
      <FeatureArchive />
      <FeatureCommunity />
      <SocialProof />
      <CTASection />
      <Footer />
    </main>
  )
}
```

랜딩은 AppShell을 사용하지 않음 (BottomNav 불필요).

**Step 2: 빌드 확인**

Run: `cd apps/web && pnpm build`
Expected: 빌드 성공

**Step 3: Commit**

```bash
git add apps/web/app/page.tsx
git commit -m "feat: replace root page with landing page"
```

---

### Task 8: layout.tsx 메타데이터 업데이트 + 최종 확인

**Files:**
- Modify: `apps/web/app/layout.tsx` (메타데이터 업데이트)

**Step 1: 메타데이터 SEO 최적화**

```tsx
export const metadata: Metadata = {
  title: 'Fandom Galaxy — 차세대 시네마틱 글로벌 팬덤 플랫폼',
  description: '좋아하는 아티스트를 중심으로 펼쳐지는 시네마틱 갤럭시. 퀘스트를 완수하고, 팬덤의 궤도를 넓혀가세요.',
  manifest: '/manifest.json',
}
```

**Step 2: 전체 빌드 + dev 서버 확인**

Run: `cd apps/web && pnpm build && pnpm dev`
Expected:
- `/` → 풀페이지 랜딩
- `/galaxy` → 3D Galaxy Canvas
- BottomNav에서 Galaxy 탭 → `/galaxy`

**Step 3: Commit**

```bash
git add apps/web/app/layout.tsx
git commit -m "feat: update metadata for landing page SEO"
```
