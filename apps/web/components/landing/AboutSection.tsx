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
