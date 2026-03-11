'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1
      const scale = 1 + Math.sin(t * 2) * 0.03
      meshRef.current.scale.setScalar(scale)
    }
    if (glowRef.current) {
      const glowScale = 1.8 + Math.sin(t * 1.5) * 0.1
      glowRef.current.scale.setScalar(glowScale)
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial emissive="#ffaa00" emissiveIntensity={3} color="#ffdd44" toneMapped={false} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
      <pointLight color="#ffaa00" intensity={50} distance={100} />
    </group>
  )
}
