import { mockKInsideQuestions } from '@fandom/shared'
import { QuestionCard } from './QuestionCard'

export function QuestionList() {
  return (
    <div className="space-y-3">
      {mockKInsideQuestions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  )
}
