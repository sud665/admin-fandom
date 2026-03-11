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
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const sub = Pedometer.watchStepCount((result) => {
      setSteps(result.steps)
    })
    Pedometer.getStepCountAsync(start, new Date()).then((result) => {
      setSteps(result.steps)
    })
    return () => sub.remove()
  }, [available])

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
