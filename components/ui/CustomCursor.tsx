'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

interface TrailParticle {
  x: number
  y: number
  opacity: number
  id: number
}

export default function CustomCursor({ disabled = false }: { disabled?: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<TrailParticle[]>([])
  const particleIdRef = useRef(0)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef(Date.now())

  useEffect(() => {
    if (disabled || typeof window === 'undefined' || 'ontouchstart' in window) {
      return
    }

    let rafId: number
    let trailRafId: number

    const updateCursor = (e: MouseEvent) => {
      const cursor = cursorRef.current
      const cursorInner = cursorInnerRef.current
      if (!cursor || !cursorInner) return

      const now = Date.now()
      const dt = (now - lastTimeRef.current) / 16
      lastTimeRef.current = now

      velocityRef.current = {
        x: (e.clientX - lastMousePos.current.x) / Math.max(dt, 1),
        y: (e.clientY - lastMousePos.current.y) / Math.max(dt, 1),
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY }

      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      cursorInner.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    const generateParticleTrail = () => {
      const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2)

      if (speed > 0.8) {
        const newParticle: TrailParticle = {
          x: lastMousePos.current.x,
          y: lastMousePos.current.y,
          opacity: Math.min(speed / 40, 0.9),
          id: particleIdRef.current++,
        }

        setParticles((prev) => [...prev.slice(-12), newParticle])
      }

      trailRafId = requestAnimationFrame(generateParticleTrail)
    }

    const handleMouseEnter = () => {
      if (cursorRef.current && cursorInnerRef.current) {
        cursorRef.current.style.opacity = '1'
        cursorInnerRef.current.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      if (cursorRef.current && cursorInnerRef.current) {
        cursorRef.current.style.opacity = '0'
        cursorInnerRef.current.style.opacity = '0'
      }
    }

    const handleMouseDown = () => {
      if (cursorInnerRef.current) {
        cursorInnerRef.current.style.transform = `translate3d(${lastMousePos.current.x}px, ${lastMousePos.current.y}px, 0) scale(0.5)`
      }
    }

    const handleMouseUp = () => {
      if (cursorInnerRef.current) {
        cursorInnerRef.current.style.transform = `translate3d(${lastMousePos.current.x}px, ${lastMousePos.current.y}px, 0) scale(1)`
      }
    }

    document.addEventListener('mousemove', updateCursor)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    generateParticleTrail()

    return () => {
      document.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      if (rafId) cancelAnimationFrame(rafId)
      if (trailRafId) cancelAnimationFrame(trailRafId)
    }
  }, [disabled])

  useEffect(() => {
    if (particles.length === 0) return

    const fadeInterval = setInterval(() => {
      setParticles((prev) => prev.filter((p) => p.opacity > 0.02).map((p) => ({ ...p, opacity: p.opacity * 0.9 })))
    }, 50)

    return () => clearInterval(fadeInterval)
  }, [particles.length])

  if (disabled || (typeof window !== 'undefined' && 'ontouchstart' in window)) {
    return null
  }

  return (
    <>
      <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
        <div className={styles.cursorRing} />
      </div>
      <div ref={cursorInnerRef} className={styles.cursorInner} aria-hidden="true">
        <div className={styles.cursorDot} />
      </div>
      <div className={styles.particleContainer} aria-hidden="true">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>
    </>
  )
}
