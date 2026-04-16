'use client'
import { useState } from 'react'
import { LEVEL_GROUPS, getLevelsByGroup } from '@/constants/levels'
import { SUBJECTS_BY_LEVEL_GROUP, LANGUAGES } from '@/constants/subjects'
import { LIVRABLE_TYPES } from '@/constants/livrableTypes'
import { useGeneration } from '@/lib/hooks/useGeneration'
import GenerationResult from './GenerationResult'
import { Sparkles, Loader2, ChevronDown } from 'lucide-react'

export default function GeneratorForm() {
  const [group,   setGroup]   = useState('')
  const [level,   setLevel]   = useState('')
  const [subject, setSubject] = useState('')
  const [lang,    setLang]    = useState('fr')
  const [chapter, setChapter] = useState('')
  const [type,    setType]    = useState('')
  const [showAdv, setShowAdv] = useState(false)
  const [struct,  setStruct]  = useState({})

  const { generate, reset, status, rawText, parsed, error, activeTab, setActiveTab } = useGeneration()

  const subjects = group   ? (SUBJECTS_BY_LEVEL_GROUP[group] || []) : []
  const langs    = subject ? (subjects.find(s=>s.id===subject)?.langs || ['fr']) : ['fr']
  const levels   = group   ? getLevelsByGroup(group) : []
  const valid    = level && subject && lang && chapter && type

  async function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return
    await generate({ niveau: level, matiere: subject, langue: lang, chapitre: chapter, type, structure: struct })
  }

  if (status === 'streaming' || status === 'success') {
    return <GenerationResult rawText={rawText} parsed={parsed} isStreaming={status==='streaming'} activeTab={activeTab} onTabChange={setActiveTab} onReset={() => { reset(); setChapter(''); setType('') }} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3">
          <p className="text-red-400 text-sm font-medium">{error.type==='limit' ? 'Limite mensuelle atteinte' : 'Erreur'}</p>
          <p className="text-red-400/80 text-sm mt-1">{error.message}</p>
        </div>
      )}

      <section>
        <label className="block text-nawer-text-secondary text-sm font-medium mb-3">1 - Niveau scolaire</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {LEVEL_GROUPS.map(g => (
            <button key={g.id} type="button" onClick={() => { setGroup(g.id); setLevel('') }}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${group===g.id?'bg-accent-blue text-white':'bg-bg-elevated text-nawer-text-secondary border border-border hover:text-white'}`}>
              {g.icon} {g.label}
            </button>
          ))}
        </div>
        {group && (
          <div className="flex flex-wrap gap-2">
            {levels.map(l => (
              <button key={l.id} type="button" onClick={() => setLevel(l.id)}
                className={`px-3 py-1.5 rounded text-xs transition-colors ${level===l.id?'bg-accent-blue/20 border border-accent-blue text-accent-blue':'bg-bg-elevated text-nawer-text-muted border border-border hover:text-white'}`}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {group && (
        <section>
          <label className="block text-nawer-text-secondary text-sm font-medium mb-3">2 - Matiere et langue</label>
          <div className="flex flex-wrap gap-2">
            {subjects.map(s => (
              <button key={s.id} type="button" onClick={() => { setSubject(s.id); if (!s.langs.includes(lang)) setLang(s.langs[0]) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${subject===s.id?'bg-accent-purple/20 border border-accent-purple text-accent-purple':'bg-bg-elevated text-nawer-text-secondary border border-border hover:text-white'}`}>
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
          {subject && (
            <div className="flex gap-2 mt-3">
              {langs.map(lid => {
                const l = LANGUAGES.find(x=>x.id===lid)
                return l ? (
                  <button key={lid} type="button" onClick={() => setLang(lid)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${lang===lid?'border border-accent-blue text-accent-blue bg-bg-elevated':'bg-bg-elevated text-nawer-text-muted border border-border hover:text-white'}`}>
                    {l.flag} {l.label}
                  </button>
                ) : null
              })}
            </div>
          )}
        </section>
      )}

      {level && subject && (
        <section>
          <label className="block text-nawer-text-secondary text-sm font-medium mb-2">3 - Chapitre (Programme MEN)</label>
          <input type="text" value={chapter} onChange={e=>setChapter(e.target.value)}
            placeholder="Ex: Calcul Integral, Les Fractions, Photosynthese..."
            className="w-full bg-bg-elevated border border-border rounded px-3 py-2.5 text-white text-sm placeholder-nawer-text-muted focus:outline-none focus:border-accent-blue"/>
        </section>
      )}

      {chapter && (
        <section>
          <label className="block text-nawer-text-secondary text-sm font-medium mb-3">4 - Type de livrable</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LIVRABLE_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setType(t.id)}
                className={`flex flex-col items-start p-3 rounded text-left transition-all ${type===t.id?'bg-accent-blue/10 border border-accent-blue':'bg-bg-elevated border border-border hover:border-border-active'}`}>
                <span className="text-lg mb-1">{t.icon}</span>
                <span className={`text-sm font-medium ${type===t.id?'text-accent-blue':'text-white'}`}>{t.label}</span>
                <span className="text-nawer-text-muted text-xs mt-0.5">{t.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {type && (
        <section>
          <button type="button" onClick={() => setShowAdv(!showAdv)} className="flex items-center gap-2 text-nawer-text-secondary text-sm hover:text-white">
            <ChevronDown size={15} className={`transition-transform ${showAdv?'rotate-180':''}`}/> Definir la structure (optionnel)
          </button>
          {showAdv && (
            <div className="mt-3 p-4 bg-bg-elevated rounded border border-border grid grid-cols-2 gap-4">
              <div>
                <label className="text-nawer-text-muted text-xs mb-1 block">Nb questions</label>
                <input type="number" min="1" max="20" value={struct.nbQuestions||''} onChange={e=>setStruct(s=>({...s,nbQuestions:parseInt(e.target.value)||undefined}))} placeholder="Auto"
                  className="w-full bg-bg-primary border border-border rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-accent-blue"/>
              </div>
              <div>
                <label className="text-nawer-text-muted text-xs mb-1 block">Bareme (pts)</label>
                <input type="number" min="5" max="40" value={struct.baremeTotal||''} onChange={e=>setStruct(s=>({...s,baremeTotal:parseInt(e.target.value)||undefined}))} placeholder="20"
                  className="w-full bg-bg-primary border border-border rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-accent-blue"/>
              </div>
            </div>
          )}
        </section>
      )}

      {valid && (
        <button type="submit" disabled={status==='loading'||status==='streaming'}
          className="w-full flex items-center justify-center gap-3 bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-60 text-white font-semibold py-4 rounded-md shadow-glow-blue transition-all">
          {status==='loading' ? <><Loader2 size={17} className="animate-spin"/>Preparation...</> : <><Sparkles size={17}/>Generer exercice + corrige</>}
        </button>
      )}
    </form>
  )
}
