import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'

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
