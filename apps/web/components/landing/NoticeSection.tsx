'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import SectionTitle from './SectionTitle'

const notices = [
  { title: "이무진 '대면 콘서트 상상도 못해... 행복합니다'", date: '2026-03-24' },
  { title: "태민 '무대에서 빛날 수 있게 해주신 모든 분들께 감사'...", date: '2026-03-20' },
  { title: "샤이니 태민, 크록스 '에코 컬렉션' 캠페인 공개", date: '2026-03-15' },
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
