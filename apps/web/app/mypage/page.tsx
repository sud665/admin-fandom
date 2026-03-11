import { AppShell } from '@/components/layout/AppShell'

export default function MyPage() {
  return (
    <AppShell>
      <div className="p-4">
        <h1 className="text-xl font-bold">MY PAGE</h1>
        <p className="mt-2 text-[var(--text-secondary)]">ID 카드</p>
      </div>
    </AppShell>
  )
}
