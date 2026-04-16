'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Navbar from '@/components/layout/Navbar'
import OnboardingModal from '@/components/onboarding/OnboardingModal'

export default function AppLayout({ children }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => { if (!loading && !user) router.push('/login') }, [user, loading])
  useEffect(() => { if (profile && !profile.onboardingCompleted) setShowOnboarding(true) }, [profile])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary">
      <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen bg-bg-primary">
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
