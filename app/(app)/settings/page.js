'use client'
import { useAuth, usePlan } from '@/lib/hooks/useAuth'

export default function SettingsPage() {
  const { user, profile } = useAuth()
  const { plan } = usePlan()

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Parametres</h1>
        <p className="text-nawer-text-secondary text-sm mt-1">Votre compte NAWER</p>
      </div>
      <div className="bg-bg-surface border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-white font-semibold">Profil</h2>
        <div className="space-y-1">
          <p className="text-nawer-text-secondary text-sm">Nom : <span className="text-white">{profile?.displayName || '-'}</span></p>
          <p className="text-nawer-text-secondary text-sm">Email : <span className="text-white">{user?.email}</span></p>
          <p className="text-nawer-text-secondary text-sm">Plan : <span className={plan==='pro'?'text-accent-blue font-semibold':'text-white'}>{plan.charAt(0).toUpperCase()+plan.slice(1)}</span></p>
          {plan === 'free' && <p className="text-nawer-text-secondary text-sm">Generations ce mois : <span className="text-white">{profile?.monthlyGenerations || 0}/5</span></p>}
        </div>
        {plan === 'free' && (
          <div className="pt-4 border-t border-border">
            <p className="text-white font-semibold mb-2">Passer Pro - 20 DT/mois</p>
            <p className="text-nawer-text-secondary text-sm mb-4">Generations illimitees · PDF sans watermark · Corriges complets</p>
            <button className="bg-accent-purple hover:bg-accent-purple-hover text-white font-medium px-6 py-2.5 rounded transition-colors">
              Souscrire Pro
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
