<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCharacter } from '@/composables/useCharacter'
import CharacterCard from '@/components/character/CharacterCard.vue'
import type { Character } from '@/types'

const { getMyCharacters } = useCharacter()
const characters = ref<Character[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    characters.value = await getMyCharacters()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="page-title mb-0">Meine Abenteurer</h1>
      <RouterLink to="/charakter/neu" class="btn btn-primary font-medieval">
        + Neuer Charakter
      </RouterLink>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="characters.length === 0" class="text-center py-16">
      <p class="text-6xl mb-4">&#9876;</p>
      <h2 class="text-2xl font-medieval text-primary mb-2">Keine Abenteurer gefunden</h2>
      <p class="text-base-content/60 mb-6">Erstelle deinen ersten Charakter und beginne dein Abenteuer!</p>
      <RouterLink to="/charakter/neu" class="btn btn-primary font-medieval">
        Charakter erstellen
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CharacterCard
        v-for="char in characters"
        :key="char.id"
        :character="char"
      />
    </div>
  </div>
</template>
