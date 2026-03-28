<script setup lang="ts">
import { ref } from 'vue'
import { useInventory } from '@/composables/useInventory'
import InventoryItemForm from './InventoryItemForm.vue'
import { KATEGORIEN, type InventoryItem } from '@/types'

const props = defineProps<{
  characterId: string
  items: InventoryItem[]
}>()

const emit = defineEmits<{
  updated: []
}>()

const { deleteItem } = useInventory(props.characterId)
const showForm = ref(false)
const editingItem = ref<InventoryItem | null>(null)
const filter = ref<string>('')

function filteredItems() {
  if (!filter.value) return props.items
  return props.items.filter((i) => i.kategorie === filter.value)
}

function openEdit(item: InventoryItem) {
  editingItem.value = item
  showForm.value = true
}

function openNew() {
  editingItem.value = null
  showForm.value = true
}

async function handleDelete(itemId: string) {
  if (!confirm('Gegenstand wirklich löschen?')) return
  await deleteItem(itemId)
  emit('updated')
}

function onSaved() {
  showForm.value = false
  editingItem.value = null
  emit('updated')
}
</script>

<template>
  <div class="card-fantasy">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-medieval text-2xl text-primary">Inventar</h2>
        <button @click="openNew" class="btn btn-primary btn-sm">+ Gegenstand</button>
      </div>

      <!-- Filter -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <button
          class="btn btn-xs"
          :class="{ 'btn-primary': !filter }"
          @click="filter = ''"
        >
          Alle
        </button>
        <button
          v-for="(label, key) in KATEGORIEN"
          :key="key"
          class="btn btn-xs"
          :class="{ 'btn-primary': filter === key }"
          @click="filter = key"
        >
          {{ label }}
        </button>
      </div>

      <!-- Items Table -->
      <div v-if="filteredItems().length === 0" class="text-center py-8 text-base-content/50">
        Keine Gegenstände vorhanden
      </div>

      <div v-else class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Kategorie</th>
              <th>Anzahl</th>
              <th>Beschreibung</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems()" :key="item.id">
              <td class="font-semibold">{{ item.name }}</td>
              <td><span class="badge badge-sm badge-outline">{{ KATEGORIEN[item.kategorie] }}</span></td>
              <td>{{ item.anzahl }}</td>
              <td class="text-sm text-base-content/60 max-w-xs truncate">{{ item.beschreibung }}</td>
              <td class="flex gap-1">
                <button @click="openEdit(item)" class="btn btn-ghost btn-xs">&#9998;</button>
                <button @click="handleDelete(item.id)" class="btn btn-ghost btn-xs text-error">&#10005;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <dialog :open="showForm" class="modal" :class="{ 'modal-open': showForm }">
        <div class="modal-box bg-base-200">
          <InventoryItemForm
            :character-id="characterId"
            :item="editingItem"
            @saved="onSaved"
            @cancel="showForm = false"
          />
        </div>
        <div class="modal-backdrop" @click="showForm = false"></div>
      </dialog>
    </div>
  </div>
</template>
