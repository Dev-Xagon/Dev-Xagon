<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSessions } from '@/composables/useSessions'
import { useCharacter } from '@/composables/useCharacter'
import { useAuthStore } from '@/stores/auth'
import SessionForm from '@/components/session/SessionForm.vue'
import type { Session, Character } from '@/types'

const authStore = useAuthStore()
const { getSessions } = useSessions()
const { getAllCharacters } = useCharacter()

const sessions = ref<Session[]>([])
const allCharacters = ref<Character[]>([])
const loading = ref(true)
const showForm = ref(false)

onMounted(async () => {
  try {
    ;[sessions.value, allCharacters.value] = await Promise.all([
      getSessions(),
      getAllCharacters(),
    ])
  } finally {
    loading.value = false
  }
})

function getCharacterName(id: string): string {
  return allCharacters.value.find((c) => c.id === id)?.name ?? 'Unbekannt'
}

function formatDate(datum: { toDate?: () => Date }): string {
  if (!datum?.toDate) return ''
  return datum.toDate().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

async function onCreated() {
  showForm.value = false
  sessions.value = await getSessions()
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="page-title mb-0">Sitzungen</h1>
      <button
        v-if="authStore.isSpielleiter"
        @click="showForm = !showForm"
        class="btn btn-primary btn-sm font-medieval"
      >
        + Neue Sitzung
      </button>
    </div>

    <SessionForm
      v-if="showForm"
      :characters="allCharacters"
      class="mb-8"
      @created="onCreated"
      @cancel="showForm = false"
    />

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="sessions.length === 0" class="text-center py-8 text-base-content/50">
      <p class="text-4xl mb-2">&#128214;</p>
      <p>Noch keine Sitzungen eingetragen.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="session in sessions" :key="session.id" class="card-fantasy">
        <div class="card-body py-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-medieval text-lg text-primary">{{ session.titel }}</h3>
              <p class="text-sm text-base-content/60">{{ formatDate(session.datum) }}</p>
            </div>
            <div class="badge badge-outline">{{ session.teilnehmerIds.length }} Teilnehmer</div>
          </div>

          <div class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="tid in session.teilnehmerIds"
              :key="tid"
              class="badge badge-sm badge-primary badge-outline"
            >
              {{ getCharacterName(tid) }}
            </span>
          </div>

          <p v-if="session.notizen" class="text-sm text-base-content/60 mt-2">
            {{ session.notizen }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
