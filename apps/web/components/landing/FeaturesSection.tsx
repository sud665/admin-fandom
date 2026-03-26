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
