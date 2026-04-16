import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { adminAuth } from '@/lib/firebase/admin'
import { checkGenerationLimit, incrementMonthlyGenerations } from '@/lib/firebase/firestore'
import { buildPrompt } from '@/lib/openai/promptBuilder'
import { getCurricularContext } from '@/lib/curriculum/loader'
import { getRecentEmbeddings } from '@/lib/embeddings/antiRepetition'

export const maxDuration = 30
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
    let decodedToken
    try { decodedToken = await adminAuth.verifyIdToken(authHeader.split('Bearer ')[1]) }
    catch { return NextResponse.json({ error: 'Token invalide' }, { status: 401 }) }
    const userId = decodedToken.uid

    const { niveau, matiere, langue, chapitre, type, structure } = await request.json()
    if (!niveau || !matiere || !langue || !chapitre || !type)
      return NextResponse.json({ error: 'Parametres manquants' }, { status: 400 })

    const limitCheck = await checkGenerationLimit(userId)
    if (!limitCheck.allowed) return NextResponse.json({ error: 'LIMIT_REACHED', message: 'Limite mensuelle atteinte.', remaining: 0 }, { status: 403 })

    const [curricularContext, usedContexts] = await Promise.all([
      getCurricularContext(niveau, matiere, chapitre),
      getRecentEmbeddings(userId, 20),
    ])

    const { systemPrompt, userPrompt } = buildPrompt({ curricularContext, structure: structure || {}, usedContexts, langue, type })

    await incrementMonthlyGenerations(userId)

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      max_tokens:  6000,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
    })

    const text = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ 
      type: 'done', 
      text, 
      userId, 
      remaining: limitCheck.remaining - 1 
    })
  } catch (error) {
    console.error('Generate API error:', error.message)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}