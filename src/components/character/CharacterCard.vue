<script setup lang="ts">
import type { Character } from '@/types'
import XpTracker from './XpTracker.vue'
import CharacterImage from './CharacterImage.vue'

defineProps<{
  character: Character
}>()
</script>

<template>
  <RouterLink
    :to="`/charakter/${character.id}`"
    class="card-fantasy cursor-pointer hover:scale-[1.02]"
  >
    <figure class="px-4 pt-4">
      <CharacterImage :url="character.imageUrl" :name="character.name" class="rounded-xl h-48 w-full object-cover" />
    </figure>
    <div class="card-body">
      <h2 class="card-title font-medieval text-primary">{{ character.name }}</h2>
      <p class="text-base-content/70">
        {{ character.rasse }} &middot; {{ character.klasse }}
      </p>

      <div class="flex items-center gap-4 text-sm text-base-content/60 mt-1">
        <span>Level {{ character.level }}</span>
        <span>&#128214; {{ character.sessionCount }} Sitzungen</span>
      </div>

      <XpTracker :xp="character.xp" :xp-next-level="character.xpNextLevel" class="mt-3" />
    </div>
  </RouterLink>
</template>
