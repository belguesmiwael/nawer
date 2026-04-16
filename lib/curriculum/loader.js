import { getCurriculumChapters } from '@/lib/firebase/firestore'
import { LEVELS } from '@/constants/levels'
import { SUBJECTS_BY_LEVEL_GROUP } from '@/constants/subjects'

const cache = new Map()

export async function getCurricularContext(niveau, matiere, chapitreId) {
  const key = `${niveau}:${matiere}:${chapitreId}`
  if (cache.has(key)) return cache.get(key)

  let chapter = null
  for (const t of ['t1', 't2', 't3']) {
    try {
      const chapters = await getCurriculumChapters(niveau, matiere, t)
      chapter = chapters.find(c => c.id === chapitreId || c.titre_fr === chapitreId)
      if (chapter) break
    } catch {}
  }

  const levelData   = LEVELS.find(l => l.id === niveau)
  const subjectData = Object.values(SUBJECTS_BY_LEVEL_GROUP).flat().find(s => s.id === matiere)

  const context = {
    ...(chapter || { id: chapitreId, titre_fr: chapitreId, objectifs_officiels: [], notions_cles: [], vocabulaire_officiel: [] }),
    niveauLabel:           levelData?.label   || niveau,
    matiereLabel:          subjectData?.label || matiere,
    competences_attendues: chapter?.competences_attendues || `Maîtrise du chapitre ${chapitreId}`,
  }

  cache.set(key, context)
  return context
}
