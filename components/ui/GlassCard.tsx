'use client'

import { useRef, useState, FormEvent, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import styles from './GlassCard.module.css'

interface GlassCardProps {
  children: ReactNode
  className?: string
  tiltEnabled?: boolean
}

export default function GlassCard({ children, className = '', tiltEnabled = true }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [borderRotation, setBorderRotation] = useState(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 25,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 25,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)

    mouseX.set(deltaX)
    mouseY.set(deltaY)
  }

  const handleMouseLeave = () => {
    if (!tiltEnabled) return
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.glassCard} ${className}`}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.23, 0.86, 0.39, 0.96], delay: 0.3 }}
    >
      <div className={styles.glassCardBorder} />
      <div className={styles.glassCardGlow} />
      <div className={styles.glassCardContent}>{children}</div>
      <div className={styles.morphBlob1} />
      <div className={styles.morphBlob2} />
      <div className={styles.morphBlob3} />
    </motion.div>
  )
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error'
  message?: string
}

export function EmailFormCard() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' })
  const [isExploding, setIsExploding] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailTrimmed = email.trim()
    if (!emailTrimmed) {
      setStatus({ type: 'error', message: 'Please enter your email address.' })
      return
    }

    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/
    if (!emailPattern.test(emailTrimmed.toLowerCase())) {
      setStatus({ type: 'error', message: 'Enter a valid email to join the waitlist.' })
      return
    }

    try {
      setStatus({ type: 'loading' })

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Unexpected error' }))
        throw new Error(data.message ?? 'Unable to submit right now. Please try again.')
      }

      setIsExploding(true)
      setTimeout(() => {
        setStatus({ type: 'success' })
        setEmail('')
        setIsExploding(false)
      }, 1200)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to submit right now. Please try again.',
      })
    }
  }

  return (
    <GlassCard className={isExploding ? styles.exploding : ''}>
      {status.type === 'success' ? (
        <motion.div
          className={styles.successMessage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
        >
          <motion.div
            className={styles.checkmark}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#checkGradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <motion.path
                d="M20 40 L34 54 L60 26"
                stroke="url(#checkGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6ee7ff" />
                  <stop offset="100%" stopColor="#b892ff" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <h3>You're on the list!</h3>
          <p>We'll reach out soon with early access details.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.emailForm}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Join the Waitlist
          </motion.h2>
          <motion.p
            className={styles.formSubtext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Get early access to ADVAI
          </motion.p>

          <motion.div
            className={styles.inputWrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <motion.label
              htmlFor="glass-email"
              className={styles.floatingLabel}
              animate={{
                y: email ? -28 : 0,
                scale: email ? 0.85 : 1,
                opacity: email ? 0.8 : 0.6,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              Your work email
            </motion.label>
            <input
              id="glass-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={styles.liquidInput}
            />
            <motion.div
              className={styles.inputUnderline}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: email ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <motion.button
            type="submit"
            className={styles.magneticButton}
            disabled={status.type === 'loading'}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <span className={styles.buttonFill} />
            <span className={styles.buttonText}>
              {status.type === 'loading' ? (
                <motion.span
                  className={styles.loadingDots}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  Joining...
                </motion.span>
              ) : (
                'Request Access'
              )}
            </span>
          </motion.button>

          {status.message && (
            <motion.div
              className={`${styles.statusMessage} ${status.type === 'error' ? styles.error : ''}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {status.message}
            </motion.div>
          )}
        </form>
      )}
    </GlassCard>
  )
}
