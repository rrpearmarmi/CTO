'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './KineticText.module.css'

interface KineticTextProps {
  children: string
  className?: string
  variant?: 'hero' | 'subtitle'
  enableMagnetic?: boolean
  enableBreathing?: boolean
  enableSplit?: boolean
  delay?: number
}

function splitTextIntoWords(text: string): string[] {
  return text.split(' ')
}

export default function KineticText({
  children,
  className = '',
  variant = 'hero',
  enableMagnetic = true,
  enableBreathing = true,
  enableSplit = true,
  delay = 0,
}: KineticTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const words = enableSplit ? splitTextIntoWords(children) : [children]

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enableMagnetic || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: enableSplit ? 0.06 : 0,
        delayChildren: delay,
      },
    },
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.94,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
        mass: 0.8,
      },
    },
  }

  const Tag = variant === 'hero' ? motion.h1 : motion.h2

  return (
    <Tag
      ref={containerRef}
      className={`${styles.kineticText} ${styles[variant]} ${enableBreathing ? styles.breathing : ''} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
    >
      {words.map((word, wordIndex) => (
        <motion.span key={`${word}-${wordIndex}`} className={styles.word} variants={wordVariants}>
          {word.split('').map((char, charIndex) => (
            <MagneticChar
              key={`${char}-${charIndex}`}
              char={char}
              mousePosition={mousePosition}
              charIndex={charIndex}
              wordIndex={wordIndex}
              enabled={enableMagnetic}
            />
          ))}
        </motion.span>
      ))}
    </Tag>
  )
}

interface MagneticCharProps {
  char: string
  mousePosition: { x: number; y: number }
  charIndex: number
  wordIndex: number
  enabled: boolean
}

function MagneticChar({ char, mousePosition, charIndex, wordIndex, enabled }: MagneticCharProps) {
  const charRef = useRef<HTMLSpanElement>(null)
  const xOffset = useMotionValue(0)
  const yOffset = useMotionValue(0)
  const springConfig = { damping: 20, stiffness: 150, mass: 0.6 }
  const xSpring = useSpring(xOffset, springConfig)
  const ySpring = useSpring(yOffset, springConfig)

  useEffect(() => {
    if (!enabled || !charRef.current) return

    const rect = charRef.current.getBoundingClientRect()
    const charCenterX = rect.left + rect.width / 2 - (charRef.current.parentElement?.getBoundingClientRect().left || 0)
    const charCenterY = rect.top + rect.height / 2 - (charRef.current.parentElement?.getBoundingClientRect().top || 0)

    const dx = mousePosition.x - charCenterX
    const dy = mousePosition.y - charCenterY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = 180
    const repelStrength = 18

    if (distance < maxDistance && distance > 0) {
      const influence = 1 - distance / maxDistance
      const repelX = -(dx / distance) * repelStrength * influence
      const repelY = -(dy / distance) * repelStrength * influence

      xOffset.set(repelX)
      yOffset.set(repelY)
    } else {
      xOffset.set(0)
      yOffset.set(0)
    }
  }, [mousePosition, xOffset, yOffset, enabled])

  return (
    <motion.span ref={charRef} className={styles.char} style={{ x: xSpring, y: ySpring }}>
      {char}
    </motion.span>
  )
}

interface ScrambleTextProps {
  children: string
  className?: string
  delay?: number
  duration?: number
}

export function ScrambleText({ children, className = '', delay = 0, duration = 2.4 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

  useEffect(() => {
    const targetText = children
    const startTime = Date.now() + delay * 1000
    const endTime = startTime + duration * 1000
    let rafId: number

    const scramble = () => {
      const now = Date.now()
      if (now < startTime) {
        rafId = requestAnimationFrame(scramble)
        return
      }

      const progress = Math.min((now - startTime) / (endTime - startTime), 1)
      const revealedLength = Math.floor(progress * targetText.length)

      const newText = targetText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          if (index < revealedLength) return char
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')

      setDisplayText(newText)

      if (progress < 1) {
        rafId = requestAnimationFrame(scramble)
      } else {
        setDisplayText(targetText)
      }
    }

    rafId = requestAnimationFrame(scramble)

    return () => cancelAnimationFrame(rafId)
  }, [children, delay, duration])

  return (
    <motion.span
      className={`${styles.scrambleText} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  )
}

interface GradientTextProps {
  children: string
  className?: string
  delay?: number
}

export function GradientText({ children, className = '', delay = 0 }: GradientTextProps) {
  return (
    <motion.span
      className={`${styles.gradientText} ${className}`}
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        delay,
        duration: 0.9,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      {children}
    </motion.span>
  )
}
