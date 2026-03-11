import { View, Text, StyleSheet } from 'react-native'

export default function ArchiveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ARCHIVE</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#e2e8f0', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 8 },
})
