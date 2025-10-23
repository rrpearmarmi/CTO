'use client'

import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { motion } from 'framer-motion'
import styles from './AudioVisualizer.module.css'

const BAR_COUNT = 28

export default function AudioVisualizer({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const [levels, setLevels] = useState<number[]>(Array.from({ length: BAR_COUNT }, () => Math.random() * 0.4))
  const toneStartedRef = useRef(false)
  const toneObjectsRef = useRef<{ meter: Tone.Meter; noise: Tone.Noise; gain: Tone.Gain } | null>(null)

  useEffect(() => {
    let rafId: number
    let fallbackPhase = Math.random() * Math.PI

    const update = () => {
      const toneObjects = toneObjectsRef.current
      let levelValue = 0

      if (toneObjects) {
        const raw = toneObjects.meter.getValue()
        if (typeof raw === 'number') {
          levelValue = Math.min(Math.max(raw, 0), 1)
        }
      } else {
        fallbackPhase += 0.015
        levelValue = (Math.sin(fallbackPhase) + 1) / 2
      }

      setLevels((prev) =>
        prev.map((value, index) => {
          const target = levelValue * (0.4 + Math.sin(fallbackPhase + index * 0.4) * 0.25 + Math.random() * 0.1)
          return value + (target - value) * 0.18
        }),
      )

      rafId = requestAnimationFrame(update)
    }

    if (!prefersReducedMotion) {
      update()
    } else {
      setLevels(Array.from({ length: BAR_COUNT }, (_, index) => ((index % 3) + 1) * 0.1))
    }

    return () => cancelAnimationFrame(rafId)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return

    const startTone = async () => {
      if (toneStartedRef.current) return
      toneStartedRef.current = true

      await Tone.start()
      const meter = new Tone.Meter()
      const noise = new Tone.Noise('pink')
      const gain = new Tone.Gain(0)
      noise.connect(gain)
      gain.connect(meter)
      noise.start()
      toneObjectsRef.current = { meter, noise, gain }
    }

    window.addEventListener('pointerdown', startTone, { once: true })

    return () => {
      window.removeEventListener('pointerdown', startTone)
      if (toneObjectsRef.current) {
        toneObjectsRef.current.noise.dispose()
        toneObjectsRef.current.gain.dispose()
        toneObjectsRef.current.meter.dispose()
      }
    }
  }, [prefersReducedMotion])

  return (
    <div className={styles.visualizer} aria-hidden>
      {levels.map((level, index) => (
        <motion.span
          key={`bar-${index}`}
          className={styles.bar}
          animate={{ scaleY: prefersReducedMotion ? 1 : 0.4 + level * 1.4 }}
          transition={{ duration: 0.24, ease: [0.42, 0, 0.58, 1] }}
          style={{ transformOrigin: 'center bottom' }}
        />
      ))}
    </div>
  )
}
