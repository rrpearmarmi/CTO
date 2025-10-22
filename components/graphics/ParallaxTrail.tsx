'use client'

import { MotionValue, motion } from 'framer-motion'
import styles from './ParallaxTrail.module.css'

type ParallaxTrailProps = {
  motionValue: MotionValue<number>
}

export default function ParallaxTrail({ motionValue }: ParallaxTrailProps) {
  return (
    <motion.div className={styles.trailLayer} style={{ y: motionValue }}>
      <div className={styles.trail} />
      <div className={`${styles.trail} ${styles.trailOffset}`} />
      <div className={`${styles.trail} ${styles.trailSmall}`} />
    </motion.div>
  )
}
