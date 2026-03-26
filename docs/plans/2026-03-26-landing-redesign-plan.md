# Landing Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** fandom-galaxy.html의 9섹션 디자인을 Next.js 컴포넌트로 전면 교체한다.

**Architecture:** 기존 `components/landing/` 폴더의 컴포넌트들을 새로운 9개 섹션 + Footer로 교체. 모든 랜딩 컴포넌트는 `'use client'`로 Framer Motion 사용. `page.tsx`는 서버 컴포넌트로 import만 담당.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Lucide React, Spline 3D (iframe)

---

### Task 1: 의존성 설치

**Files:**
- Modify: `apps/web/package.json`

**Step 1: framer-motion과 lucide-react 설치**

Run:
```bash
cd /Users/max/Desktop/wishket/admin-fandom && pnpm add framer-motion lucide-react --filter @fandom/web
```

**Step 2: 설치 확인**

Run:
```bash
grep -E "framer-motion|lucide-react" apps/web/package.json
```
Expected: 두 패키지가 dependencies에 나타남

**Step 3: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "deps: framer-motion, lucide-react 추가"
```

---

### Task 2: globals.css 업데이트

**Files:**
- Modify: `apps/web/app/globals.css`

**Step 1: 기존 CSS 변수와 bento-grid를 제거하고 새 스타일로 교체**

`globals.css` 전체를 다음으로 교체:

```css
@import "tailwindcss";

:root {
  --bg-primary: #05050a;
  --bg-secondary: #12121a;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Glass morphism cards */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

/* Glass morphism buttons */
.glass-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* Text glow effect for hero */
.text-glow {
  text-shadow: 0 0 80px rgba(255, 165, 0, 0.3), 0 0 160px rgba(255, 100, 0, 0.1);
}

/* Custom scrollbar — thin, dark */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

*::-webkit-scrollbar {
  width: 6px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

*::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
```

**Step 2: Commit**

```bash
git add apps/web/app/globals.css
git commit -m "style: globals.css를 fandom-galaxy 테마로 교체"
```

---

### Task 3: next.config.ts에 Spline 도메인 추가

**Files:**
- Modify: `apps/web/next.config.ts`

**Step 1: remotePatterns에 my.spline.design은 이미지가 아니라 iframe이므로 변경 불필요. 하지만 Inter 폰트를 Google Fonts에서 로드하므로 확인만.**

실제로 Spline은 iframe이므로 next.config 변경 불필요. 이 태스크는 스킵.

---

### Task 4: SectionTitle 공통 컴포넌트

fandom-galaxy.html의 `tu` 컴포넌트에 해당. 여러 섹션에서 재사용됨.

**Files:**
- Create: `apps/web/components/landing/SectionTitle.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

export default function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
        {title}
      </h2>
      <p className="text-gray-400 text-sm md:text-base font-medium">
        {subtitle}
      </p>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/SectionTitle.tsx
git commit -m "feat: SectionTitle 공통 컴포넌트 추가"
```

---

### Task 5: Header 컴포넌트

**Files:**
- Create: `apps/web/components/landing/Header.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05050a]/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
          FANDOM GALAXY
        </div>
        <button className="text-white hover:text-orange-400 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/Header.tsx
git commit -m "feat: Header 고정 네비게이션 컴포넌트 추가"
```

---

### Task 6: HeroSection 컴포넌트

**Files:**
- Modify: `apps/web/components/landing/HeroSection.tsx` (전면 재작성)

**Step 1: 컴포넌트 재작성**

```tsx
'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Spline 3D Globe */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <iframe
          src="https://my.spline.design/thebluemarble-lTvMVdh8gtAKIBvIYJ60lsky/"
          frameBorder="0"
          width="100%"
          height="100%"
          title="3D Globe"
          className="w-full h-full object-cover opacity-90 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050a] via-transparent to-[#05050a] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05050a] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 w-full relative z-10 flex flex-col md:flex-row items-center justify-between h-full pt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full md:w-1/2"
        >
          <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.9] text-white text-glow">
            FANDOM
            <br />
            GALAXY
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="w-full md:w-1/3 mt-12 md:mt-0 text-right md:text-left"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            새로운 가능성이 창조되는 곳
          </h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            무한한 가능성을 지닌 아티스트와 함께,
            <br />
            팬덤의 새로운 우주를 창조합니다
          </p>
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/HeroSection.tsx
git commit -m "feat: HeroSection을 Spline 3D Globe 디자인으로 재작성"
```

---

### Task 7: AboutSection 컴포넌트

**Files:**
- Create: `apps/web/components/landing/AboutSection.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

import { motion } from 'framer-motion'

export default function AboutSection() {
  return (
    <section className="py-32 relative flex items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* Glow orb */}
        <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-orange-600/20 to-red-600/20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
          팬덤의 이야기로 유니버스를 확장하다
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          FANDOM GALAXY는 아티스트와 팬들이
          <br />
          자신만의 행성을 구축하여 하나의 유니버스를 완성합니다
        </p>
      </motion.div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/AboutSection.tsx
git commit -m "feat: AboutSection 컴포넌트 추가"
```

---

### Task 8: FeaturesSection 컴포넌트

**Files:**
- Create: `apps/web/components/landing/FeaturesSection.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'

const features = [
  {
    title: '나만의 갤럭시',
    subtitle: 'Galaxy',
    desc: '실시간 3D 우주에서 팬덤의 에너지를 경험하세요',
    img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: '매일 새로운 퀘스트',
    subtitle: 'Quest',
    desc: 'Zap 포인트를 모으고 팬덤을 빛내세요',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: '팬덤의 기록',
    subtitle: 'Archive',
    desc: '펀딩, 캠페인, 모든 순간을 아카이브',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: '지식 커뮤니티',
    subtitle: 'K-INSIDE',
    desc: '팬들의 집단 지성이 만드는 인사이트',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
  },
]

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600'

export default function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <SectionTitle title="FEATURES" subtitle="팬덤을 위한 모든 것" />
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.subtitle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/50 transition-all hover:-translate-y-2 flex flex-col h-full"
            >
              {/* Background letter */}
              <div className="absolute -right-4 -top-4 text-8xl font-black italic text-white/5 group-hover:text-orange-500/10 transition-colors duration-500 pointer-events-none z-0">
                {feature.subtitle[0]}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="aspect-video w-full rounded-xl overflow-hidden mb-6">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG }}
                  />
                </div>
                <div className="mb-auto">
                  <div className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">
                    {feature.subtitle}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mt-2">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/FeaturesSection.tsx
git commit -m "feat: FeaturesSection 4컬럼 카드 그리드 추가"
```

---

### Task 9: ArchiveSection 컴포넌트

**Files:**
- Create: `apps/web/components/landing/ArchiveSection.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'

const archiveImages = [
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600',
]

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600'

export default function ArchiveSection() {
  return (
    <section className="py-32 relative">
      <SectionTitle title="ARCHIVE" subtitle="다채로운 팬덤의 기록으로 채워지는 유니버스" />

      <div className="max-w-[1400px] mx-auto px-4 relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
          {archiveImages.map((src, i) => {
            const isCenter = i === 2
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
                  isCenter
                    ? 'w-64 h-64 sm:w-80 sm:h-80 z-20 shadow-2xl shadow-orange-900/50 border border-white/20 scale-110'
                    : 'w-40 h-40 sm:w-56 sm:h-56 z-10 opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={src}
                  alt={`Archive ${i}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMG }}
                />
                {isCenter && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold tracking-widest">VIEW</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/ArchiveSection.tsx
git commit -m "feat: ArchiveSection 이미지 갤러리 추가"
```

---

### Task 10: MediaSection 컴포넌트

**Files:**
- Create: `apps/web/components/landing/MediaSection.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Play, ChevronRight } from 'lucide-react'
import SectionTitle from './SectionTitle'

export default function MediaSection() {
  return (
    <section className="py-32 relative">
      <SectionTitle title="MEDIA" subtitle="사운드와 비주얼이 어우러져 완성되는 몰입의 순간" />

      <div className="max-w-[1000px] mx-auto px-6 relative">
        {/* Video thumbnail */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1600"
            alt="Video Thumbnail"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1600'
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-300 font-medium text-lg sm:text-xl">
            BTS 광화문 공연: 사진으로 보는 돌아온 &apos;완전체 BTS&apos; 공연 - BBC News 코리아
          </p>
        </motion.div>

        {/* View more */}
        <div className="flex justify-center mt-12">
          <button className="text-xs font-semibold tracking-widest text-white/70 hover:text-white transition-colors flex items-center gap-1">
            VIEW MORE <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/MediaSection.tsx
git commit -m "feat: MediaSection 비디오 썸네일 컴포넌트 추가"
```

---

### Task 11: NoticeSection 컴포넌트

**Files:**
- Create: `apps/web/components/landing/NoticeSection.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import SectionTitle from './SectionTitle'

const notices = [
  { title: "이무진 '대면 콘서트 상상도 못해... 행복합니다'", date: '2026-03-24' },
  { title: "태민 '무대에서 빛날 수 있게 해주신 모든 분들께 감사'...", date: '2026-03-20' },
  { title: '샤이니 태민, 크록스 \'에코 컬렉션\' 캠페인 공개', date: '2026-03-15' },
  { title: "'위대한 가이드2' 이무진, 아르헨티나행 '20대 청년 모습 볼 수 있을 것'", date: '2026-03-10' },
]

export default function NoticeSection() {
  return (
    <section className="py-32 relative">
      <SectionTitle title="NOTICE" subtitle="더 큰 세상으로 향하는 FANDOM GALAXY만의 이야기" />

      <div className="max-w-[800px] mx-auto px-6">
        <div className="border-t border-white/10">
          {notices.map((notice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex justify-between items-center py-6 border-b border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer group px-4 -mx-4 rounded-lg"
            >
              <h4 className="text-sm sm:text-base font-medium text-gray-300 group-hover:text-white transition-colors truncate pr-4">
                {notice.title}
              </h4>
              <span className="text-xs text-gray-500 shrink-0">
                {notice.date}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="text-xs font-semibold tracking-widest text-white/70 hover:text-white transition-colors flex items-center gap-1">
            VIEW MORE <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/NoticeSection.tsx
git commit -m "feat: NoticeSection 뉴스 리스트 컴포넌트 추가"
```

---

### Task 12: CTASection 컴포넌트 재작성

**Files:**
- Modify: `apps/web/components/landing/CTASection.tsx` (전면 재작성)

**Step 1: 컴포넌트 재작성**

```tsx
'use client'

import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-40 relative flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Orange glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] bg-gradient-to-t from-orange-600/40 to-transparent blur-3xl -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6">
          JOIN THE JOURNEY
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-12">
          이제 당신의 이야기를 들려주세요
          <br />
          FANDOM GALAXY는 함께 새로운 무대를 만들어 갈 당신을 기다립니다
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="glass-button px-8 py-3 rounded-full text-xs font-bold tracking-widest text-white hover:bg-orange-600/20 hover:border-orange-500/50 w-full sm:w-auto">
            APPLY FOR AUDITION
          </button>
          <button className="glass-button px-8 py-3 rounded-full text-xs font-bold tracking-widest text-white hover:bg-white/10 w-full sm:w-auto">
            JOIN FANDOM GALAXY
          </button>
        </div>
      </motion.div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/CTASection.tsx
git commit -m "feat: CTASection을 JOIN THE JOURNEY 디자인으로 재작성"
```

---

### Task 13: Footer 컴포넌트

**Files:**
- Create: `apps/web/components/landing/Footer.tsx`

**Step 1: 컴포넌트 작성**

```tsx
'use client'

import { Instagram, Twitter, Youtube, ChevronDown } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05050a] pt-16 pb-8 px-6 sm:px-12">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left: Logo + Address */}
        <div>
          <div className="font-bold text-lg tracking-tighter flex items-center gap-2 mb-4">
            FANDOM GALAXY
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            9, Seolleung-ro 127-gil, Gangnam-gu, Seoul, Korea
            <br />
            서울특별시 강남구 선릉로127길 9
          </p>
        </div>

        {/* Right: Social + Family site */}
        <div className="flex flex-col items-start md:items-end gap-6">
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Instagram className="w-4 h-4 text-gray-400" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Twitter className="w-4 h-4 text-gray-400" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Youtube className="w-4 h-4 text-gray-400" />
            </a>
            <div className="ml-4 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-8 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-xs text-gray-400">패밀리 사이트</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1600px] mx-auto mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-600">
        <p>&copy;FANDOM GALAXY ENTERTAINMENT Corp. ALL RIGHTS RESERVED. Site by VSTORY.</p>
        <a href="#" className="hover:text-gray-400 transition-colors">
          개인정보처리방침
        </a>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/components/landing/Footer.tsx
git commit -m "feat: Footer 컴포넌트 추가"
```

---

### Task 14: page.tsx 재작성 + 고정 배경

**Files:**
- Modify: `apps/web/app/page.tsx` (전면 재작성)

**Step 1: page.tsx 재작성**

```tsx
import Header from '@/components/landing/Header'
import HeroSection from '@/components/landing/HeroSection'
import AboutSection from '@/components/landing/AboutSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import ArchiveSection from '@/components/landing/ArchiveSection'
import MediaSection from '@/components/landing/MediaSection'
import NoticeSection from '@/components/landing/NoticeSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="bg-[#05050a] min-h-screen font-sans text-white selection:bg-orange-500/30 selection:text-white overflow-x-hidden relative">
      {/* Fixed space background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2000"
          alt="Space Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05050a]/80 to-[#05050a]" />
      </div>

      <Header />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ArchiveSection />
        <MediaSection />
        <NoticeSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/app/page.tsx
git commit -m "feat: 랜딩페이지를 fandom-galaxy 9섹션 구조로 전면 교체"
```

---

### Task 15: 사용하지 않는 파일 정리

**Files:**
- Delete: `apps/web/components/landing/BentoGrid.tsx`
- Delete: `apps/web/components/landing/SocialProof.tsx`
- Delete: `apps/web/components/landing/PageIndicator.tsx`
- Check: `apps/web/hooks/useParallax.ts` — 다른 페이지에서 사용 중인지 확인 후 삭제 여부 결정

**Step 1: 사용하지 않는 컴포넌트 삭제**

```bash
rm apps/web/components/landing/BentoGrid.tsx
rm apps/web/components/landing/SocialProof.tsx
rm apps/web/components/landing/PageIndicator.tsx
```

**Step 2: useParallax 사용처 확인**

```bash
grep -r "useParallax" apps/web/ --include="*.tsx" --include="*.ts"
```

만약 landing 컴포넌트에서만 사용되었고 모두 삭제되었다면:
```bash
rm apps/web/hooks/useParallax.ts
```

**Step 3: Commit**

```bash
git add -u
git commit -m "chore: 사용하지 않는 랜딩 컴포넌트 정리"
```

---

### Task 16: 빌드 검증

**Step 1: 빌드 실행**

```bash
cd /Users/max/Desktop/wishket/admin-fandom && pnpm --filter @fandom/web build
```
Expected: 빌드 성공, 에러 없음

**Step 2: 빌드 실패 시 수정 후 재빌드**

타입 에러나 import 경로 문제가 있으면 수정.

**Step 3: Commit (수정이 있었다면)**

```bash
git add -A
git commit -m "fix: 빌드 에러 수정"
```

---

### Task 17: 브라우저 검증

**Step 1: 개발 서버 실행**

```bash
cd /Users/max/Desktop/wishket/admin-fandom && pnpm --filter @fandom/web dev
```

**Step 2: 브라우저에서 localhost:3000 접속하여 확인**

체크리스트:
- [ ] Header가 상단에 고정되고, 스크롤 시 blur 배경 활성화
- [ ] Hero 섹션에 Spline 3D Globe 정상 로드
- [ ] "FANDOM GALAXY" 타이틀 text-glow 효과
- [ ] About 섹션 스크롤 시 fade-in 애니메이션
- [ ] Features 4개 카드 순차 등장, hover 효과
- [ ] Archive 5개 이미지, 중앙 강조
- [ ] Media 비디오 썸네일 + 플레이 버튼
- [ ] Notice 4개 뉴스 항목
- [ ] CTA 하단 orange glow
- [ ] Footer 주소 + 소셜 아이콘
- [ ] 자유 스크롤 (snap 없음)
- [ ] 모바일 반응형 (375px~)
