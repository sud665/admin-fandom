import { firestore } from 'firebase-functions/v2'
import { scheduler } from 'firebase-functions/v2'
import { getFirestore } from 'firebase-admin/firestore'

export const resolveEclipse = firestore.onDocumentUpdated(
  'eclipses/{eclipseId}',
  async (event) => {
    const before = event.data?.before.data()
    const after = event.data?.after.data()
    if (!before || !after) return

    if (before.status !== 'active' || after.status !== 'active') return

    if (after.currentDefensePop >= after.requiredPop) {
      const db = getFirestore()
      const batch = db.batch()

      batch.update(event.data!.after.ref, { status: 'defended' })

      const planetRef = db.collection('planets').doc(after.planetId)
      batch.update(planetRef, {
        isEclipsed: false,
        eclipseStartedAt: null,
        eclipseEndsAt: null,
      })

      await batch.commit()
      console.log(`Eclipse on ${after.planetId} defended!`)
    }
  }
)

export const checkExpiredEclipses = scheduler.onSchedule(
  { schedule: 'every 10 minutes', timeZone: 'Asia/Seoul' },
  async () => {
    const db = getFirestore()
    const now = new Date()

    const expired = await db.collection('eclipses')
      .where('status', '==', 'active')
      .where('endsAt', '<=', now)
      .get()

    for (const doc of expired.docs) {
      const data = doc.data()
      const batch = db.batch()

      batch.update(doc.ref, { status: 'failed' })

      const planetRef = db.collection('planets').doc(data.planetId)
      const planetDoc = await planetRef.get()
      if (planetDoc.exists) {
        const currentFpi = planetDoc.data()!.fpi as number
        const newFpi = Math.max(0, Math.floor(currentFpi * 0.95))
        batch.update(planetRef, {
          isEclipsed: false,
          eclipseStartedAt: null,
          eclipseEndsAt: null,
          fpi: newFpi,
        })
      }

      await batch.commit()
      console.log(`Eclipse on ${data.planetId} failed! FPI reduced.`)
    }
  }
)
