'use client'

import { FormEvent, useState } from 'react'
import { motion, MotionValue, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import styles from './WaitlistPage.module.css'
import ShaderBackground from './graphics/ShaderBackground'
import GradientOrbs from './graphics/GradientOrbs'
import ParallaxTrail from './graphics/ParallaxTrail'

const featureCards = [
  {
    title: 'Real-time Intel',
    description: 'ADVAI synthesizes live deal data, market signals, and playbooks to coach you in the moment.',
    accent: 'insightful',
  },
  {
    title: 'Negotiation Foresight',
    description: 'Predict counter-moves and surface high-leverage tactics before you walk into the room.',
    accent: 'strategic',
  },
  {
    title: 'Adaptive Strategy',
    description: 'ADVAI learns your style and partners, continuously refining the guidance you receive.',
    accent: 'adaptive',
  },
]

const microcopy = [
  'Tactical briefs delivered in seconds',
  'Calibrate leverage with real-time sentiment',
  'Integrates with your existing deal stack',
]

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } },
}

type StatusState = { type: 'idle' } | { type: 'loading' } | { type: 'success' } | { type: 'error'; message: string }

function EmailForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<StatusState>({ type: 'idle' })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailTrimmed }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Unexpected error' }))
        throw new Error(data.message ?? 'Unable to submit right now. Please try again.')
      }

      setStatus({ type: 'success' })
      setEmail('')
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to submit right now. Please try again.',
      })
    }
  }

  return (
    <motion.form
      className={styles.form}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      onSubmit={handleSubmit}
    >
      <div className={styles.formField}>
        <label htmlFor="waitlist-email" className={styles.visuallyHidden}>
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className={styles.input}
        />
      </div>
      <motion.button
        type="submit"
        className={styles.submitButton}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={status.type === 'loading'}
      >
        {status.type === 'loading' ? 'Joining…' : 'Join the Waitlist'}
      </motion.button>
      <div className={styles.formStatus} aria-live="polite" role="status">
        {status.type === 'success' && 'We’ll be in touch soon. You’re on the list!'}
        {status.type === 'error' && status.message}
      </div>
    </motion.form>
  )
}

function MicrocopyList() {
  return (
    <motion.ul
      className={styles.microcopy}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {microcopy.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </motion.ul>
  )
}

type FeatureProps = {
  title: string
  description: string
  accent: string
  index: number
  prefersReducedMotion: boolean
}

function FeatureCard({ title, description, accent, index, prefersReducedMotion }: FeatureProps) {
  return (
    <motion.div
      className={styles.featureCard}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.08 }}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02, rotateX: prefersReducedMotion ? 0 : 2 }}
    >
      <div className={styles.featureAccent}>{accent}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  )
}

type BackgroundLayersProps = {
  heroTranslate: MotionValue<number>
  blobTranslate: MotionValue<number>
  trailTranslate: MotionValue<number>
}

function BackgroundLayers({ heroTranslate, blobTranslate, trailTranslate }: BackgroundLayersProps) {
  return (
    <div className={styles.backgroundWrapper} aria-hidden>
      <motion.div className={styles.heroGlow} style={{ y: heroTranslate }} />
      <GradientOrbs motionValue={blobTranslate} />
      <ParallaxTrail motionValue={trailTranslate} />
      <ShaderBackground className={styles.shaderSurface} />
    </div>
  )
}

export default function WaitlistPage() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const heroTranslate = useTransform(scrollYProgress, [0, 1], [0, -140])
  const blobTranslate = useTransform(scrollYProgress, [0, 1], [0, 160])
  const trailTranslate = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <div className={styles.page}>
      <BackgroundLayers heroTranslate={heroTranslate} blobTranslate={blobTranslate} trailTranslate={trailTranslate} />
      <main className={styles.main}>
        <motion.header
          className={styles.hero}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.7 } }}
        >
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.6 } }}
          >
            Early access cohort · Limited seats
          </motion.span>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.7 } }}
          >
            An Advisor in Your Ear. A Strategist in Your Pocket.
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.7 } }}
          >
            Join the waitlist for early access to ADVAI — real-time AI intelligence for negotiations, deals, and beyond.
          </motion.p>
          <EmailForm />
          <MicrocopyList />
        </motion.header>

        <section className={styles.featureGrid}>
          {featureCards.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} prefersReducedMotion={!!prefersReducedMotion} />
          ))}
        </section>

        <motion.section
          className={styles.glassSection}
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className={styles.glassContent}>
            <h2>Built for the moments that move deals forward.</h2>
            <p>
              ADVAI distills strategic guidance, relationship insights, and tactical execution into the rhythm of your day. From
              prep to live conversations, you&apos;ll always know the next best move.
            </p>
          </div>
          <div className={styles.timeline}>
            <motion.div className={styles.timelineCard} whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}>
              <span>Before</span>
              <strong>Scenario briefs tailored to the players and stakes.</strong>
            </motion.div>
            <motion.div className={styles.timelineCard} whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}>
              <span>During</span>
              <strong>Live coaching with adaptive plays and sentiment calibrations.</strong>
            </motion.div>
            <motion.div className={styles.timelineCard} whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}>
              <span>After</span>
              <strong>Post-mortems and follow-up sequences generated instantly.</strong>
            </motion.div>
          </div>
        </motion.section>

        <motion.footer
          className={styles.footer}
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div>
            <h3>Join the operators shaping the next era of deal-making.</h3>
            <p>Secure your spot and be the first to deploy ADVAI inside your team.</p>
          </div>
          <EmailForm />
        </motion.footer>
      </main>
    </div>
  )
}
