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
