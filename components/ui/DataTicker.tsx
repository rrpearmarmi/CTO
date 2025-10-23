'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import styles from './DataTicker.module.css'

interface DataTickerProps {
  items: string[]
}

export default function DataTicker({ items }: DataTickerProps) {
  const animationControls = useAnimation()
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isHovered = false

    const animate = async () => {
      const width = tickerRef.current?.scrollWidth ?? 0
      await animationControls.start({
        x: ['0%', `-${width / 2}px`],
        transition: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 24,
          ease: 'linear',
        },
      })
    }

    animate()

    const stopAnimation = () => {
      isHovered = true
      animationControls.stop()
    }

    const resumeAnimation = () => {
      if (isHovered) {
        isHovered = false
        animate()
      }
    }

    const node = tickerRef.current
    node?.addEventListener('mouseenter', stopAnimation)
    node?.addEventListener('mouseleave', resumeAnimation)

    return () => {
      node?.removeEventListener('mouseenter', stopAnimation)
      node?.removeEventListener('mouseleave', resumeAnimation)
    }
  }, [animationControls])

  return (
    <div className={styles.tickerWrapper}>
      <motion.div className={styles.tickerContent} ref={tickerRef} animate={animationControls}>
        {[...items, ...items].map((item, index) => (
          <span key={`ticker-${index}`} className={styles.tickerItem}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
