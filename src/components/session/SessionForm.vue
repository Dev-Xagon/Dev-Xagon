<script setup lang="ts">
import { ref } from 'vue'
import { useSessions } from '@/composables/useSessions'
import type { Character } from '@/types'

defineProps<{
  characters: Character[]
}>()

const emit = defineEmits<{
  created: []
  cancel: []
}>()

const { createSession } = useSessions()
const loading = ref(false)

const form = ref({
  titel: '',
  datum: new Date().toISOString().split('T')[0],
  notizen: '',
  teilnehmerIds: [] as string[],
})

function toggleTeilnehmer(charId: string) {
  const idx = form.value.teilnehmerIds.indexOf(charId)
  if (idx >= 0) {
    form.value.teilnehmerIds.splice(idx, 1)
  } else {
    form.value.teilnehmerIds.push(charId)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    await createSession({
      ...form.value,
      datum: new Date(form.value.datum),
    })
    emit('created')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="card-fantasy">
    <div class="card-body space-y-4">
      <h2 class="font-medieval text-xl text-primary">Neue Sitzung eintragen</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Titel</span></label>
          <input v-model="form.titel" type="text" class="input-fantasy w-full" placeholder="z.B. Session 42" required />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Datum</span></label>
          <input v-model="form.datum" type="date" class="input-fantasy w-full" required />
        </div>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Teilnehmer</span></label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="char in characters"
            :key="char.id"
            type="button"
            class="btn btn-sm"
            :class="form.teilnehmerIds.includes(char.id) ? 'btn-primary' : 'btn-outline'"
            @click="toggleTeilnehmer(char.id)"
          >
            {{ char.name }}
          </button>
        </div>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Notizen</span></label>
        <textarea v-model="form.notizen" class="textarea textarea-bordered bg-base-300 h-20" placeholder="Zusammenfassung der Sitzung..."></textarea>
      </div>

      <div class="flex gap-2 justify-end">
        <button type="button" class="btn btn-ghost btn-sm" @click="emit('cancel')">Abbrechen</button>
        <button type="submit" class="btn btn-primary btn-sm" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          Sitzung speichern
        </button>
      </div>
    </div>
  </form>
</template>
