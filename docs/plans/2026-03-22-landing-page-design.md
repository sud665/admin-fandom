# Fandom 랜딩페이지 디자인

## 개요
루트(`/`)를 풀페이지 스크롤 랜딩페이지로 교체하고, 기존 Galaxy를 `/galaxy`로 이동.
Unsplash 우주 이미지 + 다크 테마 + Supanova 디자인 원칙 적용.

## 라우팅 변경
- `/` → 랜딩페이지 (새로 작성)
- `/galaxy` → 기존 Galaxy 3D Canvas (이동)
- BottomNav: 랜딩에서 숨김

## 파일 구조
```
apps/web/app/page.tsx              → 랜딩페이지
apps/web/app/galaxy/page.tsx       → Galaxy (이동)
apps/web/components/landing/
  ├── HeroSection.tsx
  ├── FeatureGalaxy.tsx
  ├── FeatureQuest.tsx
  ├── FeatureArchive.tsx
  ├── FeatureCommunity.tsx
  ├── SocialProof.tsx
  ├── CTASection.tsx
  └── Footer.tsx
```

## 섹션 구성 (8섹션, 풀페이지 스크롤)

| # | 섹션 | 내용 | Unsplash 이미지 |
|---|------|------|----------------|
| 1 | Hero | 서비스 한줄 소개 + CTA "우주로 입장하기" | 풀스크린 은하 배경 |
| 2 | Galaxy 소개 | 3D 우주 시각화, 행성/궤도 시스템 | 행성 클로즈업 |
| 3 | 퀘스트 시스템 | 일일 미션, Zap, 부스트 | 별똥별/오로라 |
| 4 | 아카이브 | 펀딩/캠페인 아카이브 | 성운/우주먼지 |
| 5 | K-INSIDE | 팬덤 Q&A 커뮤니티 | 은하수 |
| 6 | 소셜 프루프 | 숫자 카운터 (유저, 퀘스트 등) | 다크 그라데이션 |
| 7 | CTA | 최종 진입 유도 → /galaxy | 딥스페이스 |
| 8 | Footer | 링크, 저작권, 소셜 | 미니멀 다크 |

## 비주얼 스타일
- **배경:** 다크 (#0a0a0f ~ #111119)
- **악센트:** 보라(#a855f7), 핑크(#ec4899), 시안(#22d3ee)
- **텍스트:** 화이트 + text-white/70
- **타이포:** Pretendard, Hero text-5xl~7xl, 섹션 text-3xl~4xl
- **이미지:** Unsplash 풀페이지, bg-black/50~70 오버레이, object-cover
- **애니메이션:** scroll fade-in-up (IntersectionObserver), 숫자 카운터, CTA 글로우
- **반응형:** 모바일 퍼스트, md: 이상 2컬럼

## 구현 방식
- Next.js App Router 페이지 (React 컴포넌트)
- Tailwind CSS 4 (기존 설정 활용)
- Supanova 디자인 원칙 적용 (완전한 출력, 프리미엄 품질)
- SSG 가능 (정적 콘텐츠)

## 접근법
접근법 1 채택: 루트 교체 + Galaxy `/galaxy` 이동
