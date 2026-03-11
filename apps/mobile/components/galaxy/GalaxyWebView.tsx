import { useRef, useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import type { Planet } from '@fandom/shared'

interface GalaxyWebViewProps {
  planets: Planet[]
  onPlanetSelect: (planetId: string) => void
}

const GALAXY_URL = process.env.EXPO_PUBLIC_GALAXY_WEB_URL || 'https://admin-fandom.vercel.app/galaxy-embed'

export function GalaxyWebView({ planets, onPlanetSelect }: GalaxyWebViewProps) {
  const webViewRef = useRef<WebView>(null)

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'UPDATE_PLANETS',
        planets,
      }))
    }
  }, [planets])

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data)
      if (msg.type === 'PLANET_SELECTED') {
        onPlanetSelect(msg.planetId)
      }
    } catch (e) {
      // ignore
    }
  }, [onPlanetSelect])

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: GALAXY_URL }}
        style={styles.webview}
        onMessage={handleMessage}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        backgroundColor="#0a0a0f"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: '#0a0a0f' },
})
