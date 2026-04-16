'use client'
import { useState } from 'react'
import { completeOnboarding } from '@/lib/firebase/firestore'
import { useAuth } from '@/lib/hooks/useAuth'
import { LEVEL_GROUPS, getLevelsByGroup } from '@/constants/levels'
import { SUBJECTS_BY_LEVEL_GROUP } from '@/constants/subjects'
import { ChevronRight, Sparkles } from 'lucide-react'

export default function OnboardingModal({ onComplete }) {
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [group, setGroup] = useState('')
  const [level, setLevel] = useState('')
  const [subjects, setSubjects] = useState([])
  const [busy, setBusy] = useState(false)

  const toggleSubject = id => setSubjects(p => p.includes(id) ? p.filter(s=>s!==id) : [...p, id])

  async function finish() {
    setBusy(true)
    try {
      await completeOnboarding(user.uid, { mainLevel: level, mainSubjects: subjects })
      await refreshProfile()
      onComplete?.()
    } finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border rounded-xl w-full max-w-lg shadow-elevated">
        <div className="p-4 border-b border-border flex items-center gap-2">
          {[1,2].map(s => <div key={s} className={`h-1.5 rounded-full transition-all ${s<=step?'bg-accent-blue w-8':'bg-bg-elevated w-4'}`} />)}
          <span className="text-nawer-text-muted text-xs ml-2">Etape {step}/2</span>
        </div>
        <div className="p-6">
          {step === 1 && (
            <>
              <h2 className="text-white font-semibold text-lg mb-1">Quel niveau enseignez-vous ?</h2>
              <p className="text-nawer-text-secondary text-sm mb-5">NAWER adaptera le contenu a votre contexte.</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {LEVEL_GROUPS.map(g => (
                  <button key={g.id} onClick={() => { setGroup(g.id); setLevel('') }}
                    className={`flex items-center gap-2 p-3 rounded border transition-all ${group===g.id?'bg-accent-blue/10 border-accent-blue':'bg-bg-elevated border-border hover:border-border-active'}`}>
                    <span className="text-xl">{g.icon}</span>
                    <span className="text-sm font-medium text-white">{g.label}</span>
                  </button>
                ))}
              </div>
              {group && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {getLevelsByGroup(group).map(l => (
                    <button key={l.id} onClick={() => setLevel(l.id)}
                      className={`px-3 py-1.5 rounded text-xs transition-colors ${level===l.id?'bg-accent-blue text-white':'bg-bg-elevated text-nawer-text-secondary border border-border hover:text-white'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(2)} disabled={!level}
                className="w-full flex items-center justify-center gap-2 bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-40 text-white font-medium py-3 rounded">
                Continuer <ChevronRight size={16} />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-white font-semibold text-lg mb-1">Quelle(s) matiere(s) ?</h2>
              <p className="text-nawer-text-secondary text-sm mb-5">Selectionnez une ou plusieurs matieres.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(SUBJECTS_BY_LEVEL_GROUP[group]||[]).map(s => (
                  <button key={s.id} onClick={() => toggleSubject(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition-colors ${subjects.includes(s.id)?'bg-accent-purple/20 border border-accent-purple text-accent-purple':'bg-bg-elevated border border-border text-nawer-text-secondary hover:text-white'}`}>
                    <span>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded border border-border text-nawer-text-secondary hover:text-white text-sm">Retour</button>
                <button onClick={finish} disabled={subjects.length===0||busy}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-40 text-white font-medium py-3 rounded">
                  {busy ? 'Chargement...' : <><Sparkles size={15}/>Commencer</>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
