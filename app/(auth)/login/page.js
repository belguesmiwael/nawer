'use client'
import { useState } from 'react'
import { signInWithGoogle, signInWithEmail } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleGoogle() {
    setBusy(true); setError('')
    try {
      await signInWithGoogle()
      window.location.href = '/dashboard'
    } catch(e) {
      setError('Erreur Google: ' + e.message)
    } finally { setBusy(false) }
  }

  async function handleEmail(e) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      await signInWithEmail(email, password)
      window.location.href = '/dashboard'
    } catch(e) {
      setError('Email ou mot de passe incorrect: ' + e.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-2">NAWER</h1>
        <p className="text-nawer-text-secondary text-sm text-center mb-8">Copilote pedagogique</p>
        <div className="bg-bg-surface border border-border rounded-lg p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Connexion</h2>
          <button onClick={handleGoogle} disabled={busy}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-md hover:bg-gray-100 disabled:opacity-50 mb-6">
            {busy ? 'Connexion...' : 'Continuer avec Google'}
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"/>
            <span className="text-nawer-text-muted text-xs">ou</span>
            <div className="flex-1 h-px bg-border"/>
          </div>
          <form onSubmit={handleEmail} className="space-y-4">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="votre@email.com" required
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-blue"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="Mot de passe" required
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-blue"/>
            {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
            <button type="submit" disabled={busy}
              className="w-full bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-50 text-white font-medium py-3 rounded">
              {busy ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center text-nawer-text-muted text-xs mt-4">
            Pas de compte ? <a href="/register" className="text-accent-blue hover:underline">Creer un compte</a>
          </p>
        </div>
      </div>
    </div>
  )
}
