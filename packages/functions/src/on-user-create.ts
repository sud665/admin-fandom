import * as functionsV1 from 'firebase-functions/v1'
import { getFirestore } from 'firebase-admin/firestore'

export const onUserCreate = functionsV1.auth.user().onCreate(async (user) => {
  const db = getFirestore()

  await db.collection('users').doc(user.uid).set({
    id: user.uid,
    displayName: user.displayName || 'Galaxy Fan',
    email: user.email || '',
    photoURL: user.photoURL || '',
    tier: 'glass',
    popBalance: 0,
    totalPopEarned: 0,
    totalSteps: 0,
    totalFeeds: 0,
    campaignCount: 0,
    isPremium: false,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  })
})
