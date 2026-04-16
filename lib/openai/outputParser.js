export function parseGenerationOutput(rawText) {
  if (!rawText) throw new Error('Contenu vide')

  let jsonText = rawText.trim()
  const firstBrace = jsonText.indexOf('{')
  const lastBrace  = jsonText.lastIndexOf('}')
  if (firstBrace === -1 || lastBrace === -1) throw new Error('JSON invalide')
  jsonText = jsonText.slice(firstBrace, lastBrace + 1)

  let parsed
  try { parsed = JSON.parse(jsonText) }
  catch {
    jsonText = jsonText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
    try { parsed = JSON.parse(jsonText) }
    catch { throw new Error('Impossible de parser le JSON') }
  }

  if (!parsed.exercices?.length) throw new Error('Aucun exercice généré')
  parsed.exercices.forEach((ex, i) => {
    ex.questions?.forEach((q, j) => {
      if (!q.texte)      throw new Error(`Ex${i+1} Q${j+1}: énoncé manquant`)
      if (!q.correction) throw new Error(`Ex${i+1} Q${j+1}: corrigé manquant`)
    })
  })

  return { exercice: extractExercice(parsed), corrige: extractCorrige(parsed), full: parsed }
}

function extractExercice(data) {
  return {
    ...data,
    exercices: data.exercices.map(ex => ({
      ...ex,
      questions: ex.questions.map(({ correction, ...q }) => q),
    })),
  }
}

function extractCorrige(data) {
  return { ...data, titre: `CORRIGÉ — ${data.titre}`, isCorrige: true }
}

export function extractTextForEmbedding(generation) {
  if (!generation?.exercices) return ''
  const parts = [generation.titre || '']
  generation.exercices.forEach(ex => {
    ex.questions?.forEach(q => { if (q.texte) parts.push(q.texte) })
  })
  return parts.join(' ').slice(0, 2000)
}
