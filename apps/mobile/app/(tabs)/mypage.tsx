import { View, Text, StyleSheet } from 'react-native'

export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY PAGE</Text>
      <Text style={styles.subtitle}>디지털 ID 카드</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#e2e8f0', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 8 },
})
