import { AppShell } from '@/components/layout/AppShell'
import { QuestList } from '@/components/home/QuestList'

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 pt-6">
        <div>
          <h1 className="text-xl font-bold">활동 센터</h1>
          <p className="text-sm text-[var(--text-secondary)]">오늘의 미션을 완료하고 POP을 획득하세요</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-[var(--accent-cyan)]">AI Daily Briefing</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            BTS 행성이 FPI 85를 기록하며 1위를 유지하고 있습니다. Stray Kids 행성에 이클립스가 진행 중입니다!
          </p>
        </div>
        <QuestList />
      </div>
    </AppShell>
  )
}
