<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  xp: number
  xpNextLevel: number
}>()

const percentage = computed(() => {
  if (props.xpNextLevel <= 0) return 100
  return Math.min(100, Math.round((props.xp / props.xpNextLevel) * 100))
})
</script>

<template>
  <div>
    <div class="flex justify-between text-xs text-base-content/60 mb-1">
      <span>{{ xp }} XP</span>
      <span>{{ xpNextLevel }} XP</span>
    </div>
    <progress
      class="progress progress-primary w-full"
      :value="percentage"
      max="100"
    ></progress>
  </div>
</template>
