'use client'

import { useRef, MouseEvent } from 'react'
import Image from 'next/image'
import { useParallax } from '@/hooks/useParallax'

const cards = [
  {
    title: '나만의 갤럭시',
    desc: '실시간 3D 우주에서 팬덤의 에너지를 경험하세요',
    badge: 'Galaxy',
    badgeColor: '#7B2FF2',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80',
    area: 'galaxy',
  },
  {
    title: '매일 새로운 퀘스트',
    desc: 'Zap 포인트를 모으고 팬덤을 빛내세요',
    badge: 'Quest',
    badgeColor: '#FF2D78',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    area: 'quest',
  },
  {
    title: '팬덤의 기록',
    desc: '펀딩, 캠페인, 모든 순간을 아카이브',
    badge: 'Archive',
    badgeColor: '#00D4AA',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80',
    area: 'archive',
  },
  {
    title: '지식 커뮤니티',
    desc: '팬들의 집단 지성이 만드는 인사이트',
    badge: 'K-INSIDE',
    badgeColor: '#00D4AA',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    area: 'kinside',
  },
]

function TiltCard({ card }: { card: (typeof cards)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (el) el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-2xl border border-white/10 transition-transform duration-300 ease-out"
      style={{ gridArea: card.area, transformStyle: 'preserve-3d' } as React.CSSProperties}
    >
      <Image
        src={card.image}
        alt={card.title}
        fill
        loading="lazy"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-6">
        <span
          className="mb-2 inline-block w-fit rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider sm:text-xs"
          style={{ backgroundColor: `${card.badgeColor}20`, color: card.badgeColor }}
        >
          {card.badge}
        </span>
        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">{card.title}</h3>
        <p className="text-xs text-white/50 sm:text-sm">{card.desc}</p>
      </div>
    </div>
  )
}

export default function BentoGrid() {
  const { ref, progress } = useParallax()
  const contentY = (progress - 0.5) * -30

  return (
    <section
      ref={ref}
      className="relative flex h-dvh snap-start snap-always items-center overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Dark base bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d15] to-[#0a0a0f]" />

      <div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 will-change-transform md:px-12"
        style={{ transform: `translateY(${contentY}px)` }}
      >
        {/* Section header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium tracking-[0.25em] text-white/40">FEATURES</p>
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            팬덤을 위한{' '}
            <span className="bg-gradient-to-r from-[#7B2FF2] to-[#FF2D78] bg-clip-text text-transparent">
              모든 것
            </span>
          </h2>
        </div>

        {/* Bento Grid — asymmetric tile layout */}
        <div className="bento-grid h-[55vh] max-h-[520px]">
          {cards.map((card) => (
            <TiltCard key={card.badge} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
