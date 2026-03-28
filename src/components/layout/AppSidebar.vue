<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <aside class="hidden md:flex flex-col w-56 bg-base-200 border-r border-parchment-800/20 p-4 gap-1">
    <RouterLink
      to="/"
      class="btn btn-ghost justify-start gap-3 font-normal"
      active-class="btn-active"
    >
      <span class="text-lg">&#127968;</span>
      Dashboard
    </RouterLink>

    <RouterLink
      to="/charakter/neu"
      class="btn btn-ghost justify-start gap-3 font-normal"
      active-class="btn-active"
    >
      <span class="text-lg">&#10010;</span>
      Neuer Charakter
    </RouterLink>

    <RouterLink
      to="/sitzungen"
      class="btn btn-ghost justify-start gap-3 font-normal"
      active-class="btn-active"
    >
      <span class="text-lg">&#128214;</span>
      Sitzungen
    </RouterLink>

    <RouterLink
      to="/wuensche"
      class="btn btn-ghost justify-start gap-3 font-normal"
      active-class="btn-active"
    >
      <span class="text-lg">&#10024;</span>
      Wünsche
    </RouterLink>

    <RouterLink
      v-if="authStore.isSpielleiter"
      to="/spielleiter"
      class="btn btn-ghost justify-start gap-3 font-normal"
      active-class="btn-active"
    >
      <span class="text-lg">&#128081;</span>
      Spielleiter
    </RouterLink>

    <div class="divider my-2"></div>

    <div class="text-xs text-base-content/40 px-4">
      D&D Spielerplattform v0.1
    </div>
  </aside>
</template>
