# Phase 1: 핵심 루프 MVP 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** POP 재화의 핵심 루프(Earn → Feed → Defend)가 실제 Firebase 백엔드와 연동되어 동작하는 React Native Expo 앱을 개발한다.

**Architecture:** RN Expo 앱에서 GALAXY 탭은 WebView로 기존 R3F 코드를 재사용하고, HOME/MY 탭은 네이티브 RN으로 구현한다. 모든 데이터는 Firestore 실시간 동기화를 사용하며, POP 변동은 Cloud Functions에서 검증 처리한다.

**Tech Stack:** React Native Expo 52, Expo Router 4, react-native-webview, Firebase 11 (Auth, Firestore, Cloud Functions), expo-sensors (Pedometer), TypeScript 5.7

---

## Task 1: Firebase 프로젝트 초기화 + Cloud Functions 스캐폴딩

**Files:**
- Create: `packages/functions/package.json`
- Create: `packages/functions/tsconfig.json`
- Create: `packages/functions/src/index.ts`
- Create: `firebase.json`
- Create: `.firebaserc`
- Modify: `pnpm-workspace.yaml`

**Step 1: Firebase CLI로 프로젝트 초기화**

```bash
# Firebase CLI 설치 (없으면)
npm install -g firebase-tools

# 프로젝트 루트에서 Firebase 초기화
cd /Users/max/Desktop/wishket/admin-fandom
firebase login
firebase init
# 선택: Firestore, Functions, Emulators
# Functions 언어: TypeScript
# Emulators: Auth, Firestore, Functions
```

**Step 2: Cloud Functions 패키지 구성**

`packages/functions/package.json`:
```json
{
  "name": "@fandom/functions",
  "version": "0.0.0",
  "private": true,
  "main": "lib/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "deploy": "firebase deploy --only functions"
  },
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "firebase-admin": "^13.0.0",
    "firebase-functions": "^6.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

`packages/functions/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./lib",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"]
}
```

`packages/functions/src/index.ts`:
```typescript
import { initializeApp } from 'firebase-admin/app'

initializeApp()

// Cloud Functions will be added in subsequent tasks
export {}
```

**Step 3: firebase.json 생성**

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "packages/functions",
    "runtime": "nodejs20"
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "functions": { "port": 5001 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

**Step 4: pnpm-workspace.yaml에 functions 추가**

현재 파일을 읽고 `packages/functions`가 포함되어 있는지 확인. 없으면 추가:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Step 5: Firestore rules 초기 파일 생성**

`firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 읽기 가능
    match /planets/{planetId} {
      allow read: if request.auth != null;
      allow write: if false; // Functions만 쓰기 가능
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId
                   && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['popBalance', 'totalPopEarned', 'tier']);
    }
    match /users/{userId}/transactions/{txId} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Functions만 쓰기 가능
    }
    match /eclipses/{eclipseId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /quests/{questId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /userQuests/{docId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false;
    }
  }
}
```

`firestore.indexes.json`:
```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

**Step 6: 에뮬레이터 실행 테스트**

```bash
cd /Users/max/Desktop/wishket/admin-fandom
firebase emulators:start
```
Expected: Emulator UI 열림 (http://localhost:4000), Auth(9099), Firestore(8080), Functions(5001) 포트 활성화

**Step 7: 커밋**

```bash
git add packages/functions/ firebase.json .firebaserc firestore.rules firestore.indexes.json pnpm-workspace.yaml
git commit -m "feat: Firebase 프로젝트 초기화 + Cloud Functions 스캐폴딩"
```

---

## Task 2: Firestore 시드 데이터 + 공유 타입 확장

**Files:**
- Create: `packages/functions/src/seed.ts`
- Modify: `packages/shared/src/types/user.ts`
- Modify: `packages/shared/src/types/planet.ts`

**Step 1: 공유 타입에 Firestore 필드 추가**

`packages/shared/src/types/user.ts` — popBalance 필드 추가:
```typescript
export interface User {
  id: string
  displayName: string
  email: string
  photoURL?: string
  tier: UserTier
  popBalance: number     // 현재 잔액 (신규)
  totalPopEarned: number // 누적 획득 (기존 totalPop → rename)
  totalSteps: number
  totalFeeds: number
  campaignCount: number
  isPremium: boolean
  createdAt: Date
  lastLoginAt?: Date     // 신규
}
```

주의: 기존 `totalPop` → `popBalance` + `totalPopEarned`로 분리. mock 데이터와 웹 컴포넌트에서 참조하는 곳 전부 업데이트.

`packages/shared/src/types/planet.ts` — eclipseStartedAt 추가:
```typescript
export interface Planet {
  id: string
  name: string
  artistId: string
  fpi: number
  totalPop: number
  orbitIndex: number
  color: string
  isEclipsed: boolean
  eclipseStartedAt: Date | null  // 신규
  eclipseEndsAt: Date | null
}
```

**Step 2: mock 데이터 업데이트**

`packages/shared/src/mock/users.ts`:
```typescript
export const mockCurrentUser: User = {
  id: 'user-001',
  displayName: 'GalaxyFan',
  email: 'fan@example.com',
  tier: 'gold',
  popBalance: 25_000,
  totalPopEarned: 180_000,
  totalSteps: 1_200_000,
  totalFeeds: 18_000,
  campaignCount: 12,
  isPremium: false,
  createdAt: new Date('2025-06-01'),
}
```

`packages/shared/src/mock/planets.ts` — `eclipseStartedAt` 필드 추가:
```typescript
// 각 행성에 eclipseStartedAt: null 추가
// eclipsed인 stray-kids는 eclipseStartedAt: new Date(Date.now() - 30 * 60 * 1000)
```

**Step 3: Firestore 시드 스크립트 작성**

`packages/functions/src/seed.ts`:
```typescript
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// 에뮬레이터에서 실행 시 자동으로 환경변수 사용
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
```

**Step 4: 시드 실행 확인**

```bash
# 에뮬레이터 실행 상태에서
cd packages/functions
FIRESTORE_EMULATOR_HOST=localhost:8080 npx ts-node src/seed.ts
```
Expected: "Seed data written successfully"
에뮬레이터 UI (http://localhost:4000/firestore)에서 planets, quests 컬렉션 확인

**Step 5: 웹 컴포넌트에서 깨지는 부분 수정**

`totalPop` → `popBalance` 변경으로 영향받는 파일 확인 및 수정:
- `apps/web/components/mypage/StatGrid.tsx` — `user.totalPop` → `user.popBalance`
- `apps/web/components/mypage/IdCard.tsx` — 참조 확인

**Step 6: 커밋**

```bash
git add packages/shared/ packages/functions/src/seed.ts apps/web/
git commit -m "feat: Firestore 스키마 확장 + 시드 데이터 스크립트"
```

---

## Task 3: Firebase Auth + RN 로그인 화면

**Files:**
- Create: `apps/mobile/app/login.tsx`
- Create: `apps/mobile/lib/auth.ts`
- Create: `apps/mobile/contexts/AuthContext.tsx`
- Modify: `apps/mobile/app/_layout.tsx`
- Modify: `apps/mobile/package.json`
- Create: `packages/functions/src/on-user-create.ts`
- Modify: `packages/functions/src/index.ts`

**Step 1: RN 앱에 Firebase + Auth 의존성 추가**

```bash
cd apps/mobile
npx expo install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npx expo install @react-native-google-signin/google-signin
npx expo install expo-apple-authentication
```

`apps/mobile/package.json`에 추가될 주요 deps:
```json
{
  "dependencies": {
    "@react-native-firebase/app": "^21.0.0",
    "@react-native-firebase/auth": "^21.0.0",
    "@react-native-firebase/firestore": "^21.0.0",
    "@react-native-google-signin/google-signin": "^14.0.0",
    "expo-apple-authentication": "~7.0.0"
  }
}
```

**Step 2: app.json에 Firebase 플러그인 추가**

`apps/mobile/app.json` 수정:
```json
{
  "expo": {
    "name": "Fandom Galaxy",
    "slug": "fandom-galaxy",
    "version": "1.0.0",
    "scheme": "fandom-galaxy",
    "platforms": ["ios", "android"],
    "newArchEnabled": true,
    "ios": {
      "bundleIdentifier": "com.fandom.galaxy",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.fandom.galaxy",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-google-signin/google-signin",
      "expo-apple-authentication"
    ]
  }
}
```

주의: `GoogleService-Info.plist`(iOS)와 `google-services.json`(Android)은 Firebase 콘솔에서 다운로드하여 `apps/mobile/` 루트에 배치. `.gitignore`에 추가.

**Step 3: Auth 헬퍼 모듈 작성**

`apps/mobile/lib/auth.ts`:
```typescript
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'

// Google Sign-In 초기화 (app.json의 webClientId 사용)
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
})

export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  await GoogleSignin.hasPlayServices()
  const signInResult = await GoogleSignin.signIn()
  const idToken = signInResult.data?.idToken
  if (!idToken) throw new Error('Google Sign-In failed: no idToken')
  const credential = auth.GoogleAuthProvider.credential(idToken)
  return auth().signInWithCredential(credential)
}

export async function signInWithApple(): Promise<FirebaseAuthTypes.UserCredential> {
  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  })
  const { identityToken, nonce } = appleCredential
  if (!identityToken) throw new Error('Apple Sign-In failed: no identityToken')
  const credential = auth.AppleAuthProvider.credential(identityToken, nonce)
  return auth().signInWithCredential(credential)
}

export async function signOut(): Promise<void> {
  await auth().signOut()
}

export function onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
  return auth().onAuthStateChanged(callback)
}
```

**Step 4: AuthContext 생성**

`apps/mobile/contexts/AuthContext.tsx`:
```typescript
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type FirebaseAuthTypes } from '@react-native-firebase/auth'
import { onAuthStateChanged } from '@/lib/auth'

interface AuthContextType {
  user: FirebaseAuthTypes.User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setUser(u)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

**Step 5: 로그인 화면 작성**

`apps/mobile/app/login.tsx`:
```typescript
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { signInWithGoogle, signInWithApple } from '@/lib/auth'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      // AuthContext가 상태 감지 → 자동으로 탭 화면으로 이동
    } catch (e) {
      console.error('Google login error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleApple = async () => {
    setLoading(true)
    try {
      await signInWithApple()
    } catch (e) {
      console.error('Apple login error:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7B2FF2" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Ionicons name="planet" size={80} color="#7B2FF2" />
      <Text style={styles.title}>FANDOM GALAXY</Text>
      <Text style={styles.subtitle}>팬덤의 은하계에 입장하세요</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogle}>
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.buttonText}>Google로 시작하기</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity style={[styles.button, styles.appleButton]} onPress={handleApple}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.buttonText}>Apple로 시작하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#e2e8f0', fontSize: 32, fontWeight: 'bold', marginTop: 24 },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 8, marginBottom: 48 },
  buttonContainer: { width: '100%', gap: 12 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
  googleButton: { backgroundColor: '#4285F4' },
  appleButton: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
```

**Step 6: Root layout에 AuthProvider + 인증 라우팅 추가**

`apps/mobile/app/_layout.tsx`:
```typescript
import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

function AuthGate() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (isLoading) return
    const inAuthGroup = segments[0] === '(tabs)'
    if (user && !inAuthGroup) {
      router.replace('/(tabs)/galaxy')
    } else if (!user && inAuthGroup) {
      router.replace('/login')
    }
  }, [user, isLoading, segments])

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7B2FF2" />
      </View>
    )
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' },
})
```

**Step 7: onUserCreate Cloud Function 작성**

`packages/functions/src/on-user-create.ts`:
```typescript
import { auth } from 'firebase-functions/v2'
import { getFirestore } from 'firebase-admin/firestore'

export const onUserCreate = auth.user().onCreate(async (user) => {
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
```

`packages/functions/src/index.ts` 수정:
```typescript
import { initializeApp } from 'firebase-admin/app'
initializeApp()

export { onUserCreate } from './on-user-create'
```

**Step 8: 커밋**

```bash
git add apps/mobile/ packages/functions/
git commit -m "feat: Firebase Auth + RN 로그인 화면 + onUserCreate Function"
```

---

## Task 4: packages/firebase를 RN 호환으로 리팩터

**Files:**
- Create: `apps/mobile/lib/firestore.ts`
- Modify: `packages/firebase/src/config.ts`

**배경:** 현재 `packages/firebase`는 웹용 Firebase SDK(`firebase/app`)를 사용. RN에서는 `@react-native-firebase`를 사용하므로, 앱에서는 별도의 Firestore 접근 레이어를 만든다.

**Step 1: RN용 Firestore 헬퍼 작성**

`apps/mobile/lib/firestore.ts`:
```typescript
import firestore from '@react-native-firebase/firestore'
import type { Planet, User, Quest, UserQuest } from '@fandom/shared'

// ── Planets ──
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

// ── User ──
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

// ── Quests ──
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

// ── User Quests ──
export function subscribeUserQuests(uid: string, callback: (uq: UserQuest[]) => void) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

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

// ── Eclipses ──
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
```

**Step 2: 커밋**

```bash
git add apps/mobile/lib/firestore.ts
git commit -m "feat: RN용 Firestore 실시간 구독 헬퍼"
```

---

## Task 5: POP 시스템 — Zap (Feed) Cloud Function

**Files:**
- Create: `packages/functions/src/zap.ts`
- Modify: `packages/functions/src/index.ts`

**Step 1: Zap Callable Function 작성**

`packages/functions/src/zap.ts`:
```typescript
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

    // 1. 유저 잔액 차감
    tx.update(userRef, {
      popBalance: FieldValue.increment(-amount),
      totalFeeds: FieldValue.increment(1),
    })

    // 2. 행성 POP 증가 + FPI 재계산
    const newTotalPop = (planetDoc.data()!.totalPop as number) + amount
    const newFpi = Math.min(100, Math.floor(Math.log10(newTotalPop + 1) * 15))
    tx.update(planetRef, {
      totalPop: FieldValue.increment(amount),
      fpi: newFpi,
    })

    // 3. 이클립스 방어 중이면 방어 POP도 증가
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

    // 4. 트랜잭션 기록
    const txRef = db.collection('users').doc(uid).collection('transactions').doc()
    tx.set(txRef, {
      amount: -amount,
      type: 'spend',
      source: 'boost',
      planetId,
      createdAt: new Date(),
    })

    // 5. Feed 히스토리 기록
    const feedRef = db.collection('planets').doc(planetId).collection('feedHistory').doc()
    tx.set(feedRef, {
      userId: uid,
      amount,
      createdAt: new Date(),
    })
  })

  return { success: true }
})
```

**Step 2: index.ts에 export 추가**

`packages/functions/src/index.ts`:
```typescript
import { initializeApp } from 'firebase-admin/app'
initializeApp()

export { onUserCreate } from './on-user-create'
export { zap } from './zap'
```

**Step 3: 에뮬레이터에서 테스트**

```bash
firebase emulators:start
# 다른 터미널에서 curl로 테스트 (인증 토큰 필요하므로 에뮬레이터 UI에서 확인)
```

**Step 4: 커밋**

```bash
git add packages/functions/
git commit -m "feat: POP Zap(Feed) Callable Function — 원자적 트랜잭션"
```

---

## Task 6: 퀘스트 완료 + 출석 체크 Cloud Functions

**Files:**
- Create: `packages/functions/src/complete-quest.ts`
- Create: `packages/functions/src/daily-checkin.ts`
- Create: `packages/functions/src/sync-steps.ts`
- Modify: `packages/functions/src/index.ts`

**Step 1: 출석 체크 Function**

`packages/functions/src/daily-checkin.ts`:
```typescript
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

    // 퀘스트 보상 조회
    const questDoc = await tx.get(db.collection('quests').doc(questId))
    if (!questDoc.exists) throw new HttpsError('not-found', '퀘스트를 찾을 수 없습니다')
    const rewardPop = questDoc.data()!.rewardPop as number

    // UserQuest 완료 처리
    tx.set(uqRef, {
      userId: uid,
      questId,
      progress: 1,
      status: 'claimed',
      completedAt: new Date(),
      claimedAt: new Date(),
    })

    // POP 지급
    const userRef = db.collection('users').doc(uid)
    tx.update(userRef, {
      popBalance: FieldValue.increment(rewardPop),
      totalPopEarned: FieldValue.increment(rewardPop),
    })

    // 트랜잭션 기록
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
```

**Step 2: 걸음 수 동기화 Function**

`packages/functions/src/sync-steps.ts`:
```typescript
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

    // 이미 완료된 경우 스킵
    if (prevStatus === 'claimed') return

    const newProgress = Math.max(prevProgress, steps)
    const completed = newProgress >= requirement && prevStatus === 'active'

    // UserQuest 업데이트
    tx.set(uqRef, {
      userId: uid,
      questId,
      progress: newProgress,
      status: completed ? 'completed' : 'active',
      completedAt: completed ? new Date() : null,
    }, { merge: true })

    // 유저 걸음 수 업데이트
    const userRef = db.collection('users').doc(uid)
    if (steps > prevProgress) {
      tx.update(userRef, {
        totalSteps: FieldValue.increment(steps - prevProgress),
      })
    }

    // 완료 시 자동 POP 지급
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
```

**Step 3: index.ts 업데이트**

```typescript
import { initializeApp } from 'firebase-admin/app'
initializeApp()

export { onUserCreate } from './on-user-create'
export { zap } from './zap'
export { dailyCheckin } from './daily-checkin'
export { syncSteps } from './sync-steps'
```

**Step 4: 커밋**

```bash
git add packages/functions/
git commit -m "feat: 출석 체크 + 걸음 수 동기화 Cloud Functions"
```

---

## Task 7: 이클립스 자동 발생/해결 Cloud Functions

**Files:**
- Create: `packages/functions/src/schedule-eclipse.ts`
- Create: `packages/functions/src/resolve-eclipse.ts`
- Modify: `packages/functions/src/index.ts`

**Step 1: 이클립스 스케줄 Function**

`packages/functions/src/schedule-eclipse.ts`:
```typescript
import { scheduler } from 'firebase-functions/v2'
import { getFirestore } from 'firebase-admin/firestore'

export const scheduleEclipse = scheduler.onSchedule(
  { schedule: 'every 6 hours', timeZone: 'Asia/Seoul' },
  async () => {
    const db = getFirestore()

    // 현재 진행 중인 이클립스가 있으면 스킵
    const activeEclipses = await db.collection('eclipses')
      .where('status', '==', 'active')
      .get()

    if (!activeEclipses.empty) {
      console.log('Active eclipse exists, skipping')
      return
    }

    // 이클립스 되지 않은 행성 중 랜덤 선택
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

    // 방어에 필요한 POP = 행성 totalPop의 5%
    const requiredPop = Math.floor(planetData.totalPop * 0.05)
    const durationMs = 60 * 60 * 1000 // 1시간
    const now = new Date()
    const endsAt = new Date(now.getTime() + durationMs)

    const batch = db.batch()

    // 이클립스 문서 생성
    const eclipseRef = db.collection('eclipses').doc()
    batch.set(eclipseRef, {
      planetId: targetPlanet.id,
      startedAt: now,
      endsAt,
      status: 'active',
      requiredPop,
      currentDefensePop: 0,
    })

    // 행성 상태 업데이트
    batch.update(targetPlanet.ref, {
      isEclipsed: true,
      eclipseStartedAt: now,
      eclipseEndsAt: endsAt,
    })

    await batch.commit()
    console.log(`Eclipse triggered on ${planetData.name}, required defense: ${requiredPop} POP`)
  }
)
```

**Step 2: 이클립스 해결 Function (Firestore 트리거)**

`packages/functions/src/resolve-eclipse.ts`:
```typescript
import { firestore } from 'firebase-functions/v2'
import { getFirestore } from 'firebase-admin/firestore'

export const resolveEclipse = firestore.onDocumentUpdated(
  'eclipses/{eclipseId}',
  async (event) => {
    const before = event.data?.before.data()
    const after = event.data?.after.data()
    if (!before || !after) return

    // 이미 처리된 이클립스는 무시
    if (before.status !== 'active' || after.status !== 'active') return

    // 방어 성공 체크
    if (after.currentDefensePop >= after.requiredPop) {
      const db = getFirestore()
      const batch = db.batch()

      // 이클립스 상태 → defended
      batch.update(event.data!.after.ref, { status: 'defended' })

      // 행성 이클립스 해제
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

// 시간 만료 체크용 스케줄 (10분마다)
import { scheduler } from 'firebase-functions/v2'

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

      // 이클립스 실패 처리
      batch.update(doc.ref, { status: 'failed' })

      // 행성 FPI 감소 (5% 삭감)
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
```

**Step 3: index.ts 업데이트**

```typescript
import { initializeApp } from 'firebase-admin/app'
initializeApp()

export { onUserCreate } from './on-user-create'
export { zap } from './zap'
export { dailyCheckin } from './daily-checkin'
export { syncSteps } from './sync-steps'
export { scheduleEclipse } from './schedule-eclipse'
export { resolveEclipse, checkExpiredEclipses } from './resolve-eclipse'
```

**Step 4: 커밋**

```bash
git add packages/functions/
git commit -m "feat: 이클립스 자동 발생/방어/만료 Cloud Functions"
```

---

## Task 8: GALAXY 탭 — WebView + postMessage 브릿지

**Files:**
- Create: `apps/web/app/galaxy-embed/page.tsx`
- Create: `apps/mobile/components/galaxy/GalaxyWebView.tsx`
- Create: `apps/mobile/components/galaxy/ZapPanel.tsx`
- Modify: `apps/mobile/app/(tabs)/galaxy.tsx`

**Step 1: 웹 앱에 임베드용 갤럭시 페이지 생성**

`apps/web/app/galaxy-embed/page.tsx`:
```typescript
'use client'

import dynamic from 'next/dynamic'
import { useEffect, useCallback } from 'react'
import { useGalaxyStore } from '@/store/galaxy-store'

const GalaxyCanvas = dynamic(
  () => import('@/components/galaxy/GalaxyCanvas').then((m) => m.GalaxyCanvas),
  { ssr: false }
)

export default function GalaxyEmbedPage() {
  const { planets, triggerEclipse, resolveEclipse, triggerSuperBoost } = useGalaxyStore()

  // RN에서 보낸 메시지 수신
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data)
      switch (msg.type) {
        case 'UPDATE_PLANETS':
          // Firestore에서 받은 행성 데이터로 갱신
          useGalaxyStore.setState({ planets: msg.planets })
          break
        case 'ECLIPSE_UPDATE':
          useGalaxyStore.setState({
            planets: msg.planets,
            isEclipseWarning: msg.planets.some((p: any) => p.isEclipsed),
          })
          break
        case 'SUPER_BOOST':
          triggerSuperBoost(msg.boost)
          break
      }
    } catch (e) {
      // ignore non-JSON messages
    }
  }, [triggerSuperBoost])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // 행성 클릭 시 RN에 알림
  useEffect(() => {
    const handleClick = (e: CustomEvent) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'PLANET_SELECTED',
          planetId: e.detail.planetId,
        }))
      }
    }
    window.addEventListener('planetClick', handleClick as EventListener)
    return () => window.removeEventListener('planetClick', handleClick as EventListener)
  }, [])

  return (
    <div className="relative h-dvh w-full">
      <GalaxyCanvas />
    </div>
  )
}
```

`apps/web/types/global.d.ts` (타입 선언):
```typescript
interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void
  }
}
```

**Step 2: RN GalaxyWebView 컴포넌트**

`apps/mobile/components/galaxy/GalaxyWebView.tsx`:
```typescript
import { useRef, useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import type { Planet } from '@fandom/shared'

interface GalaxyWebViewProps {
  planets: Planet[]
  onPlanetSelect: (planetId: string) => void
}

const GALAXY_URL = process.env.EXPO_PUBLIC_GALAXY_WEB_URL || 'https://admin-fandom.vercel.app/galaxy-embed'

export function GalaxyWebView({ planets, onPlanetSelect }: GalaxyWebViewProps) {
  const webViewRef = useRef<WebView>(null)

  // 행성 데이터가 변경되면 WebView에 전송
  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'UPDATE_PLANETS',
        planets,
      }))
    }
  }, [planets])

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data)
      if (msg.type === 'PLANET_SELECTED') {
        onPlanetSelect(msg.planetId)
      }
    } catch (e) {
      // ignore
    }
  }, [onPlanetSelect])

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: GALAXY_URL }}
        style={styles.webview}
        onMessage={handleMessage}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        backgroundColor="#0a0a0f"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: '#0a0a0f' },
})
```

**Step 3: Zap 패널 컴포넌트**

`apps/mobile/components/galaxy/ZapPanel.tsx`:
```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import functions from '@react-native-firebase/functions'
import type { Planet, User } from '@fandom/shared'

interface ZapPanelProps {
  planet: Planet
  user: User
  onClose: () => void
  onZapComplete: () => void
}

const ZAP_AMOUNTS = [10, 50, 100, 500]

export function ZapPanel({ planet, user, onClose, onZapComplete }: ZapPanelProps) {
  const [loading, setLoading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(50)

  const handleZap = async () => {
    if (user.popBalance < selectedAmount) return
    setLoading(true)
    try {
      await functions().httpsCallable('zap')({
        planetId: planet.id,
        amount: selectedAmount,
      })
      onZapComplete()
    } catch (e) {
      console.error('Zap error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.planetName}>{planet.name}</Text>
          <Text style={styles.fpi}>FPI {planet.fpi}</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {planet.isEclipsed && (
        <View style={styles.eclipseWarning}>
          <Ionicons name="warning" size={16} color="#ff4444" />
          <Text style={styles.eclipseText}>ECLIPSE — 행성을 지켜주세요!</Text>
        </View>
      )}

      <View style={styles.amountRow}>
        {ZAP_AMOUNTS.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.amountButton,
              selectedAmount === amount && styles.amountButtonActive,
            ]}
            onPress={() => setSelectedAmount(amount)}
          >
            <Text style={[
              styles.amountText,
              selectedAmount === amount && styles.amountTextActive,
            ]}>
              {amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.balance}>보유: {user.popBalance.toLocaleString()} POP</Text>
        <TouchableOpacity
          style={[styles.zapButton, (loading || user.popBalance < selectedAmount) && styles.zapButtonDisabled]}
          onPress={handleZap}
          disabled={loading || user.popBalance < selectedAmount}
        >
          <Ionicons name="flash" size={20} color="#fff" />
          <Text style={styles.zapText}>
            {loading ? 'Zapping...' : `${selectedAmount} POP Zap!`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  planetName: { color: '#e2e8f0', fontSize: 20, fontWeight: 'bold' },
  fpi: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  eclipseWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,0,0,0.15)', padding: 10, borderRadius: 8, marginBottom: 16, gap: 8 },
  eclipseText: { color: '#ff6666', fontSize: 13, fontWeight: '600' },
  amountRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  amountButton: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  amountButtonActive: { borderColor: '#7B2FF2', backgroundColor: 'rgba(123,47,242,0.2)' },
  amountText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
  amountTextActive: { color: '#7B2FF2' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balance: { color: '#94a3b8', fontSize: 13 },
  zapButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B2FF2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, gap: 6 },
  zapButtonDisabled: { opacity: 0.5 },
  zapText: { color: '#fff', fontSize: 15, fontWeight: '600' },
})
```

**Step 4: Galaxy 탭 통합**

`apps/mobile/app/(tabs)/galaxy.tsx`:
```typescript
import { View, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { GalaxyWebView } from '@/components/galaxy/GalaxyWebView'
import { ZapPanel } from '@/components/galaxy/ZapPanel'
import { useAuth } from '@/contexts/AuthContext'
import { subscribePlanets, subscribeUser } from '@/lib/firestore'
import type { Planet, User } from '@fandom/shared'

export default function GalaxyScreen() {
  const { user: authUser } = useAuth()
  const [planets, setPlanets] = useState<Planet[]>([])
  const [userData, setUserData] = useState<User | null>(null)
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribePlanets(setPlanets)
    return unsub
  }, [])

  useEffect(() => {
    if (!authUser) return
    const unsub = subscribeUser(authUser.uid, setUserData)
    return unsub
  }, [authUser?.uid])

  const selectedPlanet = planets.find((p) => p.id === selectedPlanetId)

  return (
    <View style={styles.container}>
      <GalaxyWebView
        planets={planets}
        onPlanetSelect={setSelectedPlanetId}
      />

      {selectedPlanet && userData && (
        <View style={styles.panelOverlay}>
          <ZapPanel
            planet={selectedPlanet}
            user={userData}
            onClose={() => setSelectedPlanetId(null)}
            onZapComplete={() => setSelectedPlanetId(null)}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  panelOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0 },
})
```

**Step 5: react-native-webview 설치**

```bash
cd apps/mobile
npx expo install react-native-webview
```

**Step 6: 커밋**

```bash
git add apps/web/app/galaxy-embed/ apps/web/types/ apps/mobile/
git commit -m "feat: GALAXY 탭 — WebView R3F 브릿지 + Zap 패널"
```

---

## Task 9: HOME 탭 — 만보기 + 출석 체크

**Files:**
- Create: `apps/mobile/components/home/StepCounter.tsx`
- Create: `apps/mobile/components/home/CheckInButton.tsx`
- Create: `apps/mobile/components/home/QuestCard.tsx`
- Modify: `apps/mobile/app/(tabs)/home.tsx`

**Step 1: 만보기 컴포넌트**

```bash
cd apps/mobile
npx expo install expo-sensors
```

`apps/mobile/components/home/StepCounter.tsx`:
```typescript
import { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Pedometer } from 'expo-sensors'
import functions from '@react-native-firebase/functions'

interface StepCounterProps {
  requirement: number
  currentProgress: number
  status: string
}

export function StepCounter({ requirement, currentProgress, status }: StepCounterProps) {
  const [steps, setSteps] = useState(currentProgress)
  const [available, setAvailable] = useState(false)
  const lastSyncRef = useRef(currentProgress)

  useEffect(() => {
    Pedometer.isAvailableAsync().then(setAvailable)
  }, [])

  useEffect(() => {
    if (!available) return

    // 오늘 자정부터 현재까지의 걸음 수
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const sub = Pedometer.watchStepCount((result) => {
      setSteps(result.steps)
    })

    // 초기 걸음 수
    Pedometer.getStepCountAsync(start, new Date()).then((result) => {
      setSteps(result.steps)
    })

    return () => sub.remove()
  }, [available])

  // 500걸음마다 서버 동기화
  useEffect(() => {
    if (steps - lastSyncRef.current >= 500) {
      lastSyncRef.current = steps
      functions().httpsCallable('syncSteps')({ steps }).catch(console.error)
    }
  }, [steps])

  const progress = Math.min(steps / requirement, 1)
  const completed = status === 'claimed'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 걸음수</Text>
        <Text style={styles.reward}>+50 POP</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completed ? '완료!' : `${steps.toLocaleString()} / ${requirement.toLocaleString()}`}
        </Text>
      </View>

      {!available && (
        <Text style={styles.warning}>만보기를 사용할 수 없는 기기입니다</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#e2e8f0', fontSize: 16, fontWeight: '600' },
  reward: { color: '#00D4AA', fontSize: 14, fontWeight: '600' },
  progressContainer: { gap: 6 },
  progressBg: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7B2FF2', borderRadius: 4 },
  progressText: { color: '#94a3b8', fontSize: 12, textAlign: 'right' },
  warning: { color: '#ff6666', fontSize: 11, marginTop: 8 },
})
```

**Step 2: 출석 체크 버튼**

`apps/mobile/components/home/CheckInButton.tsx`:
```typescript
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import functions from '@react-native-firebase/functions'

interface CheckInButtonProps {
  alreadyCheckedIn: boolean
}

export function CheckInButton({ alreadyCheckedIn }: CheckInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(alreadyCheckedIn)

  const handleCheckin = async () => {
    if (done || loading) return
    setLoading(true)
    try {
      await functions().httpsCallable('dailyCheckin')({})
      setDone(true)
    } catch (e) {
      console.error('Check-in error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, done && styles.containerDone]}
      onPress={handleCheckin}
      disabled={done || loading}
    >
      <Ionicons
        name={done ? 'checkmark-circle' : 'sunny'}
        size={24}
        color={done ? '#00D4AA' : '#FFD700'}
      />
      <View>
        <Text style={styles.title}>출석 체크</Text>
        <Text style={styles.reward}>{done ? '완료!' : '+10 POP'}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16 },
  containerDone: { opacity: 0.6 },
  title: { color: '#e2e8f0', fontSize: 16, fontWeight: '600' },
  reward: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
})
```

**Step 3: HOME 탭 통합**

`apps/mobile/app/(tabs)/home.tsx`:
```typescript
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeQuests, subscribeUserQuests, subscribeUser } from '@/lib/firestore'
import { StepCounter } from '@/components/home/StepCounter'
import { CheckInButton } from '@/components/home/CheckInButton'
import type { Quest, UserQuest, User } from '@fandom/shared'

export default function HomeScreen() {
  const { user: authUser } = useAuth()
  const [quests, setQuests] = useState<Quest[]>([])
  const [userQuests, setUserQuests] = useState<UserQuest[]>([])
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    const unsub = subscribeQuests(setQuests)
    return unsub
  }, [])

  useEffect(() => {
    if (!authUser) return
    const unsub1 = subscribeUserQuests(authUser.uid, setUserQuests)
    const unsub2 = subscribeUser(authUser.uid, setUserData)
    return () => { unsub1(); unsub2() }
  }, [authUser?.uid])

  const walkQuest = quests.find((q) => q.category === 'walk')
  const walkUserQuest = userQuests.find((uq) => uq.questId === 'quest-walk')
  const checkinUserQuest = userQuests.find((uq) => uq.questId === 'quest-checkin')

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {userData ? `${userData.displayName}님` : '로딩 중...'}
          </Text>
          <View style={styles.popBadge}>
            <Text style={styles.popText}>
              {userData?.popBalance.toLocaleString() ?? '—'} POP
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today's Quest</Text>

        {walkQuest && (
          <StepCounter
            requirement={walkQuest.requirement}
            currentProgress={walkUserQuest?.progress ?? 0}
            status={walkUserQuest?.status ?? 'active'}
          />
        )}

        <CheckInButton
          alreadyCheckedIn={checkinUserQuest?.status === 'claimed'}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  greeting: { color: '#e2e8f0', fontSize: 20, fontWeight: 'bold' },
  popBadge: { backgroundColor: '#7B2FF2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  popText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
})
```

**Step 4: 커밋**

```bash
git add apps/mobile/
git commit -m "feat: HOME 탭 — 만보기 퀘스트 + 출석 체크 + Firestore 실시간"
```

---

## Task 10: MY 탭 — ID 카드 + 통계 + POP 잔액

**Files:**
- Create: `apps/mobile/components/mypage/IdCard.tsx`
- Create: `apps/mobile/components/mypage/StatGrid.tsx`
- Create: `apps/mobile/components/mypage/TransactionList.tsx`
- Modify: `apps/mobile/app/(tabs)/mypage.tsx`

**Step 1: ID 카드 컴포넌트 (RN)**

`apps/mobile/components/mypage/IdCard.tsx`:
```typescript
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import type { User } from '@fandom/shared'

interface IdCardProps {
  user: User
}

const TIER_GRADIENTS = {
  glass: ['#1e293b', '#334155'] as const,
  gold: ['#78350f', '#b45309', '#d97706'] as const,
  obsidian: ['#0f0f23', '#1a0533', '#2d1b69'] as const,
}

const TIER_LABELS = {
  glass: 'GLASS',
  gold: 'GOLD',
  obsidian: 'OBSIDIAN',
}

export function IdCard({ user }: IdCardProps) {
  const gradientColors = TIER_GRADIENTS[user.tier]

  return (
    <LinearGradient colors={[...gradientColors]} style={styles.card}>
      <View style={styles.tierBadge}>
        <Text style={styles.tierText}>{TIER_LABELS[user.tier]}</Text>
      </View>
      <Text style={styles.name}>{user.displayName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>POP Balance</Text>
        <Text style={styles.balanceValue}>{user.popBalance.toLocaleString()}</Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 24, minHeight: 180 },
  tierBadge: { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  tierText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  email: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 24 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  balanceValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
})
```

```bash
cd apps/mobile
npx expo install expo-linear-gradient
```

**Step 2: 통계 그리드**

`apps/mobile/components/mypage/StatGrid.tsx`:
```typescript
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { User } from '@fandom/shared'

interface StatGridProps {
  user: User
}

export function StatGrid({ user }: StatGridProps) {
  const stats = [
    { icon: 'footsteps' as const, label: '총 걸음수', value: user.totalSteps.toLocaleString() },
    { icon: 'flash' as const, label: '총 Zap', value: user.totalFeeds.toLocaleString() },
    { icon: 'rocket' as const, label: '캠페인', value: `${user.campaignCount}회` },
    { icon: 'star' as const, label: '총 POP 획득', value: user.totalPopEarned.toLocaleString() },
  ]

  return (
    <View style={styles.grid}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.cell}>
          <Ionicons name={stat.icon} size={20} color="#7B2FF2" />
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '48%', backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, alignItems: 'center', gap: 6 },
  value: { color: '#e2e8f0', fontSize: 18, fontWeight: 'bold' },
  label: { color: '#94a3b8', fontSize: 11 },
})
```

**Step 3: MY 탭 통합**

`apps/mobile/app/(tabs)/mypage.tsx`:
```typescript
import { ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeUser } from '@/lib/firestore'
import { signOut } from '@/lib/auth'
import { IdCard } from '@/components/mypage/IdCard'
import { StatGrid } from '@/components/mypage/StatGrid'
import type { User } from '@fandom/shared'

export default function MyPageScreen() {
  const { user: authUser } = useAuth()
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (!authUser) return
    const unsub = subscribeUser(authUser.uid, setUserData)
    return unsub
  }, [authUser?.uid])

  if (!userData) return null

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>MY PAGE</Text>
        <IdCard user={userData} />
        <StatGrid user={userData} />
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  title: { color: '#e2e8f0', fontSize: 22, fontWeight: 'bold' },
  logoutButton: { alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  logoutText: { color: '#94a3b8', fontSize: 14 },
})
```

**Step 4: 커밋**

```bash
git add apps/mobile/
git commit -m "feat: MY 탭 — ID 카드 + 통계 그리드 + 로그아웃"
```

---

## Task 11: ARCHIVE + K-INSIDE 탭 Coming Soon (Phase 2 안내)

**Files:**
- Modify: `apps/mobile/app/(tabs)/archive.tsx`
- Modify: `apps/mobile/app/(tabs)/kinside.tsx`

**Step 1: Phase 2 Coming Soon 화면**

`apps/mobile/app/(tabs)/archive.tsx`:
```typescript
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ArchiveScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Ionicons name="cube-outline" size={64} color="#333" />
        <Text style={styles.title}>ARCHIVE</Text>
        <Text style={styles.subtitle}>크라우드 펀딩 시스템</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 2 Coming Soon</Text>
        </View>
        <Text style={styles.desc}>
          팬들이 직접 서포트 캠페인을 개설하고{'\n'}
          POP으로 참여하는 크라우드 펀딩
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#e2e8f0', fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  badge: { backgroundColor: '#7B2FF2', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  desc: { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 16, lineHeight: 20 },
})
```

`apps/mobile/app/(tabs)/kinside.tsx` — 동일 구조, 아이콘/텍스트만 변경:
```typescript
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function KInsideScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Ionicons name="chatbubbles-outline" size={64} color="#333" />
        <Text style={styles.title}>K-INSIDE</Text>
        <Text style={styles.subtitle}>현상금 Q&A 게시판</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 2 Coming Soon</Text>
        </View>
        <Text style={styles.desc}>
          POP을 현상금으로 걸고 질문하면{'\n'}
          채택된 답변자에게 POP이 전송됩니다
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#e2e8f0', fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  badge: { backgroundColor: '#7B2FF2', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  desc: { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 16, lineHeight: 20 },
})
```

**Step 2: 커밋**

```bash
git add apps/mobile/app/(tabs)/archive.tsx apps/mobile/app/(tabs)/kinside.tsx
git commit -m "feat: ARCHIVE + K-INSIDE Coming Soon 화면 (Phase 2 안내)"
```

---

## Task 12: 탭 네비게이션 Phase 1 최적화

**Files:**
- Modify: `apps/mobile/app/(tabs)/_layout.tsx`

**Step 1: 탭 순서/아이콘 최적화 (Phase 1 기준)**

`apps/mobile/app/(tabs)/_layout.tsx`:
```typescript
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Platform } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0f',
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#7B2FF2',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="galaxy"
        options={{
          title: 'GALAXY',
          tabBarIcon: ({ color, size }) => <Ionicons name="planet" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: 'ARCHIVE',
          tabBarIcon: ({ color, size }) => <Ionicons name="cube" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="kinside"
        options={{
          title: 'K-INSIDE',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'MY',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
```

**Step 2: 커밋**

```bash
git add apps/mobile/app/(tabs)/_layout.tsx
git commit -m "feat: 탭 네비게이션 스타일 최적화"
```

---

## Task 13: EAS Build 설정 + 첫 빌드

**Files:**
- Create: `apps/mobile/eas.json`
- Modify: `apps/mobile/app.json`

**Step 1: EAS CLI 설치 및 프로젝트 연결**

```bash
npm install -g eas-cli
cd apps/mobile
eas login
eas init
```

**Step 2: eas.json 생성**

`apps/mobile/eas.json`:
```json
{
  "cli": {
    "version": ">= 15.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Step 3: 개발 빌드 실행**

```bash
cd apps/mobile
eas build --platform ios --profile development
# 또는 Android
eas build --platform android --profile development
```

Expected: EAS 빌드 큐에 등록, 빌드 URL 반환

**Step 4: 커밋**

```bash
git add apps/mobile/eas.json apps/mobile/app.json
git commit -m "feat: EAS Build 설정"
```

---

## Task 14: Firebase 프로덕션 배포 + 환경변수 설정

**Step 1: Firebase 프로젝트 생성 (콘솔)**

Firebase 콘솔에서:
1. 프로젝트 생성: `fandom-galaxy`
2. Auth 활성화: Google, Apple 프로바이더
3. Firestore 생성: 프로덕션 모드
4. Functions 활성화 (Blaze 요금제 필요)

**Step 2: 환경변수 설정**

`apps/mobile/.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=실제값
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=fandom-galaxy.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=fandom-galaxy
EXPO_PUBLIC_USE_EMULATOR=false
EXPO_PUBLIC_GALAXY_WEB_URL=https://admin-fandom.vercel.app/galaxy-embed
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=실제값.apps.googleusercontent.com
```

**Step 3: Firestore Rules 배포**

```bash
firebase deploy --only firestore:rules
```

**Step 4: Cloud Functions 배포**

```bash
cd packages/functions
pnpm install
pnpm build
cd ../..
firebase deploy --only functions
```

Expected: 모든 Functions 배포 성공 (onUserCreate, zap, dailyCheckin, syncSteps, scheduleEclipse, resolveEclipse, checkExpiredEclipses)

**Step 5: 시드 데이터 프로덕션 실행**

```bash
cd packages/functions
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json npx ts-node src/seed.ts
```

**Step 6: 커밋**

```bash
git add firebase.json firestore.rules firestore.indexes.json .firebaserc
git commit -m "feat: Firebase 프로덕션 배포 설정"
```

---

## 전체 태스크 요약

| Task | 내용 | 핵심 파일 |
|------|------|-----------|
| 1 | Firebase 프로젝트 초기화 + Functions 스캐폴딩 | `packages/functions/`, `firebase.json` |
| 2 | Firestore 스키마 확장 + 시드 데이터 | `packages/shared/types/`, `seed.ts` |
| 3 | Firebase Auth + RN 로그인 화면 | `apps/mobile/app/login.tsx`, `lib/auth.ts` |
| 4 | RN용 Firestore 헬퍼 | `apps/mobile/lib/firestore.ts` |
| 5 | POP Zap Cloud Function | `packages/functions/src/zap.ts` |
| 6 | 퀘스트 + 출석 Cloud Functions | `daily-checkin.ts`, `sync-steps.ts` |
| 7 | 이클립스 자동 발생/해결 | `schedule-eclipse.ts`, `resolve-eclipse.ts` |
| 8 | GALAXY 탭 — WebView + Zap | `GalaxyWebView.tsx`, `ZapPanel.tsx` |
| 9 | HOME 탭 — 만보기 + 출석 | `StepCounter.tsx`, `CheckInButton.tsx` |
| 10 | MY 탭 — ID 카드 + 통계 | `IdCard.tsx`, `StatGrid.tsx` |
| 11 | ARCHIVE + K-INSIDE Coming Soon | Phase 2 안내 화면 |
| 12 | 탭 네비게이션 최적화 | `_layout.tsx` |
| 13 | EAS Build 설정 | `eas.json` |
| 14 | Firebase 프로덕션 배포 | Rules, Functions, 환경변수 |
