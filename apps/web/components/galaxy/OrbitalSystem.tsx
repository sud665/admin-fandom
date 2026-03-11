'use client'

import type { Planet as PlanetType } from '@fandom/shared'
import { Orbit } from './Orbit'
import { Planet } from './Planet'

interface OrbitalSystemProps {
  planets: PlanetType[]
}

const BASE_ORBIT_RADIUS = 5
const ORBIT_SPACING = 3

export function OrbitalSystem({ planets }: OrbitalSystemProps) {
  return (
    <group>
      {planets.map((planet) => {
        const orbitRadius = BASE_ORBIT_RADIUS + planet.orbitIndex * ORBIT_SPACING
        return (
          <group key={planet.id}>
            <Orbit
              radius={orbitRadius}
              color={planet.isEclipsed ? '#ff3333' : planet.color}
              opacity={planet.isEclipsed ? 0.3 : 0.15}
            />
            <Planet planet={planet} orbitRadius={orbitRadius} />
          </group>
        )
      })}
    </group>
  )
}
