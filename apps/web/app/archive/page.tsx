import { AppShell } from '@/components/layout/AppShell'
import { CampaignList } from '@/components/archive/CampaignList'

export default function ArchivePage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 pt-6">
        <div>
          <h1 className="text-xl font-bold">ARCHIVE</h1>
          <p className="text-sm text-[var(--text-secondary)]">팬덤이 함께 만드는 서포트</p>
        </div>

        {/* 투명한 환불 안내 */}
        <div className="rounded-xl border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 p-3">
          <p className="text-xs text-[var(--accent-cyan)]">
            💡 D-Day까지 목표 미달성 시 참여 POP이 100% 자동 환불됩니다
          </p>
        </div>

        <CampaignList />
      </div>
    </AppShell>
  )
}
