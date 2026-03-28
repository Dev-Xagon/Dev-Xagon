<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <header class="navbar bg-base-200 border-b border-parchment-800/20 px-4 md:px-8">
    <div class="flex-1">
      <RouterLink to="/" class="text-2xl font-medieval text-primary hover:text-primary-focus transition-colors">
        &#9876; Abenteurerchronik
      </RouterLink>
    </div>

    <div class="flex-none gap-2">
      <div class="hidden md:flex items-center gap-2 text-sm text-base-content/70">
        <div class="badge badge-outline">
          {{ authStore.isSpielleiter ? 'Spielleiter' : 'Spieler' }}
        </div>
        <span>{{ authStore.userProfile?.displayName }}</span>
      </div>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder">
          <div class="bg-primary text-primary-content rounded-full w-10">
            <span class="text-sm">{{ authStore.userProfile?.displayName?.charAt(0)?.toUpperCase() ?? '?' }}</span>
          </div>
        </div>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52 border border-parchment-800/20">
          <li class="md:hidden">
            <span class="font-semibold">{{ authStore.userProfile?.displayName }}</span>
          </li>
          <li><button @click="handleLogout">Abmelden</button></li>
        </ul>
      </div>
    </div>
  </header>
</template>
