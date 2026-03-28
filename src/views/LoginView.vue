<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, register, loginWithGoogle } = useAuth()

const isRegister = ref(false)
const email = ref('')
const password = ref('')
const displayName = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (isRegister.value) {
      await register(email.value, password.value, displayName.value)
    } else {
      await login(email.value, password.value)
    }
    router.push({ name: 'Dashboard' })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unbekannter Fehler'
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
      error.value = 'Ungültige E-Mail oder Passwort'
    } else if (msg.includes('email-already-in-use')) {
      error.value = 'E-Mail wird bereits verwendet'
    } else if (msg.includes('weak-password')) {
      error.value = 'Passwort muss mindestens 6 Zeichen lang sein'
    } else {
      error.value = msg
    }
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  error.value = ''
  loading.value = true
  try {
    await loginWithGoogle()
    router.push({ name: 'Dashboard' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Google-Anmeldung fehlgeschlagen'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="card bg-base-200 shadow-2xl w-full max-w-md border border-parchment-800/20">
      <div class="card-body">
        <h1 class="text-4xl font-medieval text-primary text-center mb-2">
          &#9876; Abenteurerchronik
        </h1>
        <p class="text-center text-base-content/60 mb-6">
          D&D Spielerplattform
        </p>

        <div v-if="error" class="alert alert-error mb-4">
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="isRegister" class="form-control">
            <label class="label"><span class="label-text">Abenteurername</span></label>
            <input
              v-model="displayName"
              type="text"
              placeholder="Dein Name"
              class="input-fantasy w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">E-Mail</span></label>
            <input
              v-model="email"
              type="email"
              placeholder="abenteurer@example.com"
              class="input-fantasy w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Passwort</span></label>
            <input
              v-model="password"
              type="password"
              placeholder="Mindestens 6 Zeichen"
              class="input-fantasy w-full"
              required
              minlength="6"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full font-medieval text-lg"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ isRegister ? 'Registrieren' : 'Anmelden' }}
          </button>
        </form>

        <div class="divider">ODER</div>

        <button
          @click="handleGoogle"
          class="btn btn-outline w-full"
          :disabled="loading"
        >
          Mit Google anmelden
        </button>

        <p class="text-center mt-4 text-sm">
          <button
            @click="isRegister = !isRegister"
            class="link link-primary"
          >
            {{ isRegister ? 'Bereits ein Konto? Anmelden' : 'Kein Konto? Registrieren' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
