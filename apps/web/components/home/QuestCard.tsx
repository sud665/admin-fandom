import type { Quest, UserQuest } from '@fandom/shared'

interface QuestCardProps {
  quest: Quest
  userQuest?: UserQuest
}

const categoryIcons: Record<string, string> = {
  walk: '🚶',
  stream: '🎵',
  checkin: '📋',
  special: '⚡',
}

export function QuestCard({ quest, userQuest }: QuestCardProps) {
  const progress = userQuest?.progress ?? 0
  const percentage = Math.min((progress / quest.requirement) * 100, 100)
  const isCompleted = userQuest?.status === 'completed' || userQuest?.status === 'claimed'

  return (
    <div className={`rounded-xl border p-4 transition ${
      isCompleted
        ? 'border-green-500/30 bg-green-500/5'
        : quest.type === 'emergency'
          ? 'border-red-500/30 bg-red-500/5 animate-pulse'
          : 'border-white/10 bg-white/5'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[quest.category] ?? '⚡'}</span>
          <div>
            <h3 className="font-medium text-white">{quest.title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              +{quest.rewardPop} POP
              {quest.adMultiplier > 1 && ` (광고 시청 시 x${quest.adMultiplier})`}
            </p>
          </div>
        </div>
        {isCompleted && <span className="text-green-400 text-sm">✓</span>}
        {quest.type === 'emergency' && !isCompleted && (
          <span className="text-xs font-bold text-red-400">URGENT</span>
        )}
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
          <span>{progress.toLocaleString()} / {quest.requirement.toLocaleString()}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--accent-purple)] transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
