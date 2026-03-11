import { mockQuests, mockUserQuests } from '@fandom/shared'
import { QuestCard } from './QuestCard'

export function QuestList() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Today&apos;s Quest</h2>
      {mockQuests.map((quest) => {
        const userQuest = mockUserQuests.find((uq) => uq.questId === quest.id)
        return <QuestCard key={quest.id} quest={quest} userQuest={userQuest} />
      })}
    </div>
  )
}
