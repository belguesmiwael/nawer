'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { onAuthChange } from '@/lib/firebase/auth'
import { getUser } from '@/lib/firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const prof = await getUser(firebaseUser.uid)
        setProfile(prof)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const refreshProfile = async () => {
    if (user) setProfile(await getUser(user.uid))
  }

  const value = { user, profile, loading, refreshProfile }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function usePlan() {
  const { profile } = useAuth()
  return {
    plan:     profile?.plan || 'free',
    isPro:    profile?.plan === 'pro' || profile?.plan === 'school',
    isFree:   profile?.plan === 'free',
    isSchool: profile?.plan === 'school',
  }
}
