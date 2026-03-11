import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import type { User } from '@fandom/shared'

interface IdCardProps {
  user: User
}

const TIER_GRADIENTS: Record<string, readonly string[]> = {
  glass: ['#1e293b', '#334155'],
  gold: ['#78350f', '#b45309', '#d97706'],
  obsidian: ['#0f0f23', '#1a0533', '#2d1b69'],
}

const TIER_LABELS: Record<string, string> = {
  glass: 'GLASS',
  gold: 'GOLD',
  obsidian: 'OBSIDIAN',
}

export function IdCard({ user }: IdCardProps) {
  const gradientColors = TIER_GRADIENTS[user.tier] || TIER_GRADIENTS.glass

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
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  balanceValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
})
