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
