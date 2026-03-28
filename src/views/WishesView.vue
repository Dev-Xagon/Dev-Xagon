<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWishes } from '@/composables/useWishes'
import { useCharacter } from '@/composables/useCharacter'
import type { Wish, Character } from '@/types'

const { getMyWishes, addWish } = useWishes()
const { getMyCharacters } = useCharacter()

const wishes = ref<Wish[]>([])
const characters = ref<Character[]>([])
const loading = ref(true)

const newWish = ref('')
const selectedCharacter = ref<string | null>(null)
const submitting = ref(false)

onMounted(async () => {
  try {
    ;[wishes.value, characters.value] = await Promise.all([
      getMyWishes(),
      getMyCharacters(),
    ])
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!newWish.value.trim()) return
  submitting.value = true
  try {
    await addWish(newWish.value, selectedCharacter.value)
    newWish.value = ''
    selectedCharacter.value = null
    wishes.value = await getMyWishes()
  } finally {
    submitting.value = false
  }
}

const statusBadge: Record<Wish['status'], string> = {
  offen: 'badge-warning',
  notiert: 'badge-info',
  erledigt: 'badge-success',
}

const statusLabel: Record<Wish['status'], string> = {
  offen: 'Offen',
  notiert: 'Notiert',
  erledigt: 'Erledigt',
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="page-title">Wünsche an den Spielleiter</h1>

    <!-- New Wish Form -->
    <form @submit.prevent="handleSubmit" class="card-fantasy mb-8">
      <div class="card-body space-y-3">
        <h2 class="font-medieval text-xl text-primary">Neuer Wunsch</h2>
        <textarea
          v-model="newWish"
          class="textarea textarea-bordered bg-base-300 w-full h-24"
          placeholder="Was wünschst du dir vom Spielleiter? (z.B. bestimmte Storylines, Items, Regelanpassungen...)"
          required
        ></textarea>
        <div class="flex gap-3 items-end">
          <div class="form-control flex-1">
            <label class="label"><span class="label-text text-sm">Für Charakter (optional)</span></label>
            <select v-model="selectedCharacter" class="select select-bordered select-sm bg-base-300 w-full">
              <option :value="null">Allgemein</option>
              <option v-for="c in characters" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="submitting">
            <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
            Absenden
          </button>
        </div>
      </div>
    </form>

    <!-- Wish List -->
    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="wishes.length === 0" class="text-center py-8 text-base-content/50">
      <p class="text-4xl mb-2">&#10024;</p>
      <p>Du hast noch keine Wünsche eingereicht.</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="wish in wishes" :key="wish.id" class="card-fantasy">
        <div class="card-body py-4">
          <div class="flex items-start justify-between gap-3">
            <p class="flex-1">{{ wish.text }}</p>
            <span class="badge" :class="statusBadge[wish.status]">{{ statusLabel[wish.status] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
