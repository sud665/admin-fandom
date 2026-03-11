import { AppShell } from '@/components/layout/AppShell'

export default function HomePage() {
  return (
    <AppShell>
      <div className="p-4">
        <h1 className="text-xl font-bold">HOME</h1>
        <p className="mt-2 text-[var(--text-secondary)]">활동센터</p>
      </div>
    </AppShell>
  )
}
