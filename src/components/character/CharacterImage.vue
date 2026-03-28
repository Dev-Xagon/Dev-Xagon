<script setup lang="ts">
defineProps<{
  url: string | null
  name: string
}>()
</script>

<template>
  <img
    v-if="url"
    :src="url"
    :alt="`Porträt von ${name}`"
    class="object-cover bg-base-300"
  />
  <div
    v-else
    class="flex items-center justify-center bg-base-300 text-primary"
  >
    <span class="text-5xl font-medieval">{{ name.charAt(0).toUpperCase() }}</span>
  </div>
</template>
