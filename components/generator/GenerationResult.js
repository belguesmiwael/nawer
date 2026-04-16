'use client'
import { useEffect, useRef, useState } from 'react'
import { Download, RotateCcw, Copy, CheckCheck } from 'lucide-react'

export default function GenerationResult({ rawText, parsed, isStreaming, activeTab, onTabChange, onReset }) {
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (isStreaming && ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [rawText, isStreaming])

  async function copy() {
    const text = activeTab === 'exercice' ? formatExo(parsed?.exercice) : formatCorrige(parsed?.corrige)
    await navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-bg-elevated rounded p-1">
          <button onClick={() => onTabChange('exercice')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${activeTab==='exercice'?'bg-accent-blue text-white':'text-nawer-text-secondary hover:text-white'}`}>
            Exercice {isStreaming && activeTab==='exercice' && <span className="w-1 h-4 bg-accent-blue animate-pulse rounded-full inline-block"/>}
          </button>
          <button onClick={() => onTabChange('corrige')} disabled={!parsed} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-40 ${activeTab==='corrige'?'bg-nawer-success/20 border border-nawer-success text-nawer-success':'text-nawer-text-secondary hover:text-white'}`}>
            Corrige
          </button>
        </div>
        <div className="flex items-center gap-2">
          {parsed && (
            <>
              <button onClick={copy} className="flex items-center gap-1 px-2 py-1.5 bg-bg-elevated border border-border rounded text-nawer-text-secondary hover:text-white text-xs">
                {copied ? <CheckCheck size={12}/> : <Copy size={12}/>} {copied ? 'Copie' : 'Copier'}
              </button>
              <button className="flex items-center gap-1 px-2 py-1.5 bg-accent-blue text-white rounded text-xs"><Download size={12}/> PDF</button>
              <button className="flex items-center gap-1 px-2 py-1.5 bg-nawer-success/10 border border-nawer-success/30 text-nawer-success rounded text-xs"><Download size={12}/> Corrige PDF</button>
            </>
          )}
          <button onClick={onReset} className="flex items-center gap-1 px-2 py-1.5 bg-bg-elevated border border-border rounded text-nawer-text-secondary hover:text-white text-xs">
            <RotateCcw size={12}/> Nouveau
          </button>
        </div>
      </div>

      <div ref={ref} className="bg-bg-surface border border-border rounded-lg p-6 max-h-[70vh] overflow-y-auto content-mono">
        {activeTab === 'exercice' && (
          isStreaming && !parsed ? (
            <pre className="whitespace-pre-wrap text-nawer-text-primary text-sm typewriter-cursor">{rawText}</pre>
          ) : parsed?.exercice ? (
            <ExoDisplay data={parsed.exercice} />
          ) : (
            <div className="space-y-3">{[60,100,80,90].map((w,i)=><div key={i} className="h-3 skeleton rounded" style={{width:`${w}%`}}/>)}</div>
          )
        )}
        {activeTab === 'corrige' && (
          parsed?.corrige ? <CorrigeDisplay data={parsed.corrige} /> :
          <p className="text-nawer-text-muted text-sm text-center py-8">Corrige en cours de generation...</p>
        )}
      </div>
    </div>
  )
}

function ExoDisplay({ data }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-white font-semibold">{data.titre}</h2>
        <p className="text-nawer-text-secondary text-xs mt-1">{data.niveau} · {data.matiere} {data.duree_estimee && `· ${data.duree_estimee}`} {data.bareme_total && `· /${data.bareme_total}pts`}</p>
      </div>
      {data.exercices?.map((ex, i) => (
        <div key={i}>
          <p className="text-white font-medium text-sm mb-2">Exercice {ex.numero}{ex.titre ? ` - ${ex.titre}` : ''} {ex.points && <span className="text-nawer-text-muted">({ex.points}pts)</span>}</p>
          {ex.enonce && <p className="text-nawer-text-secondary text-sm italic mb-2">{ex.enonce}</p>}
          {ex.questions?.map((q, j) => (
            <div key={j} className="flex gap-2 mb-2">
              <span className="text-accent-blue font-medium text-sm min-w-[28px]">{q.num}</span>
              <span className="text-nawer-text-primary text-sm flex-1">{q.texte}</span>
              {q.points && <span className="text-nawer-text-muted text-xs">({q.points}pt)</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function CorrigeDisplay({ data }) {
  return (
    <div className="space-y-6">
      <div className="bg-nawer-success/5 border-b border-nawer-success/30 -mx-6 px-6 -mt-6 pt-4 pb-4 mb-4 rounded-t-lg">
        <span className="text-nawer-success text-xs font-semibold uppercase tracking-wider">CORRIGE - Usage enseignant uniquement</span>
        <h2 className="text-white font-semibold mt-1">{data.titre}</h2>
      </div>
      {data.exercices?.map((ex, i) => (
        <div key={i}>
          <p className="text-white font-medium text-sm mb-3">Exercice {ex.numero}{ex.titre ? ` - ${ex.titre}` : ''}</p>
          {ex.questions?.map((q, j) => (
            <div key={j} className="border border-border rounded mb-3">
              <div className="flex gap-2 p-3 bg-bg-elevated border-b border-border">
                <span className="text-accent-blue font-medium text-sm min-w-[28px]">{q.num}</span>
                <span className="text-nawer-text-secondary text-sm">{q.texte}</span>
              </div>
              {q.correction && (
                <div className="p-3 space-y-1">
                  <p className="text-nawer-success text-sm font-medium">OK {q.correction.solution}</p>
                  {q.correction.etapes?.map((e,k) => <p key={k} className="text-nawer-text-secondary text-xs">{k+1}. {e}</p>)}
                  {q.correction.criteres_correction && <p className="text-accent-blue/80 text-xs">Criteres: {q.correction.criteres_correction}</p>}
                  {q.correction.erreurs_frequentes && <p className="text-nawer-warning/80 text-xs">Attention: {q.correction.erreurs_frequentes}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function formatExo(data) {
  if (!data) return ''
  return data.exercices?.flatMap(ex => ex.questions?.map(q => `${q.num} ${q.texte}`)).join('\n') || ''
}

function formatCorrige(data) {
  if (!data) return ''
  return data.exercices?.flatMap(ex => ex.questions?.map(q => `${q.num} - ${q.correction?.solution}`)).join('\n') || ''
}
