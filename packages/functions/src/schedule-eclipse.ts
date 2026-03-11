import { scheduler } from 'firebase-functions/v2'
import { getFirestore } from 'firebase-admin/firestore'

export const scheduleEclipse = scheduler.onSchedule(
  { schedule: 'every 6 hours', timeZone: 'Asia/Seoul' },
  async () => {
    const db = getFirestore()

    const activeEclipses = await db.collection('eclipses')
      .where('status', '==', 'active')
      .get()

    if (!activeEclipses.empty) {
      console.log('Active eclipse exists, skipping')
      return
    }

    const planets = await db.collection('planets')
      .where('isEclipsed', '==', false)
      .get()

    if (planets.empty) {
      console.log('No available planets for eclipse')
      return
    }

    const randomIndex = Math.floor(Math.random() * planets.size)
    const targetPlanet = planets.docs[randomIndex]
    const planetData = targetPlanet.data()

    const requiredPop = Math.floor(planetData.totalPop * 0.05)
    const durationMs = 60 * 60 * 1000
    const now = new Date()
    const endsAt = new Date(now.getTime() + durationMs)

    const batch = db.batch()

    const eclipseRef = db.collection('eclipses').doc()
    batch.set(eclipseRef, {
      planetId: targetPlanet.id,
      startedAt: now,
      endsAt,
      status: 'active',
      requiredPop,
      currentDefensePop: 0,
    })

    batch.update(targetPlanet.ref, {
      isEclipsed: true,
      eclipseStartedAt: now,
      eclipseEndsAt: endsAt,
    })

    await batch.commit()
    console.log(`Eclipse triggered on ${planetData.name}, required defense: ${requiredPop} POP`)
  }
)
