import { AppShell } from '@/components/layout/AppShell'
import { IdCard } from '@/components/mypage/IdCard'
import { StatGrid } from '@/components/mypage/StatGrid'
import { mockCurrentUser } from '@fandom/shared'

export default function MyPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 pt-6">
        <h1 className="text-xl font-bold">MY PAGE</h1>
        <IdCard user={mockCurrentUser} />
        <StatGrid user={mockCurrentUser} />
      </div>
    </AppShell>
  )
}
