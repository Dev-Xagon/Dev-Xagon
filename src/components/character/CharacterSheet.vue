<script setup lang="ts">
import type { Character, CharacterStats } from '@/types'
import CharacterImage from './CharacterImage.vue'
import XpTracker from './XpTracker.vue'

defineProps<{
  character: Character
}>()

const statLabels: Record<keyof CharacterStats, string> = {
  staerke: 'STR',
  geschicklichkeit: 'GES',
  konstitution: 'KON',
  intelligenz: 'INT',
  weisheit: 'WEI',
  charisma: 'CHA',
}

function modifier(value: number): string {
  const mod = Math.floor((value - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}
</script>

<template>
  <div class="card-fantasy">
    <div class="card-body">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Portrait -->
        <div class="w-full md:w-48 flex-shrink-0">
          <CharacterImage
            :url="character.imageUrl"
            :name="character.name"
            class="rounded-xl h-48 md:h-56 w-full object-cover"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 space-y-4">
          <div>
            <h2 class="text-3xl font-medieval text-primary">{{ character.name }}</h2>
            <p class="text-base-content/70 text-lg">
              {{ character.rasse }} &middot; {{ character.klasse }} &middot; Level {{ character.level }}
            </p>
            <p class="text-sm text-base-content/50 mt-1">
              &#128214; {{ character.sessionCount }} Sitzungen
            </p>
          </div>

          <XpTracker :xp="character.xp" :xp-next-level="character.xpNextLevel" />

          <!-- Stats -->
          <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
            <div
              v-for="(label, key) in statLabels"
              :key="key"
              class="text-center p-2 rounded-lg bg-base-300"
            >
              <div class="text-xs text-base-content/50">{{ label }}</div>
              <div class="text-xl font-bold text-primary">{{ character.stats?.[key] ?? 10 }}</div>
              <div class="text-xs text-base-content/60">{{ modifier(character.stats?.[key] ?? 10) }}</div>
            </div>
          </div>

          <!-- Backstory -->
          <div v-if="character.hintergrund" class="mt-4">
            <h3 class="font-medieval text-lg text-primary mb-1">Hintergrund</h3>
            <p class="text-base-content/70 whitespace-pre-line">{{ character.hintergrund }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
