import firestore from '@react-native-firebase/firestore'
import type { Planet, User, Quest, UserQuest } from '@fandom/shared'

export function subscribePlanets(callback: (planets: Planet[]) => void) {
  return firestore()
    .collection('planets')
    .orderBy('orbitIndex')
    .onSnapshot((snapshot) => {
      const planets = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        eclipseStartedAt: doc.data().eclipseStartedAt?.toDate() ?? null,
        eclipseEndsAt: doc.data().eclipseEndsAt?.toDate() ?? null,
      })) as Planet[]
      callback(planets)
    })
}

export function subscribeUser(uid: string, callback: (user: User | null) => void) {
  return firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot((doc) => {
      if (!doc.exists) {
        callback(null)
        return
      }
      const data = doc.data()!
      callback({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() ?? new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() ?? null,
      } as User)
    })
}

export function subscribeQuests(callback: (quests: Quest[]) => void) {
  return firestore()
    .collection('quests')
    .where('isActive', '==', true)
    .onSnapshot((snapshot) => {
      const quests = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Quest[]
      callback(quests)
    })
}

export function subscribeUserQuests(uid: string, callback: (uq: UserQuest[]) => void) {
  return firestore()
    .collection('userQuests')
    .where('userId', '==', uid)
    .onSnapshot((snapshot) => {
      const userQuests = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        completedAt: doc.data().completedAt?.toDate() ?? null,
      })) as UserQuest[]
      callback(userQuests)
    })
}

export function subscribeActiveEclipses(callback: (eclipses: any[]) => void) {
  return firestore()
    .collection('eclipses')
    .where('status', '==', 'active')
    .onSnapshot((snapshot) => {
      const eclipses = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        startedAt: doc.data().startedAt?.toDate(),
        endsAt: doc.data().endsAt?.toDate(),
      }))
      callback(eclipses)
    })
}
