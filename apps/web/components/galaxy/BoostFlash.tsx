'use client'

import { useEffect, useState } from 'react'
import { useGalaxyStore } from '@/store/galaxy-store'

export function BoostFlash() {
  const { activeBoost, clearBoost } = useGalaxyStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (activeBoost) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        clearBoost()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [activeBoost, clearBoost])

  if (!visible || !activeBoost) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute inset-0 animate-[flash_0.5s_ease-out] bg-white/30" />
      <div className="absolute bottom-20 left-0 right-0 px-4">
        <div className="mx-auto max-w-md animate-[slideUp_0.5s_ease-out] rounded-xl bg-[var(--accent-purple)]/90 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-sm font-bold text-white">
            ⚡ {activeBoost.userName}님이 팬덤을 위해 슈퍼 부스팅을 시작했습니다!
          </p>
          <p className="mt-1 text-xs text-white/70">
            +{activeBoost.popAmount.toLocaleString()} POP
          </p>
        </div>
      </div>
    </div>
  )
}
