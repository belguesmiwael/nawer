'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getUserGenerations, toggleFavorite, deleteGeneration } from '@/lib/firebase/firestore'
import { LIVRABLE_TYPES } from '@/constants/livrableTypes'
import { FileText, Star, Trash2, Download, Search } from 'lucide-react'
import Link from 'next/link'

export default function HistoriquePage() {
  const { user } = useAuth()
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterFav, setFilterFav] = useState(false)

  useEffect(() => {
    if (!user) return
    getUserGenerations(user.uid, { limit: 100 }).then(setGenerations).finally(() => setLoading(false))
  }, [user])

  async function handleFav(gen) {
    await toggleFavorite(gen.id, !gen.isFavorite)
    setGenerations(p => p.map(g => g.id===gen.id ? {...g, isFavorite: !g.isFavorite} : g))
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ?')) return
    await deleteGeneration(id)
    setGenerations(p => p.filter(g => g.id !== id))
  }

  const filtered = generations
    .filter(g => filterFav ? g.isFavorite : true)
    .filter(g => filterType === 'all' || g.type === filterType)
    .filter(g => !search || [g.content?.titre, g.matiere, g.chapitre].some(v => v?.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mes generations</h1>
        <p className="text-nawer-text-secondary text-sm mt-1">{generations.length} exercice(s) generes</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-nawer-text-muted" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-bg-elevated border border-border rounded text-white text-sm placeholder-nawer-text-muted focus:outline-none focus:border-accent-blue"/>
        </div>
        {['all', ...LIVRABLE_TYPES.map(t=>t.id)].map(t => (
          <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded text-xs transition-colors ${filterType===t?'bg-accent-blue text-white':'bg-bg-elevated text-nawer-text-secondary border border-border hover:text-white'}`}>
            {t==='all' ? 'Tous' : LIVRABLE_TYPES.find(x=>x.id===t)?.label}
          </button>
        ))}
        <button onClick={() => setFilterFav(!filterFav)} className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-colors ${filterFav?'bg-nawer-warning/20 border border-nawer-warning text-nawer-warning':'bg-bg-elevated border border-border text-nawer-text-secondary hover:text-white'}`}>
          <Star size={11} /> Favoris
        </button>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i=><div key={i} className="h-40 skeleton rounded-lg"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-nawer-text-muted">
          <FileText size={36} className="mx-auto mb-4 opacity-30"/>
          <p className="text-sm">Aucun resultat.</p>
          <Link href="/generate" className="text-accent-blue text-sm hover:underline mt-2 inline-block">Generer</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(gen => {
            const t = LIVRABLE_TYPES.find(x=>x.id===gen.type)
            return (
              <div key={gen.id} className="bg-bg-surface border border-border rounded-lg p-4 flex flex-col hover:bg-bg-elevated transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-nawer-text-muted">{t?.icon} {t?.label}</span>
                  <button onClick={() => handleFav(gen)} className={gen.isFavorite?'text-nawer-warning':'text-nawer-text-muted hover:text-nawer-warning'}>
                    <Star size={13} fill={gen.isFavorite?'currentColor':'none'}/>
                  </button>
                </div>
                <h3 className="text-white text-sm font-medium flex-1 mb-2">{gen.content?.titre || gen.chapitre}</h3>
                <p className="text-nawer-text-muted text-xs mb-3">{gen.niveau} · {gen.matiere}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  {gen.pdfUrl && <a href={gen.pdfUrl} target="_blank" className="flex items-center gap-1 text-xs text-accent-blue hover:underline"><Download size={11}/> PDF</a>}
                  {gen.correctionPdfUrl && <a href={gen.correctionPdfUrl} target="_blank" className="flex items-center gap-1 text-xs text-nawer-success hover:underline"><Download size={11}/> Corrige</a>}
                  <button onClick={() => handleDelete(gen.id)} className="ml-auto text-nawer-text-muted hover:text-red-400"><Trash2 size={12}/></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
