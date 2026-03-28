import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
  getDoc,
} from 'firebase/firestore'
import { charactersCollection } from '@/firebase/collections'
import { db } from '@/firebase/config'
import type { Character, CharacterStats } from '@/types'
import { useAuthStore } from '@/stores/auth'

export function useCharacter() {
  const authStore = useAuthStore()

  async function getMyCharacters(): Promise<Character[]> {
    if (!authStore.userId) return []
    const q = query(
      charactersCollection,
      where('userId', '==', authStore.userId),
      orderBy('createdAt', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }))
  }

  async function getAllCharacters(): Promise<Character[]> {
    const q = query(charactersCollection, orderBy('name'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }))
  }

  async function getCharacter(id: string): Promise<Character | null> {
    const snap = await getDoc(doc(db, 'characters', id))
    if (!snap.exists()) return null
    return { ...snap.data(), id: snap.id } as Character
  }

  async function createCharacter(data: {
    name: string
    rasse: string
    klasse: string
    hintergrund: string
    stats: CharacterStats
    imageUrl: string | null
  }) {
    if (!authStore.userId) throw new Error('Nicht eingeloggt')
    return addDoc(charactersCollection, {
      ...data,
      userId: authStore.userId,
      level: 1,
      xp: 0,
      xpNextLevel: 300,
      sessionCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as unknown as Character)
  }

  async function updateCharacter(id: string, data: Partial<Character>) {
    const ref = doc(db, 'characters', id)
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  }

  async function deleteCharacter(id: string) {
    await deleteDoc(doc(db, 'characters', id))
  }

  return { getMyCharacters, getAllCharacters, getCharacter, createCharacter, updateCharacter, deleteCharacter }
}
