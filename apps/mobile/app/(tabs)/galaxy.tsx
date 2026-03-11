import { View, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { GalaxyWebView } from '@/components/galaxy/GalaxyWebView'
import { ZapPanel } from '@/components/galaxy/ZapPanel'
import { useAuth } from '@/contexts/AuthContext'
import { subscribePlanets, subscribeUser } from '@/lib/firestore'
import type { Planet, User } from '@fandom/shared'

export default function GalaxyScreen() {
  const { user: authUser } = useAuth()
  const [planets, setPlanets] = useState<Planet[]>([])
  const [userData, setUserData] = useState<User | null>(null)
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribePlanets(setPlanets)
    return unsub
  }, [])

  useEffect(() => {
    if (!authUser) return
    const unsub = subscribeUser(authUser.uid, setUserData)
    return unsub
  }, [authUser?.uid])

  const selectedPlanet = planets.find((p) => p.id === selectedPlanetId)

  return (
    <View style={styles.container}>
      <GalaxyWebView
        planets={planets}
        onPlanetSelect={setSelectedPlanetId}
      />

      {selectedPlanet && userData && (
        <View style={styles.panelOverlay}>
          <ZapPanel
            planet={selectedPlanet}
            user={userData}
            onClose={() => setSelectedPlanetId(null)}
            onZapComplete={() => setSelectedPlanetId(null)}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  panelOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0 },
})
