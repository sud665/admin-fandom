import { ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native'
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
