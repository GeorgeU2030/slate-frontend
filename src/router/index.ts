import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import RootLayout from '@/layout/RootLayout.vue'
import Trending from '@/pages/Trending.vue'
import Home from '@/pages/Home.vue'
import OAuthCallback from '@/layout/OAuthCallback.vue'
import Rate from '@/pages/Rate.vue'

const PROTECTED = ['/home', '/rate']

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: RootLayout,
      children: [
        { path: '',              redirect: '/trending' },
        { path: 'trending',      component: Trending },
        { path: 'home',          component: Home },
        { path: 'auth/callback', component: OAuthCallback },
        { path: 'rate',          component: Rate },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (PROTECTED.includes(to.path) && !auth.isAuthenticated) {
    return '/trending'
  }
})