'use client'

import dynamic from 'next/dynamic'
import { AppShell } from '@/components/layout/AppShell'
import { EclipseOverlay } from '@/components/galaxy/EclipseOverlay'
import { BoostFlash } from '@/components/galaxy/BoostFlash'
import { DemoControls } from '@/components/galaxy/DemoControls'

const GalaxyCanvas = dynamic(
  () => import('@/components/galaxy/GalaxyCanvas').then((m) => m.GalaxyCanvas),
  { ssr: false }
)

export default function GalaxyPage() {
  return (
    <AppShell>
      <div className="relative h-dvh w-full">
        <GalaxyCanvas />
        <EclipseOverlay />
        <BoostFlash />
        <DemoControls />
      </div>
    </AppShell>
  )
}
