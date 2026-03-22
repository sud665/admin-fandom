import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fandom Galaxy — 차세대 시네마틱 글로벌 팬덤 플랫폼',
  description:
    '좋아하는 아티스트를 중심으로 펼쳐지는 시네마틱 갤럭시. 퀘스트를 완수하고, 팬덤의 궤도를 넓혀가세요.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
