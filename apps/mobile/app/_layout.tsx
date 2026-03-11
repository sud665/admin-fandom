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
