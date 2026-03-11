'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Planet as PlanetType } from '@fandom/shared'
import { getPlanetTexture } from '@fandom/shared'

interface PlanetProps {
  planet: PlanetType
  orbitRadius: number
}

function getMaterialProps(fpi: number, color: string) {
  const texture = getPlanetTexture(fpi)
  switch (texture) {
    case 'solar':
      return { emissive: '#ffaa00', emissiveIntensity: 2, color: '#ffdd44', metalness: 1, roughness: 0, toneMapped: false }
    case 'gem':
      return { color, metalness: 0.9, roughness: 0.1, emissive: color, emissiveIntensity: 0.5 }
    case 'metal':
      return { color, metalness: 0.8, roughness: 0.3 }
    case 'rock':
    default:
      return { color: '#555555', metalness: 0.1, roughness: 0.9 }
  }
}

export function Planet({ planet, orbitRadius }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const size = 0.3 + (planet.fpi / 100) * 0.7
  const speed = 0.15 + (planet.orbitIndex * 0.05)
  const materialProps = getMaterialProps(planet.fpi, planet.color)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const angle = t * speed + planet.orbitIndex * ((Math.PI * 2) / 5)
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * orbitRadius
      groupRef.current.position.z = Math.sin(angle) * orbitRadius
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 1.3, 16, 16]} />
        <meshBasicMaterial color={planet.color} transparent opacity={hovered ? 0.2 : 0.08} side={THREE.BackSide} />
      </mesh>
      {planet.isEclipsed && (
        <mesh>
          <sphereGeometry args={[size * 1.6, 16, 16]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.15} side={THREE.BackSide} />
        </mesh>
      )}
      <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div className="whitespace-nowrap text-center">
          <p className="text-xs font-bold text-white drop-shadow-lg">{planet.name}</p>
          <p className="text-[10px] text-white/60">FPI {planet.fpi}</p>
          {planet.isEclipsed && (
            <p className="text-[10px] font-bold text-red-400 animate-pulse">ECLIPSE</p>
          )}
        </div>
      </Html>
    </group>
  )
}
