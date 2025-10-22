'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type ShaderBackgroundProps = {
  className?: string
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex noise adapted for lightweight usage
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                       -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);

    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
              + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m;
    m = m * m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 st = uv * 2.0 - 1.0;
    float time = uTime * 0.15;

    float noise1 = snoise(uv * 3.5 + vec2(time, time * 0.7));
    float noise2 = snoise((uv + 0.3) * 4.5 + vec2(time * 0.8, -time * 0.6));

    float mask = smoothstep(-0.4, 0.6, noise1 + noise2 * 0.6);
    vec3 gradientA = vec3(0.31, 0.88, 1.0);
    vec3 gradientB = vec3(0.43, 0.36, 1.0);
    vec3 gradientC = vec3(1.0, 0.48, 0.78);

    float blend1 = smoothstep(-0.2, 0.8, noise1);
    float blend2 = smoothstep(-0.4, 0.7, noise2);

    vec3 color = mix(gradientA, gradientB, blend1);
    color = mix(color, gradientC, blend2 * 0.6);

    // Liquid glass sheen
    float radial = length(st);
    float vignette = smoothstep(1.4, 0.6, radial);
    float caustics = snoise(uv * 12.0 + time * 0.4) * 0.08;

    color += caustics;
    color *= vignette + mask * 0.4;

    gl_FragColor = vec4(color, 0.9);
  }
`

export default function ShaderBackground({ className }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const initialRect = container.getBoundingClientRect()
    const initialWidth = initialRect.width || window.innerWidth
    const initialHeight = initialRect.height || window.innerHeight

    renderer.setSize(initialWidth, initialHeight)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.pointerEvents = 'none'

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(initialWidth, initialHeight) },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    container.appendChild(renderer.domElement)

    let animationFrameId: number

    const handleResize = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const width = rect.width || window.innerWidth
      const height = rect.height || window.innerHeight
      renderer.setSize(width, height)
      uniforms.uResolution.value.set(width, height)
    }

    const renderScene = () => {
      uniforms.uTime.value = performance.now() / 1000
      renderer.render(scene, camera)
      animationFrameId = window.requestAnimationFrame(renderScene)
    }

    renderScene()
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
