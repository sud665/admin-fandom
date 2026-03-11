import type { User, UserTier } from '@fandom/shared'

interface IdCardProps {
  user: User
}

const tierStyles: Record<UserTier, { bg: string; border: string; label: string; glow: string }> = {
  glass: {
    bg: 'bg-gradient-to-br from-white/10 to-white/5',
    border: 'border-white/20',
    label: 'GLASS',
    glow: '',
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-600/10',
    border: 'border-yellow-500/40',
    label: 'GOLD',
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]',
  },
  obsidian: {
    bg: 'bg-gradient-to-br from-purple-900/30 to-slate-900/50',
    border: 'border-purple-500/40',
    label: 'OBSIDIAN',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.3)]',
  },
}

export function IdCard({ user }: IdCardProps) {
  const style = tierStyles[user.tier]

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 ${style.bg} ${style.border} ${style.glow}`}>
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,currentColor_10px,currentColor_11px)]" />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-[var(--text-secondary)]">FANDOM GALAXY</span>
          <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold tracking-wider">{style.label}</span>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{user.email}</p>
        </div>
        <div className="mt-6">
          <p className="text-xs text-[var(--text-secondary)]">Total POP</p>
          <p className="text-3xl font-bold text-[var(--accent-purple)]">{user.popBalance.toLocaleString()}</p>
        </div>
        <div className="mt-4 text-xs text-[var(--text-secondary)]">
          Member since {user.createdAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
