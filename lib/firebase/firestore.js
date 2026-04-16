import { collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, increment } from 'firebase/firestore'
import { db } from './client'

export async function getUser(userId) {
  const snap = await getDoc(doc(db, 'users', userId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateUser(userId, data) {
  await updateDoc(doc(db, 'users', userId), { ...data, lastActiveAt: serverTimestamp() })
}

export async function completeOnboarding(userId, { mainLevel, mainSubjects }) {
  await updateDoc(doc(db, 'users', userId), {
    onboardingCompleted: true, mainLevel, mainSubjects, lastActiveAt: serverTimestamp(),
  })
}

export async function createGeneration(data) {
  const ref = await addDoc(collection(db, 'generations'), {
    ...data, isFavorite: false, tags: [],
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getGeneration(generationId) {
  const snap = await getDoc(doc(db, 'generations', generationId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getUserGenerations(userId, filters = {}) {
  let q = query(
    collection(db, 'generations'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(filters.limit || 50)
  )
  if (filters.matiere)    q = query(q, where('matiere', '==', filters.matiere))
  if (filters.type)       q = query(q, where('type', '==', filters.type))
  if (filters.isFavorite) q = query(q, where('isFavorite', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateGeneration(generationId, data) {
  await updateDoc(doc(db, 'generations', generationId), { ...data, updatedAt: serverTimestamp() })
}

export async function toggleFavorite(generationId, isFavorite) {
  await updateDoc(doc(db, 'generations', generationId), { isFavorite })
}

export async function deleteGeneration(generationId) {
  await deleteDoc(doc(db, 'generations', generationId))
}

export async function incrementMonthlyGenerations(userId) {
  await updateDoc(doc(db, 'users', userId), { monthlyGenerations: increment(1) })
}

export async function checkGenerationLimit(userId) {
  const user = await getUser(userId)
  if (!user) throw new Error('User not found')
  if (user.plan !== 'free') return { allowed: true }
  const now = new Date()
  const resetAt = user.monthlyGenerationsResetAt?.toDate()
  const sameMonth = resetAt && resetAt.getMonth() === now.getMonth() && resetAt.getFullYear() === now.getFullYear()
  const count = sameMonth ? user.monthlyGenerations : 0
  if (!sameMonth) {
    await updateDoc(doc(db, 'users', userId), { monthlyGenerations: 0, monthlyGenerationsResetAt: serverTimestamp() })
  }
  return { allowed: count < 5, remaining: Math.max(0, 5 - count), count }
}

export async function getCurriculumChapters(niveau, matiere, trimestre) {
  const path = `curriculum/tunisie/${niveau}/${matiere}/${trimestre}/chapitres`
  const snap = await getDocs(collection(db, path))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
