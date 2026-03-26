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
