'use client'

import dynamic from 'next/dynamic'
import { AppShell } from '@/components/layout/AppShell'

const GalaxyCanvas = dynamic(
  () => import('@/components/galaxy/GalaxyCanvas').then((m) => m.GalaxyCanvas),
  { ssr: false }
)

export default function GalaxyPage() {
  return (
    <AppShell>
      <GalaxyCanvas />
    </AppShell>
  )
}
