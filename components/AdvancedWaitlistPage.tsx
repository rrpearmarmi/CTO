'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './AdvancedWaitlistPage.module.css'
import KineticText, { GradientText, ScrambleText } from './ui/KineticText'
import { EmailFormCard } from './ui/GlassCard'
import CustomCursor from './ui/CustomCursor'
import AudioVisualizer from './ui/AudioVisualizer'
import DataTicker from './ui/DataTicker'
import SmoothScroll from './ui/SmoothScroll'

const NeuralBackground = dynamic(() => import('./graphics/NeuralBackground'), { ssr: false })
const MiniNeural = dynamic(() => import('./graphics/MiniNeural'), { ssr: false })

const tickerData = [
  'SENTIMENT ANALYSIS',
  'REAL-TIME COACHING',
  'MARKET INTELLIGENCE',
  'NEGOTIATION TACTICS',
  'ADAPTIVE STRATEGY',
  'DEAL INSIGHTS',
]

const featureCards = [
  {
    title: 'Neural Intelligence',
    description: 'Real-time AI that analyzes market dynamics, opponent strategies, and deal trajectories as conversations unfold.',
    icon: '⚡',
  },
  {
    title: 'Tactical Briefings',
    description: 'Pre-call scenario briefs tailored to specific stakeholders, leveraging historical patterns and predictive models.',
    icon: '🎯',
  },
  {
    title: 'Live Guidance',
    description: 'In-the-moment coaching with adaptive plays, sentiment calibrations, and counter-move suggestions.',
    icon: '🔮',
  },
  {
    title: 'Continuous Learning',
    description: 'ADVAI evolves with your style, learning from every interaction to refine future recommendations.',
    icon: '🧠',
  },
]

const useCases = [
  {
    phase: 'Before',
    title: 'Strategic Preparation',
    description: 'Scenario briefs with player profiles, leverage points, and recommended opening tactics.',
  },
  {
    phase: 'During',
    title: 'Real-Time Execution',
    description: 'Live coaching that adapts to conversation flow, sentiment shifts, and emerging opportunities.',
  },
  {
    phase: 'After',
    title: 'Post-Deal Analysis',
    description: 'Automated post-mortems with follow-up sequences, key takeaways, and optimization paths.',
  },
]

const testimonials = [
  {
    quote:
      "ADVAI has transformed how we approach high-stakes negotiations. It's like having a strategic advisor whispering insights in real-time.",
    author: 'Sarah Chen',
    role: 'VP of Business Development',
  },
  {
    quote: "The predictive intelligence is remarkable. We're closing deals faster with better terms than ever before.",
    author: 'Marcus Rodriguez',
    role: 'Chief Revenue Officer',
  },
  {
    quote: "This isn't just AI—it's a competitive advantage. Every team member now has access to world-class negotiation expertise.",
    author: 'Priya Kapoor',
    role: 'Head of Sales',
  },
]

const faqItems = [
  {
    question: 'How does ADVAI integrate with my existing workflow?',
    answer:
      'ADVAI seamlessly connects with your existing deal stack—CRM, communication tools, and data sources. It works in the background, surfacing insights when you need them.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We employ enterprise-grade encryption, zero-trust architecture, and strict compliance with data privacy regulations. Your strategic intelligence stays yours.',
  },
  {
    question: 'What makes ADVAI different from other AI tools?',
    answer:
      'ADVAI is purpose-built for negotiations and deal-making. Unlike generic AI assistants, it understands leverage dynamics, behavioral economics, and strategic timing.',
  },
  {
    question: 'How quickly can my team onboard?',
    answer:
      'Most teams are fully operational within 48 hours. ADVAI learns your context rapidly and provides value from day one, improving continuously.',
  },
]

export default function AdvancedWaitlistPage() {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef(0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 3.6])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3])

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) return undefined

    gsap.registerPlugin(ScrollTrigger)

    parallaxRef.current = parallaxY.get()

    const unsubscribe = parallaxY.on('change', (value) => {
      parallaxRef.current = value
    })

    const lenis = window.__lenis
    const handleRefresh = () => {
      if (lenis && typeof lenis.resize === 'function') {
        lenis.resize()
      }
    }

    let removeLenisListener: (() => void) | undefined

    if (lenis && typeof lenis.on === 'function') {
      const updateScrollTrigger = () => ScrollTrigger.update()
      lenis.on('scroll', updateScrollTrigger)
      removeLenisListener = () => {
        if (typeof lenis.off === 'function') {
          lenis.off('scroll', updateScrollTrigger)
        }
      }

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (typeof value === 'number') {
            lenis.scrollTo(value, { immediate: true })
          }
          return lenis.scroll ?? window.scrollY
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
        },
      })

      ScrollTrigger.addEventListener('refresh', handleRefresh)
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 80, rotateX: -8 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    }, containerRef)

    ScrollTrigger.refresh()

    return () => {
      unsubscribe()
      ctx.revert()
      if (removeLenisListener) removeLenisListener()
      ScrollTrigger.removeEventListener('refresh', handleRefresh)
    }
  }, [parallaxY, prefersReducedMotion])

  return (
    <SmoothScroll>
      <div
        ref={containerRef}
        className={styles.pageContainer}
        data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      >
        <CustomCursor disabled={!!prefersReducedMotion} />

        <div className={styles.neuralBackgroundWrapper}>
          <NeuralBackground
            className={styles.neuralCanvas}
            parallax={parallaxRef.current}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        </div>

        <main className={styles.mainContent}>
          <motion.section className={styles.heroSection} style={{ opacity }}>
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className={styles.badgeGlow} />
              <ScrambleText delay={0.3} duration={1.8}>
                EARLY ACCESS · LIMITED COHORT
              </ScrambleText>
            </motion.div>

            <KineticText
              variant="hero"
              className={styles.heroTitle}
              enableMagnetic={!prefersReducedMotion}
              enableBreathing={!prefersReducedMotion}
              delay={0.5}
            >
              An Advisor in Your Ear. A Strategist in Your Pocket.
            </KineticText>

            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <GradientText delay={0.95}>
                Join the waitlist for early access to ADVAI — real-time AI intelligence for negotiations, deals, and beyond.
              </GradientText>
            </motion.p>

            <AudioVisualizer prefersReducedMotion={!!prefersReducedMotion} />

            <motion.div
              className={styles.formCardWrapper}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.9 }}
            >
              <EmailFormCard />
            </motion.div>

            <motion.div
              className={styles.trustBadges}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.7 }}
            >
              <span className={styles.trustBadge}>
                <span className={styles.trustIcon}>🔒</span>
                Enterprise Security
              </span>
              <span className={styles.trustBadge}>
                <span className={styles.trustIcon}>⚡</span>
                Instant Access
              </span>
              <span className={styles.trustBadge}>
                <span className={styles.trustIcon}>✓</span>
                No Credit Card
              </span>
            </motion.div>
          </motion.section>

          <section className={styles.tickerSection}>
            <DataTicker items={tickerData} />
          </section>

          <section className={styles.featuresSection}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
            >
              Intelligence That Moves With You
            </motion.h2>

            <div className={styles.featureGrid}>
              {featureCards.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={styles.featureCard}
                  data-scroll-reveal="true"
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.12, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
                  whileHover={{
                    scale: prefersReducedMotion ? 1 : 1.05,
                    rotateY: prefersReducedMotion ? 0 : 5,
                  }}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className={styles.featureGlow} />
                </motion.div>
              ))}
            </div>
          </section>

          <section className={styles.useCasesSection}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
            >
              Built for the Moments That Matter
            </motion.h2>

            <div className={styles.timeline}>
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.phase}
                  className={styles.timelineItem}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.15, duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
                >
                  <div className={styles.timelinePhase}>{useCase.phase}</div>
                  <h3>{useCase.title}</h3>
                  <p>{useCase.description}</p>
                  <div className={styles.timelineConnector} />
                </motion.div>
              ))}
            </div>
          </section>

          <section className={styles.testimonialsSection}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
            >
              Trusted by Deal-Makers
            </motion.h2>

            <div className={styles.testimonialGrid}>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  className={styles.testimonialCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
                  whileHover={{ y: prefersReducedMotion ? 0 : -8 }}
                >
                  <p className={styles.quote}>"{testimonial.quote}"</p>
                  <div className={styles.author}>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className={styles.faqSection}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
            >
              Questions & Answers
            </motion.h2>

            <div className={styles.faqList}>
              {faqItems.map((item, index) => (
                <motion.details
                  key={item.question}
                  className={styles.faqItem}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.08, duration: 0.6 }}
                >
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </motion.details>
              ))}
            </div>
          </section>

          <footer className={styles.footer}>
            <div className={styles.footerNeural}>
              <MiniNeural className={styles.footerNeuralCanvas} />
            </div>

            <motion.div
              className={styles.footerContent}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
            >
              <h3>Ready to Transform Your Deal-Making?</h3>
              <p>Join the operators shaping the next era of strategic intelligence.</p>
              <motion.div
                className={styles.footerForm}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                <EmailFormCard />
              </motion.div>
            </motion.div>

            <div className={styles.footerBottom}>
              <p>© 2024 ADVAI. Engineered for Excellence.</p>
            </div>
          </footer>
        </main>
      </div>
    </SmoothScroll>
  )
}
