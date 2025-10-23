import { NextRequest, NextResponse } from 'next/server'

type WaitlistEntry = {
  email: string
  timestamp: string
}

const waitlist: WaitlistEntry[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 })
    }

    const emailTrimmed = email.trim().toLowerCase()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(emailTrimmed)) {
      return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 })
    }

    const existingEntry = waitlist.find((entry) => entry.email === emailTrimmed)
    if (existingEntry) {
      return NextResponse.json({ message: 'You are already on the waitlist!' }, { status: 200 })
    }

    const newEntry: WaitlistEntry = {
      email: emailTrimmed,
      timestamp: new Date().toISOString(),
    }

    waitlist.push(newEntry)

    console.log(`New waitlist signup: ${emailTrimmed}`)

    return NextResponse.json(
      { message: 'Successfully added to the waitlist!', email: emailTrimmed },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json({ message: 'Unable to process your request.' }, { status: 500 })
  }
}
