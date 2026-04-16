import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from './client'

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  await createOrUpdateUser(result.user)
  return result.user
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function registerWithEmail(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await createOrUpdateUser({ ...result.user, displayName })
  return result.user
}

export async function logout() {
  await signOut(auth)
}

export async function createOrUpdateUser(user) {
  const userRef = doc(db, 'users', user.uid)
  const snap    = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, {
      email:                     user.email,
      displayName:               user.displayName || '',
      plan:                      'free',
      planExpiresAt:             null,
      schoolId:                  null,
      onboardingCompleted:       false,
      mainLevel:                 null,
      mainSubjects:              [],
      monthlyGenerations:        0,
      monthlyGenerationsResetAt: serverTimestamp(),
      firstGenerationDone:       false,
      createdAt:                 serverTimestamp(),
      lastActiveAt:              serverTimestamp(),
    })
  } else {
    await setDoc(userRef, { lastActiveAt: serverTimestamp() }, { merge: true })
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}
