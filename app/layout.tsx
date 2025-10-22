import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ADVAI - An Advisor in Your Ear',
  description: 'Join the waitlist for early access to ADVAI — real-time AI intelligence for negotiations, deals, and beyond.',
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
