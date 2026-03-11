import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ArchiveScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Ionicons name="cube-outline" size={64} color="#333" />
        <Text style={styles.title}>ARCHIVE</Text>
        <Text style={styles.subtitle}>크라우드 펀딩 시스템</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 2 Coming Soon</Text>
        </View>
        <Text style={styles.desc}>
          {'팬들이 직접 서포트 캠페인을 개설하고\nPOP으로 참여하는 크라우드 펀딩'}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#e2e8f0', fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  badge: { backgroundColor: '#7B2FF2', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  desc: { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 16, lineHeight: 20 },
})
