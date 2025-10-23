'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

const POINT_COUNT = 70

function MiniNetwork() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const basePositions = useMemo(() => {
    const positions = new Float32Array(POINT_COUNT * 3)
    for (let i = 0; i < POINT_COUNT; i += 1) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 1.4 + Math.random() * 0.8
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [])

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.x = Math.sin(time * 0.35) * 0.2
      pointsRef.current.rotation.y = time * 0.18
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={POINT_COUNT} array={basePositions} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(0x80f7ff) },
          uColor2: { value: new THREE.Color(0xff8fd1) },
        }}
        vertexShader={`
          varying float vStrength;
          void main() {
            vStrength = position.z + 2.0;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = 60.0 * (1.0 / -mvPosition.z);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying float vStrength;
          void main() {
            float dist = length(gl_PointCoord - 0.5);
            float alpha = smoothstep(0.5, 0.1, dist);
            vec3 color = mix(uColor1, uColor2, vStrength * 0.25);
            gl_FragColor = vec4(color, alpha * 0.85);
          }
        `}
      />
    </points>
  )
}

export default function MiniNeural({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} color="#aee8ff" />
          <MiniNetwork />
        </Suspense>
      </Canvas>
    </div>
  )
}
