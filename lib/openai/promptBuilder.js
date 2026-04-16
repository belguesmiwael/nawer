const LANGUE_CONFIG = {
  ar: { instruction: 'Redige TOUT en arabe litteraire standard (Fusha). Prenoms tunisiens : Ahmed, Fatma, Youssef, Mariem, Khaled.' },
  fr: { instruction: 'Redige TOUT en francais academique. Prenoms tunisiens dans les problemes. Contextes tunisiens (prix en dinars, villes tunisiennes).' },
  en: { instruction: 'Write ALL content in academic English. Use Tunisian first names. Contexts should reflect Tunisian reality.' },
}

const TYPE_LABELS = {
  exercice: 'EXERCICE',
  devoir:   'DEVOIR MAISON',
  serie:    "SERIE D'EXERCICES",
  controle: 'CONTROLE',
  qcm:      'QCM',
  probleme: 'PROBLEME OUVERT',
}

export function buildPrompt({ curricularContext, structure, usedContexts, langue, type }) {
  const langConfig = LANGUE_CONFIG[langue] || LANGUE_CONFIG.fr
  const typeLabel  = TYPE_LABELS[type] || type.toUpperCase()

  const systemPrompt = `Tu es un expert pedagogue du systeme educatif tunisien (MEN Tunisie).
MISSION : Generer un ${typeLabel} complet avec CORRIGE DETAILLE INTEGRE.
REGLES : ${langConfig.instruction} | Contenu original | JSON uniquement | Chaque question doit avoir son champ "correction".
FORMAT : JSON brut, aucun markdown, aucun texte autour.`

  const curricSection = curricularContext ? `
CONTEXTE MEN TUNISIE :
Niveau: ${curricularContext.niveauLabel} | Matiere: ${curricularContext.matiereLabel} | Chapitre: ${curricularContext.titre_fr || curricularContext.titre_ar}
Objectifs: ${(curricularContext.objectifs_officiels || []).join(' / ')}
Notions: ${(curricularContext.notions_cles || []).join(', ')}
` : ''

  const antiRep = usedContexts?.length > 0 ? `
NE PAS REPETER ces contextes : ${usedContexts.slice(0, 3).join(' | ')}
` : ''

  const defaults = {
    exercice: { n: 4,  d: 'moyen',      b: 10, t: '30min' },
    devoir:   { n: 6,  d: 'moyen',      b: 20, t: '1h-2h' },
    serie:    { n: 10, d: 'progressif', b: 20, t: '2h'    },
    controle: { n: 8,  d: 'moyen',      b: 20, t: '1h'    },
    qcm:      { n: 15, d: 'moyen',      b: 15, t: '30min' },
    probleme: { n: 5,  d: 'difficile',  b: 20, t: '1h30'  },
  }[type] || { n: 4, d: 'moyen', b: 10, t: '30min' }

  const userPrompt = `${curricSection}${antiRep}
STRUCTURE : Type=${typeLabel} | Questions=${structure.nbQuestions || defaults.n} | Difficulte=${structure.difficulte || defaults.d} | Bareme=${structure.baremeTotal || defaults.b}pts | Duree=${structure.dureeEstimee || defaults.t}

JSON SCHEMA :
{"titre":"str","niveau":"str","matiere":"str","langue":"${langue}","type":"${type}","duree_estimee":"str","bareme_total":0,"exercices":[{"numero":0,"titre":"str","points":0,"difficulte":"facile|moyen|difficile","enonce":"str","questions":[{"num":"str","texte":"str","points":0,"correction":{"solution":"str","etapes":["str"],"criteres_correction":"str","erreurs_frequentes":"str"}}]}]}

Genere le ${typeLabel} complet. JSON brut UNIQUEMENT.`

  return { systemPrompt, userPrompt }
}
