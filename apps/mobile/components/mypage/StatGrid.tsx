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
