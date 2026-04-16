export const SUBJECTS_BY_LEVEL_GROUP = {
  Primaire: [
    { id: 'mathematiques', label: 'Mathématiques',      icon: '🔢', langs: ['ar', 'fr'] },
    { id: 'arabe',         label: 'Arabe',              icon: '📝', langs: ['ar']       },
    { id: 'francais',      label: 'Français',           icon: '🇫🇷', langs: ['fr']       },
    { id: 'eveil',         label: 'Éveil Scientifique', icon: '🔬', langs: ['ar', 'fr'] },
  ],
  Collège: [
    { id: 'mathematiques', label: 'Mathématiques',   icon: '🔢', langs: ['ar', 'fr'] },
    { id: 'arabe',         label: 'Arabe',           icon: '📝', langs: ['ar']       },
    { id: 'francais',      label: 'Français',        icon: '🇫🇷', langs: ['fr']       },
    { id: 'anglais',       label: 'Anglais',         icon: '🇬🇧', langs: ['en']       },
    { id: 'sciences',      label: 'Sciences',        icon: '🧬', langs: ['fr', 'ar'] },
    { id: 'physique',      label: 'Physique-Chimie', icon: '⚗️',  langs: ['fr', 'ar'] },
    { id: 'histoire_geo',  label: 'Histoire-Géo',    icon: '🌍', langs: ['ar', 'fr'] },
    { id: 'informatique',  label: 'Informatique',    icon: '💻', langs: ['fr', 'ar'] },
  ],
  Lycée: [
    { id: 'mathematiques', label: 'Mathématiques',   icon: '🔢', langs: ['fr', 'ar'] },
    { id: 'physique',      label: 'Physique-Chimie', icon: '⚗️',  langs: ['fr', 'ar'] },
    { id: 'svt',           label: 'SVT',             icon: '🧬', langs: ['fr', 'ar'] },
    { id: 'arabe',         label: 'Arabe',           icon: '📝', langs: ['ar']       },
    { id: 'francais',      label: 'Français',        icon: '🇫🇷', langs: ['fr']       },
    { id: 'anglais',       label: 'Anglais',         icon: '🇬🇧', langs: ['en']       },
    { id: 'philosophie',   label: 'Philosophie',     icon: '🤔', langs: ['ar', 'fr'] },
    { id: 'informatique',  label: 'Informatique',    icon: '💻', langs: ['fr', 'ar'] },
  ],
  Bac: [
    { id: 'mathematiques', label: 'Mathématiques',   icon: '🔢', langs: ['fr', 'ar'] },
    { id: 'physique',      label: 'Physique-Chimie', icon: '⚗️',  langs: ['fr', 'ar'] },
    { id: 'svt',           label: 'SVT',             icon: '🧬', langs: ['fr', 'ar'] },
    { id: 'arabe',         label: 'Arabe',           icon: '📝', langs: ['ar']       },
    { id: 'francais',      label: 'Français',        icon: '🇫🇷', langs: ['fr']       },
    { id: 'anglais',       label: 'Anglais',         icon: '🇬🇧', langs: ['en']       },
    { id: 'histoire_geo',  label: 'Histoire-Géo',    icon: '🌍', langs: ['ar', 'fr'] },
    { id: 'philosophie',   label: 'Philosophie',     icon: '🤔', langs: ['ar', 'fr'] },
    { id: 'informatique',  label: 'Informatique',    icon: '💻', langs: ['fr', 'ar'] },
    { id: 'economie',      label: 'Économie',        icon: '📊', langs: ['ar', 'fr'] },
  ],
}

export const LANGUAGES = [
  { id: 'ar', label: 'Arabe',    flag: '🇹🇳' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'en', label: 'Anglais',  flag: '🇬🇧' },
]

export function getSubjectsForLevelGroup(groupId) {
  return SUBJECTS_BY_LEVEL_GROUP[groupId] || []
}
