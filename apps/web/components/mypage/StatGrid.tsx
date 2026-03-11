import type { User } from '@fandom/shared'

interface StatGridProps {
  user: User
}

export function StatGrid({ user }: StatGridProps) {
  const stats = [
    { label: '누적 걸음수', value: user.totalSteps.toLocaleString(), icon: '🚶' },
    { label: '총 기여 POP', value: user.totalFeeds.toLocaleString(), icon: '⚡' },
    { label: '참여 캠페인', value: `${user.campaignCount}건`, icon: '📦' },
    { label: '구독 상태', value: user.isPremium ? 'Premium' : 'Free', icon: '👑' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-xl">{stat.icon}</span>
          <p className="mt-2 text-lg font-bold">{stat.value}</p>
          <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
