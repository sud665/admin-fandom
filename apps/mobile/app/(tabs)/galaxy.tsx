import { View, Text, StyleSheet } from 'react-native'

export default function GalaxyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GALAXY</Text>
      <Text style={styles.subtitle}>3D 은하계 뷰</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#e2e8f0', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 8 },
})
