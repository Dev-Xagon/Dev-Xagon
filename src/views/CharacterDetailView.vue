<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCharacter } from '@/composables/useCharacter'
import { useInventory } from '@/composables/useInventory'
import CharacterSheet from '@/components/character/CharacterSheet.vue'
import InventoryList from '@/components/inventory/InventoryList.vue'
import type { Character, InventoryItem } from '@/types'

const route = useRoute()
const router = useRouter()
const characterId = route.params.id as string

const { getCharacter, deleteCharacter } = useCharacter()
const { getItems } = useInventory(characterId)

const character = ref<Character | null>(null)
const items = ref<InventoryItem[]>([])
const loading = ref(true)
const activeTab = ref<'info' | 'inventar'>('info')

onMounted(async () => {
  try {
    character.value = await getCharacter(characterId)
    if (!character.value) {
      router.push({ name: 'Dashboard' })
      return
    }
    items.value = await getItems()
  } finally {
    loading.value = false
  }
})

async function handleDelete() {
  if (!confirm('Charakter wirklich löschen? Das kann nicht rückgängig gemacht werden.')) return
  await deleteCharacter(characterId)
  router.push({ name: 'Dashboard' })
}

async function refreshInventory() {
  items.value = await getItems()
}
</script>

<template>
  <div v-if="loading" class="flex justify-center py-16">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <div v-else-if="character" class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <RouterLink to="/" class="btn btn-ghost btn-sm">&#8592; Zurück</RouterLink>
      <button @click="handleDelete" class="btn btn-error btn-sm btn-outline">Löschen</button>
    </div>

    <!-- Tabs -->
    <div class="tabs tabs-boxed bg-base-200">
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'info' }"
        @click="activeTab = 'info'"
      >
        Charakterbogen
      </button>
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'inventar' }"
        @click="activeTab = 'inventar'"
      >
        Inventar ({{ items.length }})
      </button>
    </div>

    <CharacterSheet v-if="activeTab === 'info'" :character="character" />
    <InventoryList
      v-else
      :character-id="characterId"
      :items="items"
      @updated="refreshInventory"
    />
  </div>
</template>
