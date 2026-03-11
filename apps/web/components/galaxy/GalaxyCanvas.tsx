'use client'

import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { mockPlanets } from '@fandom/shared'
import { StarField } from './StarField'
import { Sun } from './Sun'
import { CameraController } from './CameraController'
import { OrbitalSystem } from './OrbitalSystem'

export function GalaxyCanvas() {
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
        <OrbitalSystem planets={mockPlanets} />
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
