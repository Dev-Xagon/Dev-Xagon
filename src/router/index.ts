import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/charakter/neu',
      name: 'CharakterErstellen',
      component: () => import('@/views/CharacterCreateView.vue'),
    },
    {
      path: '/charakter/:id',
      name: 'CharakterDetail',
      component: () => import('@/views/CharacterDetailView.vue'),
      props: true,
    },
    {
      path: '/sitzungen',
      name: 'Sitzungen',
      component: () => import('@/views/SessionsView.vue'),
    },
    {
      path: '/wuensche',
      name: 'Wuensche',
      component: () => import('@/views/WishesView.vue'),
    },
    {
      path: '/spielleiter',
      name: 'Spielleiter',
      component: () => import('@/views/SpielleiterView.vue'),
      meta: { dmOnly: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize
  if (authStore.loading) {
    await new Promise<void>((resolve) => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  if (!to.meta.public && !authStore.isLoggedIn) {
    return { name: 'Login' }
  }

  if (to.meta.dmOnly && !authStore.isSpielleiter) {
    return { name: 'Dashboard' }
  }
})

export default router
