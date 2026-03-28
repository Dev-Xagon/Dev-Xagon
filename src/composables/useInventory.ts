import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore'
import { inventoryCollection } from '@/firebase/collections'
import { db } from '@/firebase/config'
import type { InventoryItem } from '@/types'

export function useInventory(characterId: string) {
  const colRef = inventoryCollection(characterId)

  async function getItems(): Promise<InventoryItem[]> {
    const q = query(colRef, orderBy('name'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id, characterId }))
  }

  async function addItem(data: { name: string; beschreibung: string; anzahl: number; kategorie: InventoryItem['kategorie'] }) {
    return addDoc(colRef, {
      ...data,
      characterId,
      createdAt: serverTimestamp(),
    } as unknown as InventoryItem)
  }

  async function updateItem(itemId: string, data: Partial<InventoryItem>) {
    const ref = doc(db, 'characters', characterId, 'inventory', itemId)
    await updateDoc(ref, data)
  }

  async function deleteItem(itemId: string) {
    await deleteDoc(doc(db, 'characters', characterId, 'inventory', itemId))
  }

  return { getItems, addItem, updateItem, deleteItem }
}
