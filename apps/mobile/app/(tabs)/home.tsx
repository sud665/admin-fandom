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
