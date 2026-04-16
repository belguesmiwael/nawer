export const LEVELS = [
  { id: 'primaire_1', label: '1ère Primaire',      group: 'Primaire', shortLabel: '1P' },
  { id: 'primaire_2', label: '2ème Primaire',      group: 'Primaire', shortLabel: '2P' },
  { id: 'primaire_3', label: '3ème Primaire',      group: 'Primaire', shortLabel: '3P' },
  { id: 'primaire_4', label: '4ème Primaire',      group: 'Primaire', shortLabel: '4P' },
  { id: 'primaire_5', label: '5ème Primaire',      group: 'Primaire', shortLabel: '5P' },
  { id: 'primaire_6', label: '6ème Primaire',      group: 'Primaire', shortLabel: '6P' },
  { id: 'college_7',  label: '7ème (Collège)',     group: 'Collège',  shortLabel: '7C' },
  { id: 'college_8',  label: '8ème (Collège)',     group: 'Collège',  shortLabel: '8C' },
  { id: 'college_9',  label: '9ème (Collège)',     group: 'Collège',  shortLabel: '9C' },
  { id: 'lycee_1',    label: '1ère Lycée',         group: 'Lycée',    shortLabel: '1L' },
  { id: 'lycee_2',    label: '2ème Lycée',         group: 'Lycée',    shortLabel: '2L' },
  { id: 'bac_sciences',  label: '3ème Bac Sciences',  group: 'Bac', shortLabel: 'Bac Sc'  },
  { id: 'bac_maths',     label: '3ème Bac Maths',     group: 'Bac', shortLabel: 'Bac M'   },
  { id: 'bac_lettres',   label: '3ème Bac Lettres',   group: 'Bac', shortLabel: 'Bac L'   },
  { id: 'bac_economie',  label: '3ème Bac Économie',  group: 'Bac', shortLabel: 'Bac Éco' },
  { id: 'bac_technique', label: '3ème Bac Technique', group: 'Bac', shortLabel: 'Bac T'   },
  { id: 'bac_info',      label: '3ème Bac Info',      group: 'Bac', shortLabel: 'Bac Info' },
]

export const LEVEL_GROUPS = [
  { id: 'Primaire', label: 'Primaire (1-6)', icon: '🏫' },
  { id: 'Collège',  label: 'Collège (7-9)',  icon: '📚' },
  { id: 'Lycée',    label: 'Lycée',          icon: '🎓' },
  { id: 'Bac',      label: 'Baccalauréat',   icon: '🏆' },
]

export function getLevelsByGroup(groupId) {
  return LEVELS.filter(l => l.group === groupId)
}

export function getLevelById(id) {
  return LEVELS.find(l => l.id === id)
}
