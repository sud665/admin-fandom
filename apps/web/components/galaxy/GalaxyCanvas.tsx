'use client'

import { Canvas } from '@react-three/fiber'
// import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useGalaxyStore } from '@/store/galaxy-store'
import { StarField } from './StarField'
import { Sun } from './Sun'
import { CameraController } from './CameraController'
import { OrbitalSystem } from './OrbitalSystem'

export function GalaxyCanvas() {
  const planets = useGalaxyStore((s) => s.planets)

  return (
    <div className="h-dvh w-full">
      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0f' }}
      >
        <ambientLight intensity={0.1} />
        <CameraController />
        <StarField />
        <Sun />
        <OrbitalSystem planets={planets} />
{/* Bloom 제거 — 태양 셰이더와 충돌하여 깜빡임 유발 */}
      </Canvas>
    </div>
  )
}
