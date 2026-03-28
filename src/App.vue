<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const route = useRoute()
const authStore = useAuthStore()

const showLayout = computed(() => !route.meta.public && authStore.isLoggedIn)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader v-if="showLayout" />

    <div class="flex flex-1">
      <AppSidebar v-if="showLayout" />

      <main class="flex-1 p-4 md:p-8">
        <div v-if="authStore.loading" class="flex items-center justify-center h-64">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        <RouterView v-else />
      </main>
    </div>
  </div>
</template>
