'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const sunFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex noise approximation
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    // Animated noise on sphere surface
    vec3 pos = vPosition * 2.0;
    float noise1 = fbm(pos + uTime * 0.15);
    float noise2 = fbm(pos * 1.5 - uTime * 0.1 + 100.0);
    float noise3 = fbm(pos * 3.0 + uTime * 0.08 + 200.0);

    // Color gradient: dark orange core → bright yellow → white hot spots
    vec3 darkOrange = vec3(0.8, 0.3, 0.0);
    vec3 brightYellow = vec3(1.0, 0.7, 0.1);
    vec3 whiteHot = vec3(1.0, 0.95, 0.8);

    float pattern = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    pattern = pattern * 0.5 + 0.5; // remap to 0-1

    vec3 color = mix(darkOrange, brightYellow, pattern);
    color = mix(color, whiteHot, pow(pattern, 3.0));

    // Fresnel rim darkening (limb darkening like real stars)
    float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
    fresnel = pow(max(fresnel, 0.0), 0.4);
    color *= mix(0.4, 1.0, fresnel);

    // Emissive (controlled brightness)
    gl_FragColor = vec4(color * 1.8, 1.0);
  }
`

const coronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const coronaFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;

  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    float flicker = 0.95 + 0.05 * sin(uTime * 0.5 + vNormal.x * 5.0);
    vec3 color = vec3(1.0, 0.6, 0.1) * intensity * flicker * 1.2;
    gl_FragColor = vec4(color, intensity * 0.5);
  }
`

export function Sun() {
  const groupRef = useRef<THREE.Group>(null)
  const sunMatRef = useRef<THREE.ShaderMaterial>(null)
  const corona1Ref = useRef<THREE.ShaderMaterial>(null)
  const corona2Ref = useRef<THREE.ShaderMaterial>(null)

  const sunUniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const corona1Uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const corona2Uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (sunMatRef.current) sunMatRef.current.uniforms.uTime.value = t
    if (corona1Ref.current) corona1Ref.current.uniforms.uTime.value = t
    if (corona2Ref.current) corona2Ref.current.uniforms.uTime.value = t
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
      const scale = 1 + Math.sin(t * 1.5) * 0.02
      groupRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Core sun sphere with procedural noise shader */}
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <shaderMaterial
          ref={sunMatRef}
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={sunUniforms}
          toneMapped={false}
        />
      </mesh>

      {/* Inner corona (tight glow) */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <shaderMaterial
          ref={corona1Ref}
          vertexShader={coronaVertexShader}
          fragmentShader={coronaFragmentShader}
          uniforms={corona1Uniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Outer corona (diffuse glow) */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <shaderMaterial
          ref={corona2Ref}
          vertexShader={coronaVertexShader}
          fragmentShader={coronaFragmentShader}
          uniforms={corona2Uniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Point light */}
      <pointLight color="#ffaa00" intensity={40} distance={100} />
    </group>
  )
}
