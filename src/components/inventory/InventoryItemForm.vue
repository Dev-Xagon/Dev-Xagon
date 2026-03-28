<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useInventory } from '@/composables/useInventory'
import { KATEGORIEN, type InventoryItem } from '@/types'

const props = defineProps<{
  characterId: string
  item: InventoryItem | null
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const { addItem, updateItem } = useInventory(props.characterId)
const loading = ref(false)

const form = ref({
  name: '',
  beschreibung: '',
  anzahl: 1,
  kategorie: 'sonstiges' as InventoryItem['kategorie'],
})

watchEffect(() => {
  if (props.item) {
    form.value = {
      name: props.item.name,
      beschreibung: props.item.beschreibung,
      anzahl: props.item.anzahl,
      kategorie: props.item.kategorie,
    }
  } else {
    form.value = { name: '', beschreibung: '', anzahl: 1, kategorie: 'sonstiges' }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    if (props.item) {
      await updateItem(props.item.id, form.value)
    } else {
      await addItem(form.value)
    }
    emit('saved')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="font-medieval text-xl text-primary">
      {{ item ? 'Gegenstand bearbeiten' : 'Neuer Gegenstand' }}
    </h3>

    <div class="form-control">
      <label class="label"><span class="label-text">Name</span></label>
      <input v-model="form.name" type="text" class="input-fantasy w-full" required />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label"><span class="label-text">Kategorie</span></label>
        <select v-model="form.kategorie" class="select select-bordered bg-base-300 w-full">
          <option v-for="(label, key) in KATEGORIEN" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">Anzahl</span></label>
        <input v-model.number="form.anzahl" type="number" min="1" class="input-fantasy w-full" />
      </div>
    </div>

    <div class="form-control">
      <label class="label"><span class="label-text">Beschreibung</span></label>
      <textarea v-model="form.beschreibung" class="textarea textarea-bordered bg-base-300 h-20"></textarea>
    </div>

    <div class="flex gap-2 justify-end">
      <button type="button" class="btn btn-ghost" @click="emit('cancel')">Abbrechen</button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        {{ item ? 'Speichern' : 'Hinzufügen' }}
      </button>
    </div>
  </form>
</template>
