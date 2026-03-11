'use client'

import dynamic from 'next/dynamic'
import { useEffect, useCallback } from 'react'
import { useGalaxyStore } from '@/store/galaxy-store'

const GalaxyCanvas = dynamic(
  () => import('@/components/galaxy/GalaxyCanvas').then((m) => m.GalaxyCanvas),
  { ssr: false }
)

export default function GalaxyEmbedPage() {
  const { triggerSuperBoost } = useGalaxyStore()

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data)
      switch (msg.type) {
        case 'UPDATE_PLANETS':
          useGalaxyStore.setState({ planets: msg.planets })
          break
        case 'ECLIPSE_UPDATE':
          useGalaxyStore.setState({
            planets: msg.planets,
            isEclipseWarning: msg.planets.some((p: any) => p.isEclipsed),
          })
          break
        case 'SUPER_BOOST':
          triggerSuperBoost(msg.boost)
          break
      }
    } catch (e) {
      // ignore non-JSON messages
    }
  }, [triggerSuperBoost])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  return (
    <div className="relative h-dvh w-full">
      <GalaxyCanvas />
    </div>
  )
}
