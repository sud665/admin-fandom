'use client'

import { OrbitControls } from '@react-three/drei'

export function CameraController() {
  return (
    <OrbitControls
      enablePan={false}
      minDistance={8}
      maxDistance={40}
      autoRotate
      autoRotateSpeed={0.3}
      enableDamping
      dampingFactor={0.05}
    />
  )
}
