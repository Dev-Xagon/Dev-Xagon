<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWishes } from '@/composables/useWishes'
import { useCharacter } from '@/composables/useCharacter'
import type { Wish, Character } from '@/types'

const { getAllWishes, updateWishStatus } = useWishes()
const { getAllCharacters } = useCharacter()

const wishes = ref<Wish[]>([])
const characters = ref<Character[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    ;[wishes.value, characters.value] = await Promise.all([
      getAllWishes(),
      getAllCharacters(),
    ])
  } finally {
    loading.value = false
  }
})

function getCharacterName(id: string | null): string {
  if (!id) return 'Allgemein'
  return characters.value.find((c) => c.id === id)?.name ?? 'Unbekannt'
}

async function cycleStatus(wish: Wish) {
  const next: Record<Wish['status'], Wish['status']> = {
    offen: 'notiert',
    notiert: 'erledigt',
    erledigt: 'offen',
  }
  const newStatus = next[wish.status]
  await updateWishStatus(wish.id, newStatus)
  wish.status = newStatus
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
  <div class="max-w-3xl mx-auto">
    <h1 class="page-title">&#128081; Spielleiter-Bereich</h1>

    <section>
      <h2 class="font-medieval text-2xl text-primary mb-4">Spieler-Wünsche</h2>

      <div v-if="loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="wishes.length === 0" class="text-center py-8 text-base-content/50">
        <p>Keine Wünsche vorhanden.</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="wish in wishes" :key="wish.id" class="card-fantasy">
          <div class="card-body py-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <p>{{ wish.text }}</p>
                <p class="text-xs text-base-content/50 mt-1">
                  Charakter: {{ getCharacterName(wish.characterId) }}
                </p>
              </div>
              <button
                class="badge cursor-pointer"
                :class="statusBadge[wish.status]"
                @click="cycleStatus(wish)"
                title="Klicken um Status zu ändern"
              >
                {{ statusLabel[wish.status] }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="font-medieval text-2xl text-primary mb-4">Alle Charaktere</h2>
      <div v-if="characters.length === 0" class="text-center py-8 text-base-content/50">
        <p>Keine Charaktere vorhanden.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rasse</th>
              <th>Klasse</th>
              <th>Level</th>
              <th>Sitzungen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="char in characters" :key="char.id">
              <td class="font-semibold">
                <RouterLink :to="`/charakter/${char.id}`" class="link link-primary">
                  {{ char.name }}
                </RouterLink>
              </td>
              <td>{{ char.rasse }}</td>
              <td>{{ char.klasse }}</td>
              <td>{{ char.level }}</td>
              <td>{{ char.sessionCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
