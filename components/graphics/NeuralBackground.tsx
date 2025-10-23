'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const NODE_COUNT = 140
const CONNECTIONS_PER_NODE = 4
const PARTICLE_COUNT = 220
const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

function useNeuralNetworkData() {
  return useMemo(() => {
    const basePositions = new Float32Array(NODE_COUNT * 3)
    const currentPositions = new Float32Array(NODE_COUNT * 3)
    const speeds = new Float32Array(NODE_COUNT)
    const scales = new Float32Array(NODE_COUNT)
    const hues = new Float32Array(NODE_COUNT)

    const edges: Array<[number, number]> = []

    for (let i = 0; i < NODE_COUNT; i += 1) {
      const i3 = i * 3
      const radius = 3 + Math.random() * 1.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi) * 0.8

      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z

      currentPositions[i3] = x
      currentPositions[i3 + 1] = y
      currentPositions[i3 + 2] = z

      speeds[i] = 0.35 + Math.random() * 0.55
      scales[i] = 0.8 + Math.random() * 0.5
      hues[i] = 0.55 + Math.random() * 0.35
    }

    const nearestIndices = (index: number) => {
      const i3 = index * 3
      const current = new THREE.Vector3(basePositions[i3], basePositions[i3 + 1], basePositions[i3 + 2])
      const distances: Array<{ index: number; distance: number }> = []

      for (let j = 0; j < NODE_COUNT; j += 1) {
        if (j === index) continue
        const j3 = j * 3
        const target = new THREE.Vector3(basePositions[j3], basePositions[j3 + 1], basePositions[j3 + 2])
        const distance = current.distanceTo(target)
        distances.push({ index: j, distance })
      }

      distances.sort((a, b) => a.distance - b.distance)
      return distances.slice(0, CONNECTIONS_PER_NODE).map((entry) => entry.index)
    }

    for (let i = 0; i < NODE_COUNT; i += 1) {
      const nearest = nearestIndices(i)
      nearest.forEach((targetIndex) => {
        if (!edges.find(([a, b]) => (a === i && b === targetIndex) || (a === targetIndex && b === i))) {
          edges.push([i, targetIndex])
        }
      })
    }

    return { basePositions, currentPositions, speeds, scales, hues, edges }
  }, [])
}

function NeuralNodes({
  pointer,
  parallax,
  prefersReducedMotion,
}: {
  pointer: React.MutableRefObject<THREE.Vector3>
  parallax: React.MutableRefObject<number>
  prefersReducedMotion: boolean
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const lineRef = useRef<THREE.LineSegments>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { basePositions, currentPositions, speeds, scales, hues, edges } = useNeuralNetworkData()
  const linePositions = useMemo(() => new Float32Array(edges.length * 6), [edges.length])
  const particlePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])
  const particleOffsets = useMemo(() => new Float32Array(PARTICLE_COUNT), [])
  const particleRoutes = useMemo(() => new Array<{ start: number; end: number }>(PARTICLE_COUNT), [])
  const pointerStrength = prefersReducedMotion ? 0.12 : 0.32

  useMemo(() => {
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const edge = edges[Math.floor(Math.random() * edges.length)]
      particleRoutes[i] = { start: edge[0], end: edge[1] }
      particleOffsets[i] = Math.random()
    }
  }, [edges, particleOffsets, particleRoutes])

  useMemo(() => {
    if (!lineRef.current) return
    lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
  }, [linePositions])

  useMemo(() => {
    if (!particlesRef.current) return
    particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  }, [particlePositions])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    const line = lineRef.current
    const particles = particlesRef.current
    if (!mesh || !line || !particles) return

    const time = state.clock.elapsedTime
    const pointerWorld = new THREE.Vector3(pointer.current.x * 4.5, pointer.current.y * 3.2, pointer.current.z * 2)

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, prefersReducedMotion ? 9.2 : 10.5 - parallax.current, 0.08)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointerWorld.x * 0.08, 0.04)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointerWorld.y * 0.08, 0.04)
    state.camera.lookAt(0, 0, 0)

    for (let i = 0; i < NODE_COUNT; i += 1) {
      const i3 = i * 3
      const phase = time * speeds[i] + i * 0.23

      let currentX = basePositions[i3] + Math.sin(phase) * 0.35
      let currentY = basePositions[i3 + 1] + Math.cos(phase * 0.9) * 0.28
      let currentZ = basePositions[i3 + 2] + Math.sin(phase * 1.2) * 0.4

      const dx = pointerWorld.x - currentX
      const dy = pointerWorld.y - currentY
      const dz = (pointerWorld.z - currentZ) * 0.6
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001
      const influence = Math.min((1 / distance) * pointerStrength, 0.25)

      currentX += dx * influence
      currentY += dy * influence
      currentZ += dz * influence

      currentPositions[i3] = THREE.MathUtils.lerp(currentPositions[i3], currentX, prefersReducedMotion ? 0.1 : 0.3)
      currentPositions[i3 + 1] = THREE.MathUtils.lerp(currentPositions[i3 + 1], currentY, prefersReducedMotion ? 0.1 : 0.28)
      currentPositions[i3 + 2] = THREE.MathUtils.lerp(currentPositions[i3 + 2], currentZ, prefersReducedMotion ? 0.1 : 0.24)

      tempObject.position.set(currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2])
      const pulse = 1 + Math.sin(time * 2.4 + i * 0.25) * 0.08
      const scale = (prefersReducedMotion ? 0.6 : 0.8) * scales[i] * pulse
      tempObject.scale.setScalar(scale)
      tempObject.lookAt(pointerWorld)
      tempObject.updateMatrix()
      mesh.setMatrixAt(i, tempObject.matrix)
      tempColor.setHSL(hues[i], 0.72, 0.58 + Math.sin(phase) * 0.06)
      mesh.setColorAt(i, tempColor)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    const lineAttr = line.geometry.getAttribute('position') as THREE.BufferAttribute
    for (let index = 0; index < edges.length; index += 1) {
      const [a, b] = edges[index]
      const a3 = a * 3
      const b3 = b * 3
      const offset = index * 6

      linePositions[offset] = currentPositions[a3]
      linePositions[offset + 1] = currentPositions[a3 + 1]
      linePositions[offset + 2] = currentPositions[a3 + 2]
      linePositions[offset + 3] = currentPositions[b3]
      linePositions[offset + 4] = currentPositions[b3 + 1]
      linePositions[offset + 5] = currentPositions[b3 + 2]
    }
    lineAttr.needsUpdate = true

    const particleAttr = particles.geometry.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const route = particleRoutes[i]
      if (!route) continue
      const startIndex = route.start * 3
      const endIndex = route.end * 3
      const flow = (time * (0.2 + Math.random() * 0.1) + particleOffsets[i]) % 1

      particlePositions[i * 3] = THREE.MathUtils.lerp(currentPositions[startIndex], currentPositions[endIndex], flow)
      particlePositions[i * 3 + 1] = THREE.MathUtils.lerp(currentPositions[startIndex + 1], currentPositions[endIndex + 1], flow)
      particlePositions[i * 3 + 2] = THREE.MathUtils.lerp(currentPositions[startIndex + 2], currentPositions[endIndex + 2], flow)
    }
    particleAttr.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]}
        castShadow={false}
        receiveShadow={false}
      >
        <icosahedronGeometry args={[0.18, 2]} />
        <meshStandardMaterial
          color="#b1e9ff"
          emissive="#89a8ff"
          emissiveIntensity={1.8}
          metalness={0.4}
          roughness={0.35}
        />
      </instancedMesh>

      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#63f2ff" transparent opacity={0.38} toneMapped={false} />
      </lineSegments>

      <points ref={particlesRef}>
        <bufferGeometry />
        <pointsMaterial
          size={prefersReducedMotion ? 0.045 : 0.08}
          color="#9ad9ff"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

function CursorParallax({ pointer }: { pointer: React.MutableRefObject<THREE.Vector3> }) {
  useFrame((state) => {
    const target = new THREE.Vector3(state.pointer.x, state.pointer.y, 0)
    pointer.current.lerp(target, 0.08)
  })
  return null
}

export default function NeuralBackground({
  className,
  parallax = 0,
  prefersReducedMotion = false,
}: {
  className?: string
  parallax?: number
  prefersReducedMotion?: boolean
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef(new THREE.Vector3())
  const parallaxRef = useRef(parallax)

  if (parallaxRef.current !== parallax) {
    parallaxRef.current = parallax
  }

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        eventSource={containerRef.current ?? undefined}
        eventPrefix="client"
        camera={{ position: [0, 0, prefersReducedMotion ? 9 : 11], fov: 65, near: 0.1, far: 120 }}
        dpr={[1, 1.8]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[0x040510]} />
          <fog attach="fog" args={[0x040510, 16, 28]} />
          <ambientLight intensity={0.65} color="#94c7ff" />
          <directionalLight position={[4, 5, 6]} intensity={1.25} color="#a6c8ff" />
          <directionalLight position={[-6, -4, -8]} intensity={0.8} color="#ff8ff2" />
          <pointLight position={[0, 0, 6]} intensity={1.4} color="#6ce6ff" distance={20} decay={2} />

          <CursorParallax pointer={pointerRef} />
          <NeuralNodes pointer={pointerRef} parallax={parallaxRef} prefersReducedMotion={prefersReducedMotion} />

          {!prefersReducedMotion && (
            <EffectComposer multisampling={0}>
              <Bloom mipmapBlur intensity={1.45} luminanceThreshold={0.2} luminanceSmoothing={0.4} />
              <DepthOfField focusDistance={0.02} focalLength={0.38} bokehScale={3.7} height={480} />
              <Noise premultiply opacity={0.08} />
              <Vignette darkness={0.8} eskil={false} offset={0.26} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
