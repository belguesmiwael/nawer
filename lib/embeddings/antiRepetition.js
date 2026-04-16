import OpenAI from 'openai'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function getRecentEmbeddings(userId, limitCount = 20) {
  try {
    const q = query(
      collection(db, 'generations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data().contentText).filter(Boolean).slice(0, 5)
  } catch { return [] }
}

export async function generateEmbedding(text) {
  try {
    const res = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 2000),
    })
    return res.data[0].embedding
  } catch { return null }
}
