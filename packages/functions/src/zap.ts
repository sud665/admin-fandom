import { https } from 'firebase-functions/v2'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { HttpsError } from 'firebase-functions/v2/https'

interface ZapRequest {
  planetId: string
  amount: number
}

export const zap = https.onCall(async (request) => {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', '로그인이 필요합니다')

  const { planetId, amount } = request.data as ZapRequest

  if (!planetId || typeof amount !== 'number' || amount <= 0 || amount > 10000) {
    throw new HttpsError('invalid-argument', '유효하지 않은 요청입니다')
  }

  const db = getFirestore()

  await db.runTransaction(async (tx) => {
    const userRef = db.collection('users').doc(uid)
    const planetRef = db.collection('planets').doc(planetId)

    const userDoc = await tx.get(userRef)
    const planetDoc = await tx.get(planetRef)

    if (!userDoc.exists) throw new HttpsError('not-found', '유저를 찾을 수 없습니다')
    if (!planetDoc.exists) throw new HttpsError('not-found', '행성을 찾을 수 없습니다')

    const currentBalance = userDoc.data()!.popBalance as number
    if (currentBalance < amount) {
      throw new HttpsError('failed-precondition', 'POP이 부족합니다')
    }

    tx.update(userRef, {
      popBalance: FieldValue.increment(-amount),
      totalFeeds: FieldValue.increment(1),
    })

    const newTotalPop = (planetDoc.data()!.totalPop as number) + amount
    const newFpi = Math.min(100, Math.floor(Math.log10(newTotalPop + 1) * 15))
    tx.update(planetRef, {
      totalPop: FieldValue.increment(amount),
      fpi: newFpi,
    })

    if (planetDoc.data()!.isEclipsed) {
      const eclipseQuery = await db.collection('eclipses')
        .where('planetId', '==', planetId)
        .where('status', '==', 'active')
        .limit(1)
        .get()

      if (!eclipseQuery.empty) {
        const eclipseRef = eclipseQuery.docs[0].ref
        tx.update(eclipseRef, {
          currentDefensePop: FieldValue.increment(amount),
        })
      }
    }

    const txRef = db.collection('users').doc(uid).collection('transactions').doc()
    tx.set(txRef, {
      amount: -amount,
      type: 'spend',
      source: 'boost',
      planetId,
      createdAt: new Date(),
    })

    const feedRef = db.collection('planets').doc(planetId).collection('feedHistory').doc()
    tx.set(feedRef, {
      userId: uid,
      amount,
      createdAt: new Date(),
    })
  })

  return { success: true }
})
