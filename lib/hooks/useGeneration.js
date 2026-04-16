'use client'
import { useState, useCallback } from 'react'
import { parseGenerationOutput, extractTextForEmbedding } from '@/lib/openai/outputParser'
import { createGeneration } from '@/lib/firebase/firestore'
import { generateEmbedding } from '@/lib/embeddings/antiRepetition'
import { auth } from '@/lib/firebase/client'

export function useGeneration() {
  const [status,       setStatus]       = useState('idle')
  const [rawText,      setRawText]      = useState('')
  const [parsed,       setParsed]       = useState(null)
  const [generationId, setGenerationId] = useState(null)
  const [error,        setError]        = useState(null)
  const [activeTab,    setActiveTab]    = useState('exercice')

  const generate = useCallback(async (params) => {
    setStatus('loading'); setRawText(''); setParsed(null); setError(null); setActiveTab('exercice')

    try {
      const idToken = await auth.currentUser?.getIdToken()
      if (!idToken) throw new Error('Non connecté')

      const response = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body:    JSON.stringify(params),
      })

      if (!response.ok) {
        const err = await response.json()
        setError({ type: err.error === 'LIMIT_REACHED' ? 'limit' : 'api', message: err.message || err.error })
        setStatus('error'); return
      }

      const data = await response.json()
      
      if (data.type === 'done') {
        setRawText(data.text)
        try {
          const result = parseGenerationOutput(data.text)
          setParsed(result); setStatus('success')
          saveGeneration(params, result, data.userId).then(id => { if (id) setGenerationId(id) })
        } catch {
          setError({ type: 'parse', message: 'Format inattendu. Régénérer.' }); setStatus('error')
        }
      }
    } catch (err) {
      setError({ type: 'network', message: 'Problème de connexion.' }); setStatus('error')
    }
  }, [])

  const reset  = useCallback(() => { setStatus('idle'); setRawText(''); setParsed(null); setError(null); setGenerationId(null) }, [])

  return {
    generate, reset, status, rawText, parsed, generationId, error, activeTab, setActiveTab,
    isLoading:   status === 'loading',
    isStreaming: status === 'streaming',
    isSuccess:   status === 'success',
    isError:     status === 'error',
  }
}

async function saveGeneration(params, result, userId) {
  try {
    const contentText = extractTextForEmbedding(result.full)
    const embedding   = await generateEmbedding(contentText)
    return await createGeneration({
      userId,
      niveau:   params.niveau,
      matiere:  params.matiere,
      langue:   params.langue,
      chapitre: params.chapitre,
      type:     params.type,
      structure: params.structure || {},
      content:           result.exercice,
      correctionContent: result.corrige,
      contentText,
      embedding:         embedding || [],
      pdfUrl:            null,
      correctionPdfUrl:  null,
      curriculumVersion: '2024',
    })
  } catch (err) { console.error('Save error:', err.message); return null }
}