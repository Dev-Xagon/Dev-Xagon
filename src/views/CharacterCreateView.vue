<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacter } from '@/composables/useCharacter'
import { useImageUpload } from '@/composables/useImageUpload'
import { RASSEN, KLASSEN } from '@/types'
import type { CharacterStats } from '@/types'

const router = useRouter()
const { createCharacter, updateCharacter } = useCharacter()
const { uploadCharacterImage, uploading } = useImageUpload()

const loading = ref(false)
const error = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const form = ref({
  name: '',
  rasse: RASSEN[0],
  klasse: KLASSEN[0],
  hintergrund: '',
  stats: {
    staerke: 10,
    geschicklichkeit: 10,
    konstitution: 10,
    intelligenz: 10,
    weisheit: 10,
    charisma: 10,
  } as CharacterStats,
})

function onImageSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const docRef = await createCharacter({
      ...form.value,
      imageUrl: null,
    })

    if (imageFile.value) {
      const url = await uploadCharacterImage(docRef.id, imageFile.value)
      await updateCharacter(docRef.id, { imageUrl: url })
    }

    router.push({ name: 'Dashboard' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Fehler beim Erstellen'
  } finally {
    loading.value = false
  }
}

const statLabels: Record<keyof CharacterStats, string> = {
  staerke: 'Stärke',
  geschicklichkeit: 'Geschicklichkeit',
  konstitution: 'Konstitution',
  intelligenz: 'Intelligenz',
  weisheit: 'Weisheit',
  charisma: 'Charisma',
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="page-title">Neuen Charakter erstellen</h1>

    <div v-if="error" class="alert alert-error mb-4">
      <span>{{ error }}</span>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Portrait -->
      <div class="form-control">
        <label class="label"><span class="label-text font-medieval text-lg">Charakterbild</span></label>
        <div class="flex items-center gap-4">
          <div class="w-24 h-24 rounded-xl overflow-hidden bg-base-300 flex items-center justify-center">
            <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
            <span v-else class="text-3xl text-base-content/30">&#128100;</span>
          </div>
          <input
            type="file"
            accept="image/*"
            class="file-input file-input-bordered file-input-primary w-full max-w-xs"
            @change="onImageSelect"
          />
        </div>
      </div>

      <!-- Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Name</span></label>
          <input v-model="form.name" type="text" placeholder="Charaktername" class="input-fantasy w-full" required />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Rasse</span></label>
          <select v-model="form.rasse" class="select select-bordered bg-base-200 w-full">
            <option v-for="r in RASSEN" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Klasse</span></label>
          <select v-model="form.klasse" class="select select-bordered bg-base-200 w-full">
            <option v-for="k in KLASSEN" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>
      </div>

      <!-- Stats -->
      <div>
        <h2 class="font-medieval text-xl text-primary mb-3">Attribute</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="(label, key) in statLabels" :key="key" class="form-control">
            <label class="label"><span class="label-text text-sm">{{ label }}</span></label>
            <input
              v-model.number="form.stats[key]"
              type="number"
              min="1"
              max="30"
              class="input-fantasy w-full text-center"
            />
          </div>
        </div>
      </div>

      <!-- Backstory -->
      <div class="form-control">
        <label class="label"><span class="label-text font-medieval text-lg">Hintergrundgeschichte</span></label>
        <textarea
          v-model="form.hintergrund"
          class="textarea textarea-bordered bg-base-200 h-32"
          placeholder="Die Geschichte deines Charakters..."
        ></textarea>
      </div>

      <!-- Submit -->
      <div class="flex gap-3">
        <button type="submit" class="btn btn-primary font-medieval text-lg flex-1" :disabled="loading || uploading">
          <span v-if="loading || uploading" class="loading loading-spinner loading-sm"></span>
          Charakter erstellen
        </button>
        <RouterLink to="/" class="btn btn-ghost">Abbrechen</RouterLink>
      </div>
    </form>
  </div>
</template>
