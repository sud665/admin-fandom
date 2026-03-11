import type { KInsideQuestion } from '@fandom/shared'

interface QuestionCardProps {
  question: KInsideQuestion
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return '방금 전'
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export function QuestionCard({ question }: QuestionCardProps) {
  const isAnswered = question.status === 'answered'
  const answerCount = isAnswered ? Math.floor(Math.random() * 15) + 3 : Math.floor(Math.random() * 5)

  return (
    <div className={`rounded-xl border p-4 transition ${
      isAnswered ? 'border-green-500/20 bg-white/5' : 'border-white/10 bg-white/5'
    }`}>
      {/* Bounty badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-[var(--accent-purple)]/20 px-2 py-1 text-xs font-bold text-[var(--accent-purple)]">
            🏆 {question.bountyPop} POP
          </span>
          {isAnswered ? (
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400">채택됨</span>
          ) : (
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-medium text-yellow-400">대기중</span>
          )}
        </div>
        <span className="text-[10px] text-[var(--text-secondary)]">{getTimeAgo(question.createdAt)}</span>
      </div>

      {/* Question title */}
      <h3 className="mt-3 font-medium text-white leading-snug">{question.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)] leading-relaxed">{question.body}</p>

      {/* Footer */}
      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
        <span>💬 답변 {answerCount}</span>
      </div>
    </div>
  )
}
