import type { Campaign } from '@fandom/shared'

interface CampaignCardProps {
  campaign: Campaign
}

const planetEmojis: Record<string, string> = {
  bts: '💜',
  blackpink: '🖤',
  newjeans: '🐰',
  'stray-kids': '🖤',
  aespa: '🦋',
}

function getDDay(dDay: Date): string {
  const diff = Math.ceil((dDay.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (diff > 0) return `D-${diff}`
  if (diff === 0) return 'D-Day'
  return `D+${Math.abs(diff)}`
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const percentage = Math.min(Math.round((campaign.currentPop / campaign.targetPop) * 100), 100)
  const dDay = getDDay(campaign.dDay)
  const isUrgent = campaign.status === 'active' && dDay.startsWith('D-') && parseInt(dDay.slice(2)) <= 3
  const emoji = planetEmojis[campaign.planetId] ?? '⭐'

  return (
    <div className={`rounded-xl border p-4 transition ${
      campaign.status === 'success'
        ? 'border-green-500/30 bg-green-500/5'
        : campaign.status === 'failed'
          ? 'border-red-500/20 bg-red-500/5 opacity-60'
          : isUrgent
            ? 'border-orange-500/30 bg-orange-500/5'
            : 'border-white/10 bg-white/5'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h3 className="font-medium text-white">{campaign.title}</h3>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              목표: {campaign.targetPop.toLocaleString()} POP
            </p>
          </div>
        </div>
        {campaign.status === 'success' && (
          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400">성공</span>
        )}
        {campaign.status === 'failed' && (
          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">실패</span>
        )}
        {isUrgent && (
          <span className="animate-pulse rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-bold text-orange-400">긴급!</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
          <span>{campaign.currentPop.toLocaleString()} / {campaign.targetPop.toLocaleString()} POP</span>
          <span>{percentage}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all ${
              campaign.status === 'success' ? 'bg-green-500' :
              campaign.status === 'failed' ? 'bg-red-500' :
              isUrgent ? 'bg-orange-500' : 'bg-[var(--accent-purple)]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        {campaign.status === 'active' && <span>{dDay}</span>}
        {campaign.status === 'success' && campaign.resultNote && (
          <p className="line-clamp-1 text-green-400/80">{campaign.resultNote}</p>
        )}
        {campaign.status === 'failed' && <span>목표 미달성 · 자동 환불 완료</span>}
      </div>
    </div>
  )
}
