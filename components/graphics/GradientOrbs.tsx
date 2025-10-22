'use client'

import { MotionValue, motion } from 'framer-motion'
import styles from './GradientOrbs.module.css'

type GradientOrbsProps = {
  motionValue: MotionValue<number>
}

export default function GradientOrbs({ motionValue }: GradientOrbsProps) {
  return (
    <div className={styles.orbLayer}>
      <motion.div className={`${styles.orb} ${styles.orbPrimary}`} style={{ y: motionValue }} />
      <motion.div className={`${styles.orb} ${styles.orbSecondary}`} style={{ y: motionValue }} />
      <motion.div className={`${styles.orb} ${styles.orbTertiary}`} style={{ y: motionValue }} />
    </div>
  )
}
