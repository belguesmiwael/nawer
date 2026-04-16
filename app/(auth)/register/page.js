'use client'
import { useState } from 'react'
import { signInWithGoogle, registerWithEmail } from '@/lib/firebase/auth'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleGoogle() {
    setBusy(true); setError('')
    try {
      await signInWithGoogle()
      window.location.href = '/dashboard'
    } catch(e) { setError('Erreur: ' + e.message) } finally { setBusy(false) }
  }

  async function handleRegister(e) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      if (password.length < 6) { setError('Mot de passe min. 6 caracteres'); setBusy(false); return }
      await registerWithEmail(email, password, name)
      window.location.href = '/dashboard'
    } catch(e) {
      setError(e.code === 'auth/email-already-in-use' ? 'Email deja utilise.' : 'Erreur: ' + e.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-2">NAWER</h1>
        <p className="text-nawer-text-secondary text-sm text-center mb-8">5 generations gratuites</p>
        <div className="bg-bg-surface border border-border rounded-lg p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Creer votre compte</h2>
          <button onClick={handleGoogle} disabled={busy}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-md hover:bg-gray-100 disabled:opacity-50 mb-6">
            {busy ? 'Creation...' : 'Continuer avec Google'}
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"/>
            <span className="text-nawer-text-muted text-xs">ou</span>
            <div className="flex-1 h-px bg-border"/>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Votre nom" required
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-blue"/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" required
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-blue"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe (min 6)" required
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-blue"/>
            {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
            <button type="submit" disabled={busy}
              className="w-full bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-50 text-white font-medium py-3 rounded">
              {busy ? 'Creation...' : 'Creer mon compte gratuit'}
            </button>
          </form>
          <p className="text-center text-nawer-text-muted text-xs mt-4">
            Deja un compte ? <a href="/login" className="text-accent-blue hover:underline">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  )
}
