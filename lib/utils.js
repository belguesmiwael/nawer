import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : date.toDate?.()
  if (!d) return ''
  const diff  = Date.now() - d.getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Maintenant'
  if (mins < 60)  return `Il y a ${mins}min`
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${days}j`
}
