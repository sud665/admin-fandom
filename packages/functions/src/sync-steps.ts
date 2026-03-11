import { https } from 'firebase-functions/v2'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { HttpsError } from 'firebase-functions/v2/https'

interface SyncStepsRequest {
  steps: number
}

export const syncSteps = https.onCall(async (request) => {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', '로그인이 필요합니다')

  const { steps } = request.data as SyncStepsRequest
  if (typeof steps !== 'number' || steps < 0 || steps > 100_000) {
    throw new HttpsError('invalid-argument', '유효하지 않은 걸음 수입니다')
  }

  const db = getFirestore()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const questId = 'quest-walk'
  const docId = `${uid}_${questId}_${todayStr}`
  const uqRef = db.collection('userQuests').doc(docId)

  await db.runTransaction(async (tx) => {
    const uqDoc = await tx.get(uqRef)
    const questDoc = await tx.get(db.collection('quests').doc(questId))
    if (!questDoc.exists) return

    const requirement = questDoc.data()!.requirement as number
    const rewardPop = questDoc.data()!.rewardPop as number
    const prevProgress = uqDoc.exists ? (uqDoc.data()!.progress as number) : 0
    const prevStatus = uqDoc.exists ? uqDoc.data()!.status : 'active'

    if (prevStatus === 'claimed') return

    const newProgress = Math.max(prevProgress, steps)
    const completed = newProgress >= requirement && prevStatus === 'active'

    tx.set(uqRef, {
      userId: uid,
      questId,
      progress: newProgress,
      status: completed ? 'completed' : 'active',
      completedAt: completed ? new Date() : null,
    }, { merge: true })

    const userRef = db.collection('users').doc(uid)
    if (steps > prevProgress) {
      tx.update(userRef, {
        totalSteps: FieldValue.increment(steps - prevProgress),
      })
    }

    if (completed) {
      tx.update(userRef, {
        popBalance: FieldValue.increment(rewardPop),
        totalPopEarned: FieldValue.increment(rewardPop),
      })
      tx.set(userRef.collection('transactions').doc(), {
        amount: rewardPop,
        type: 'earn',
        source: 'quest',
        questId,
        createdAt: new Date(),
      })
      tx.update(uqRef, { status: 'claimed', claimedAt: new Date() })
    }
  })

  return { success: true, steps }
})
