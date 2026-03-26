# Fandom Galaxy Landing Page Redesign

## Overview

현재 Next.js 랜딩페이지(4섹션)를 `fandom-galaxy.html`의 디자인(9섹션)으로 전면 교체한다.

## Requirements

- fandom-galaxy.html의 9개 섹션 구조를 Next.js 컴포넌트로 1:1 재구현
- Framer Motion 도입 (신규 설치)
- Spline 3D Globe iframe 임베드
- 하드코딩된 더미 데이터 그대로 사용
- 자유 스크롤 (snap 제거)
- 섹션별 개별 컴포넌트 패턴

## Architecture

```
page.tsx (서버 컴포넌트 — 새 컴포넌트 import만)
└─ components/landing/
   ├─ Header.tsx          — 고정 네비, 스크롤 시 blur 배경
   ├─ HeroSection.tsx     — Spline 3D Globe + "FANDOM GALAXY" 타이틀
   ├─ AboutSection.tsx    — 중앙 텍스트 + 그라데이션 오브
   ├─ FeaturesSection.tsx — 4개 카드 그리드
   ├─ ArchiveSection.tsx  — 5개 이미지 캐러셀형 레이아웃
   ├─ MediaSection.tsx    — 비디오 썸네일 + 캡션
   ├─ NoticeSection.tsx   — 4개 뉴스 리스트
   ├─ CTASection.tsx      — "JOIN THE JOURNEY" + 버튼 2개
   └─ Footer.tsx          — 주소, 소셜, 저작권
```

## Design Tokens

- Background: `#05050a`
- Font: Inter (300-900)
- Accent gradient: `from-orange-600` / `to-red-600`
- Glass: `bg-white/5 border-white/10 backdrop-blur`
- Text glow: `text-shadow: 0 0 80px rgba(255,165,0,0.3)`

## Sections Detail

### 1. Header
- 고정 (`fixed top-0`), z-50
- 스크롤 50px 이상: `bg-[#05050a]/80 backdrop-blur-md border-b border-white/5`
- 좌측 "FANDOM GALAXY" 로고, 우측 Menu 아이콘

### 2. Hero
- 전체 화면 (`h-screen min-h-[800px]`)
- Spline iframe: `mix-blend-screen`, 양쪽/하단 그라데이션 오버레이
- 좌측: "FANDOM GALAXY" (6xl~9rem, font-black)
- 우측: "새로운 가능성이 창조되는 곳" + 설명
- Framer Motion: x:-50→0 (좌), x:50→0 (우, delay 0.3s)

### 3. About
- py-32, 중앙 정렬
- orange/red 그라데이션 blur 오브 (배경 장식)
- "팬덤의 이야기로 유니버스를 확장하다"
- whileInView: opacity:0,y:30 → opacity:1,y:0

### 4. Features
- 섹션 타이틀: "FEATURES" / "팬덤을 위한 모든 것"
- 4컬럼 그리드 (md:2, lg:4)
- 카드: glass-card, hover시 -translate-y-2 + orange border
- 각 카드: 이미지 + subtitle 배지 + title + desc
- 순차 delay: index * 0.1

### 5. Archive
- 섹션 타이틀: "ARCHIVE" / "다채로운 팬덤의 기록으로 채워지는 유니버스"
- 5개 이미지 가로 배치, 중앙(index 2) 강조
- 중앙: w-80, h-80, scale-110, shadow, VIEW 오버레이
- 나머지: w-56, h-56, opacity-50
- 하단 dot indicator (5개)

### 6. Media
- 섹션 타이틀: "MEDIA" / "사운드와 비주얼이 어우러져 완성되는 몰입의 순간"
- aspect-video 썸네일 + 플레이 버튼 오버레이
- 하단 캡션: "BTS 광화문 공연..."
- "VIEW MORE" 링크

### 7. Notice
- 섹션 타이틀: "NOTICE" / "더 큰 세상으로 향하는 FANDOM GALAXY만의 이야기"
- 4개 뉴스 항목 (title + date), border-b 구분
- hover시 bg-white/[0.02]
- "VIEW MORE" 링크

### 8. CTA
- "JOIN THE JOURNEY" (5xl~7xl, font-black)
- 하단 orange 그라데이션 glow (blur-3xl)
- 버튼 2개: "APPLY FOR AUDITION", "JOIN FANDOM GALAXY"

### 9. Footer
- border-t, bg-[#05050a]
- 좌측: 로고 + 주소 (강남구 선릉로127길 9)
- 우측: Instagram, Twitter, YouTube 아이콘 + 패밀리 사이트
- 하단: 저작권 + 개인정보처리방침

## Tech Changes

- **Add**: `framer-motion` to apps/web
- **Add**: `lucide-react` to apps/web (Menu, ChevronDown, Play, ChevronRight, Instagram, Twitter, Youtube)
- **Add**: Custom CSS classes (glass-card, glass-button, text-glow) to globals.css
- **Remove**: Snap scroll from page.tsx
- **Remove**: Old components no longer imported (SocialProof, BentoGrid, PageIndicator)

## Data (Hardcoded)

### Features
| title | subtitle | image |
|-------|----------|-------|
| 나만의 갤럭시 | Galaxy | photo-1462331940025-496dfbfc7564 |
| 매일 새로운 퀘스트 | Quest | photo-1550745165-9bc0b252726f |
| 팬덤의 기록 | Archive | photo-1514525253161-7a46d19cd819 |
| 지식 커뮤니티 | K-INSIDE | photo-1529156069898-49953e39b3ac |

### Archive Images
1. photo-1459749411175-04bf5292ceea
2. photo-1540039155733-d7696d4eb98b
3. photo-1470229722913-7c0e2dbbafd3 (center, highlighted)
4. photo-1514525253161-7a46d19cd819
5. photo-1501281668745-f7f57925c3b4

### Notice Items
| title | date |
|-------|------|
| 이무진 '대면 콘서트 상상도 못해... 행복합니다' | 2026-03-24 |
| 태민 '무대에서 빛날 수 있게 해주신 모든 분들께 감사'... | 2026-03-20 |
| 샤이니 태민, 크록스 '에코 컬렉션' 캠페인 공개 | 2026-03-15 |
| '위대한 가이드2' 이무진, 아르헨티나행 '20대 청년 모습 볼 수 있을 것' | 2026-03-10 |
