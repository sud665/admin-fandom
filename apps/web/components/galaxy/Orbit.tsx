'use client'

import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface OrbitProps {
  radius: number
  color?: string
  opacity?: number
}

export function Orbit({ radius, color = '#ffffff', opacity = 0.15 }: OrbitProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  return (
    <Line points={points} color={color} transparent opacity={opacity} lineWidth={1} />
  )
}
