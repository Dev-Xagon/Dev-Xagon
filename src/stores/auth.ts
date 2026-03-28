import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const firebaseUser = ref<FirebaseUser | null>(null)
  const userProfile = ref<User | null>(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!firebaseUser.value)
  const isSpielleiter = computed(() => userProfile.value?.role === 'spielleiter')
  const userId = computed(() => firebaseUser.value?.uid ?? null)

  function init() {
    onAuthStateChanged(auth, async (user) => {
      firebaseUser.value = user
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid))
        userProfile.value = snap.exists() ? (snap.data() as User) : null
      } else {
        userProfile.value = null
      }
      loading.value = false
    })
  }

  return { firebaseUser, userProfile, loading, isLoggedIn, isSpielleiter, userId, init }
})
