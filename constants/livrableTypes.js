export const LIVRABLE_TYPES = [
  { id: 'exercice', label: 'Exercice',        icon: '✏️', description: 'Exercice ciblé',       defaultDuration: '30min', defaultPoints: 10 },
  { id: 'devoir',   label: 'Devoir Maison',   icon: '🏠', description: 'Devoir à rendre',       defaultDuration: '1h-2h', defaultPoints: 20 },
  { id: 'serie',    label: 'Série',           icon: '📋', description: 'Série progressive',     defaultDuration: '2h',    defaultPoints: 20 },
  { id: 'controle', label: 'Contrôle',        icon: '📝', description: 'Contrôle en classe',    defaultDuration: '1h',    defaultPoints: 20 },
  { id: 'qcm',      label: 'QCM',             icon: '☑️', description: 'Choix multiple',        defaultDuration: '30min', defaultPoints: 20 },
  { id: 'probleme', label: 'Problème Ouvert', icon: '🧩', description: 'Réflexion approfondie', defaultDuration: '1h30',  defaultPoints: 20 },
]
