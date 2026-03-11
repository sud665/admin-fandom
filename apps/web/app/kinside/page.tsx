import { AppShell } from '@/components/layout/AppShell'
import { QuestionList } from '@/components/kinside/QuestionList'

export default function KInsidePage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 pt-6">
        <div>
          <h1 className="text-xl font-bold">K-INSIDE</h1>
          <p className="text-sm text-[var(--text-secondary)]">팬덤의 궁금증을 해결하세요</p>
        </div>

        {/* 현상금 안내 */}
        <div className="rounded-xl border border-[var(--accent-purple)]/20 bg-[var(--accent-purple)]/5 p-3">
          <p className="text-xs text-[var(--accent-purple)]">
            💡 POP을 현상금으로 걸고 질문하세요. 채택된 답변자가 현상금을 받습니다
          </p>
        </div>

        <QuestionList />
      </div>
    </AppShell>
  )
}
