import { collection, doc, type CollectionReference } from 'firebase/firestore'
import { db } from './config'
import type { User, Character, InventoryItem, Session, Wish } from '@/types'

export const usersCollection = collection(db, 'users') as CollectionReference<User>
export const charactersCollection = collection(db, 'characters') as CollectionReference<Character>
export const sessionsCollection = collection(db, 'sessions') as CollectionReference<Session>
export const wishesCollection = collection(db, 'wishes') as CollectionReference<Wish>

export function inventoryCollection(characterId: string) {
  return collection(doc(db, 'characters', characterId), 'inventory') as CollectionReference<InventoryItem>
}
