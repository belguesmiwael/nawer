'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getUserGenerations } from '@/lib/firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, FileText, BookOpen, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const firstName = profile?.displayName?.split(' ')[0] || 'Enseignant'

  useEffect(() => {
    if (!user) return
    getUserGenerations(user.uid, { limit: 20 }).then(setGenerations).finally(() => setLoading(false))
  }, [user])

  const stats = [
    { label: 'Generes',   value: generations.length,                             icon: Sparkles,   color: 'text-accent-blue'   },
    { label: 'PDFs',      value: generations.filter(g=>g.pdfUrl).length,         icon: FileText,   color: 'text-nawer-success' },
    { label: 'Chapitres', value: new Set(generations.map(g=>g.chapitre)).size,   icon: BookOpen,   color: 'text-accent-purple' },
    { label: 'Matieres',  value: new Set(generations.map(g=>g.matiere)).size,    icon: TrendingUp, color: 'text-nawer-warning' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Bonjour {firstName}</h1>
        <p className="text-nawer-text-secondary text-sm mt-1">Tableau de bord pedagogique</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-bg-surface border border-border rounded-lg p-4">
            <Icon size={18} className={`${color} mb-2`} />
            <div className="text-2xl font-bold text-white">{loading ? '-' : value}</div>
            <div className="text-nawer-text-muted text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {profile?.plan === 'free' && (
        <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-lg p-4 flex items-center justify-between">
          <p className="text-white text-sm">{5 - (profile?.monthlyGenerations || 0)} generations gratuites restantes ce mois</p>
          <Link href="/settings" className="bg-accent-purple text-white text-sm font-medium px-4 py-2 rounded">Passer Pro</Link>
        </div>
      )}

      <div onClick={() => router.push('/generate')} className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-5 cursor-pointer hover:bg-accent-blue/15 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center">
            <Sparkles size={20} className="text-accent-blue" />
          </div>
          <div>
            <p className="text-white font-semibold">Nouveau livrable pedagogique</p>
            <p className="text-nawer-text-secondary text-sm">Exercice + corrige · ~8 secondes</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-sm">Dernieres generations</h2>
          <Link href="/historique" className="text-accent-blue text-xs hover:underline">Tout voir</Link>
        </div>
        {loading ? (
          <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-12 skeleton rounded"/>)}</div>
        ) : generations.length === 0 ? (
          <p className="text-nawer-text-muted text-sm text-center py-8">
            Aucune generation. <Link href="/generate" className="text-accent-blue hover:underline">Generer votre premier exercice</Link>
          </p>
        ) : (
          <div className="space-y-2">
            {generations.slice(0, 6).map(gen => (
              <div key={gen.id} className="flex items-center gap-3 p-3 bg-bg-surface border border-border rounded hover:bg-bg-elevated transition-all">
                <FileText size={14} className="text-nawer-text-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{gen.content?.titre || gen.chapitre}</p>
                  <p className="text-nawer-text-muted text-xs">{gen.niveau} · {gen.matiere} · {gen.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
