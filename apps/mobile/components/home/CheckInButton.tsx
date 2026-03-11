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
