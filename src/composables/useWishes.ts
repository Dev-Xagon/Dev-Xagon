import {
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore'
import { wishesCollection } from '@/firebase/collections'
import { db } from '@/firebase/config'
import type { Wish } from '@/types'
import { useAuthStore } from '@/stores/auth'

export function useWishes() {
  const authStore = useAuthStore()

  async function getMyWishes(): Promise<Wish[]> {
    if (!authStore.userId) return []
    const q = query(
      wishesCollection,
      where('userId', '==', authStore.userId),
      orderBy('createdAt', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }))
  }

  async function getAllWishes(): Promise<Wish[]> {
    const q = query(wishesCollection, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }))
  }

  async function addWish(text: string, characterId: string | null = null) {
    if (!authStore.userId) throw new Error('Nicht eingeloggt')
    return addDoc(wishesCollection, {
      userId: authStore.userId,
      characterId,
      text,
      status: 'offen',
      createdAt: serverTimestamp(),
    } as unknown as Wish)
  }

  async function updateWishStatus(wishId: string, status: Wish['status']) {
    await updateDoc(doc(db, 'wishes', wishId), { status })
  }

  return { getMyWishes, getAllWishes, addWish, updateWishStatus }
}
