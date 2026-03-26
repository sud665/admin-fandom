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
