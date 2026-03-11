import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { signInWithGoogle, signInWithApple } from '@/lib/auth'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      console.error('Google login error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleApple = async () => {
    setLoading(true)
    try {
      await signInWithApple()
    } catch (e) {
      console.error('Apple login error:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7B2FF2" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Ionicons name="planet" size={80} color="#7B2FF2" />
      <Text style={styles.title}>FANDOM GALAXY</Text>
      <Text style={styles.subtitle}>팬덤의 은하계에 입장하세요</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogle}>
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.buttonText}>Google로 시작하기</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity style={[styles.button, styles.appleButton]} onPress={handleApple}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.buttonText}>Apple로 시작하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#e2e8f0', fontSize: 32, fontWeight: 'bold', marginTop: 24 },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 8, marginBottom: 48 },
  buttonContainer: { width: '100%', gap: 12 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
  googleButton: { backgroundColor: '#4285F4' },
  appleButton: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
