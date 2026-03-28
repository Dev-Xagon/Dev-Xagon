import {
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  increment,
  Timestamp,
} from 'firebase/firestore'
import { sessionsCollection } from '@/firebase/collections'
import { db } from '@/firebase/config'
import type { Session } from '@/types'
import { useAuthStore } from '@/stores/auth'

export function useSessions() {
  const authStore = useAuthStore()

  async function getSessions(): Promise<Session[]> {
    const q = query(sessionsCollection, orderBy('datum', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }))
  }

  async function createSession(data: {
    titel: string
    datum: Date
    notizen: string
    teilnehmerIds: string[]
  }) {
    if (!authStore.userId) throw new Error('Nicht eingeloggt')

    const session = await addDoc(sessionsCollection, {
      titel: data.titel,
      datum: Timestamp.fromDate(data.datum),
      notizen: data.notizen,
      teilnehmerIds: data.teilnehmerIds,
      erstelltVon: authStore.userId,
      createdAt: serverTimestamp(),
    } as unknown as Session)

    // Update session count on each participating character
    for (const charId of data.teilnehmerIds) {
      await updateDoc(doc(db, 'characters', charId), {
        sessionCount: increment(1),
      })
    }

    return session
  }

  return { getSessions, createSession }
}
