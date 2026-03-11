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
