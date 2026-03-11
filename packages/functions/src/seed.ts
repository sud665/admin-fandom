import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()
const db = getFirestore()

const planets = [
  { id: 'bts', name: 'BTS', artistId: 'artist-bts', fpi: 85, totalPop: 1_250_000, orbitIndex: 0, color: '#7B2FF2', isEclipsed: false, eclipseStartedAt: null, eclipseEndsAt: null },
  { id: 'blackpink', name: 'BLACKPINK', artistId: 'artist-bp', fpi: 72, totalPop: 980_000, orbitIndex: 1, color: '#FF2D78', isEclipsed: false, eclipseStartedAt: null, eclipseEndsAt: null },
  { id: 'newjeans', name: 'NewJeans', artistId: 'artist-nj', fpi: 65, totalPop: 720_000, orbitIndex: 2, color: '#00D4AA', isEclipsed: false, eclipseStartedAt: null, eclipseEndsAt: null },
  { id: 'stray-kids', name: 'Stray Kids', artistId: 'artist-skz', fpi: 58, totalPop: 650_000, orbitIndex: 3, color: '#FF6B35', isEclipsed: false, eclipseStartedAt: null, eclipseEndsAt: null },
  { id: 'aespa', name: 'aespa', artistId: 'artist-aespa', fpi: 45, totalPop: 420_000, orbitIndex: 4, color: '#C4B5FD', isEclipsed: false, eclipseStartedAt: null, eclipseEndsAt: null },
]

const quests = [
  { id: 'quest-walk', title: '오늘의 걸음수', type: 'daily', category: 'walk', requirement: 5000, rewardPop: 50, adMultiplier: 3, isActive: true },
  { id: 'quest-checkin', title: '출석 체크', type: 'daily', category: 'checkin', requirement: 1, rewardPop: 10, adMultiplier: 3, isActive: true },
]

async function seed() {
  const batch = db.batch()
  for (const planet of planets) {
    batch.set(db.collection('planets').doc(planet.id), planet)
  }
  for (const quest of quests) {
    batch.set(db.collection('quests').doc(quest.id), quest)
  }
  await batch.commit()
  console.log('Seed data written successfully')
}

seed().catch(console.error)
