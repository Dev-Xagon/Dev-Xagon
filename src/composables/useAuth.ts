import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import type { User } from '@/types'

const googleProvider = new GoogleAuthProvider()

export function useAuth() {
  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email: string, password: string, displayName: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    const userData: Omit<User, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
      uid: cred.user.uid,
      displayName,
      email,
      role: 'spieler',
      createdAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), userData)
    return cred
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider)
    const userData: Omit<User, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
      uid: cred.user.uid,
      displayName: cred.user.displayName ?? 'Abenteurer',
      email: cred.user.email ?? '',
      role: 'spieler',
      createdAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), userData, { merge: true })
    return cred
  }

  async function logout() {
    return signOut(auth)
  }

  return { login, register, loginWithGoogle, logout }
}
