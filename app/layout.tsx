import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ADVAI — An Advisor in Your Ear, A Strategist in Your Pocket',
  description: 'Join the waitlist for early access to ADVAI — real-time AI intelligence for negotiations, deals, and beyond. Experience neural intelligence that transforms how you close deals.',
  openGraph: {
    title: 'ADVAI — Real-Time AI Intelligence for Negotiations',
    description: 'Transform your deal-making with neural intelligence. Join the limited early access cohort.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
