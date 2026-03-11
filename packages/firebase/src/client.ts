import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { getFirebaseConfig, isEmulatorMode } from './config'

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

export function getApp(): FirebaseApp {
  if (!app) {
    const existing = getApps()
    app = existing.length > 0 ? existing[0] : initializeApp(getFirebaseConfig())
  }
  return app
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getApp())
    if (isEmulatorMode()) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
  }
  return db
}

export function getAuthInstance(): Auth {
  if (!auth) {
    auth = getAuth(getApp())
    if (isEmulatorMode()) {
      connectAuthEmulator(auth, 'http://localhost:9099')
    }
  }
  return auth
}
