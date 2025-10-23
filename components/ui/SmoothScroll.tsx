'use client'

import { useEffect, ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    })

    window.__lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      if (window.__lenis === lenis) {
        delete window.__lenis
      }
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
