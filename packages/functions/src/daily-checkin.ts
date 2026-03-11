import { https } from 'firebase-functions/v2'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { HttpsError } from 'firebase-functions/v2/https'

export const dailyCheckin = https.onCall(async (request) => {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', '로그인이 필요합니다')

  const db = getFirestore()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  const questId = 'quest-checkin'
  const docId = `${uid}_${questId}_${todayStr}`
  const uqRef = db.collection('userQuests').doc(docId)

  await db.runTransaction(async (tx) => {
    const uqDoc = await tx.get(uqRef)

    if (uqDoc.exists && uqDoc.data()!.status !== 'active') {
      throw new HttpsError('already-exists', '이미 출석 체크를 완료했습니다')
    }

    const questDoc = await tx.get(db.collection('quests').doc(questId))
    if (!questDoc.exists) throw new HttpsError('not-found', '퀘스트를 찾을 수 없습니다')
    const rewardPop = questDoc.data()!.rewardPop as number

    tx.set(uqRef, {
      userId: uid,
      questId,
      progress: 1,
      status: 'claimed',
      completedAt: new Date(),
      claimedAt: new Date(),
    })

    const userRef = db.collection('users').doc(uid)
    tx.update(userRef, {
      popBalance: FieldValue.increment(rewardPop),
      totalPopEarned: FieldValue.increment(rewardPop),
    })

    const txRef = userRef.collection('transactions').doc()
    tx.set(txRef, {
      amount: rewardPop,
      type: 'earn',
      source: 'quest',
      questId,
      createdAt: new Date(),
    })
  })

  return { success: true }
})
