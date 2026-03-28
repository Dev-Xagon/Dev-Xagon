import type { Timestamp } from 'firebase/firestore'

export interface User {
  uid: string
  displayName: string
  email: string
  role: 'spieler' | 'spielleiter'
  createdAt: Timestamp
}

export interface CharacterStats {
  staerke: number
  geschicklichkeit: number
  konstitution: number
  intelligenz: number
  weisheit: number
  charisma: number
}

export interface Character {
  id: string
  userId: string
  name: string
  rasse: string
  klasse: string
  level: number
  xp: number
  xpNextLevel: number
  imageUrl: string | null
  hintergrund: string
  stats: CharacterStats
  sessionCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface InventoryItem {
  id: string
  characterId: string
  name: string
  beschreibung: string
  anzahl: number
  kategorie: 'waffe' | 'ruestung' | 'trank' | 'sonstiges' | 'quest'
  createdAt: Timestamp
}

export interface Session {
  id: string
  titel: string
  datum: Timestamp
  notizen: string
  teilnehmerIds: string[]
  erstelltVon: string
  createdAt: Timestamp
}

export interface Wish {
  id: string
  userId: string
  characterId: string | null
  text: string
  status: 'offen' | 'notiert' | 'erledigt'
  createdAt: Timestamp
}

export const RASSEN = [
  'Mensch', 'Elf', 'Zwerg', 'Halbling', 'Gnom', 'Halb-Elf',
  'Halb-Ork', 'Tiefling', 'Drachenblütiger', 'Aasimar',
] as const

export const KLASSEN = [
  'Barbar', 'Barde', 'Druide', 'Hexenmeister', 'Kämpfer',
  'Kleriker', 'Magier', 'Mönch', 'Paladin', 'Schurke',
  'Waldläufer', 'Zauberer',
] as const

export const KATEGORIEN: Record<InventoryItem['kategorie'], string> = {
  waffe: 'Waffe',
  ruestung: 'Rüstung',
  trank: 'Trank',
  sonstiges: 'Sonstiges',
  quest: 'Quest-Gegenstand',
}

export const XP_TABELLE: Record<number, number> = {
  1: 0, 2: 300, 3: 900, 4: 2700, 5: 6500,
  6: 14000, 7: 23000, 8: 34000, 9: 48000, 10: 64000,
  11: 85000, 12: 100000, 13: 120000, 14: 140000, 15: 165000,
  16: 195000, 17: 225000, 18: 265000, 19: 305000, 20: 355000,
}
