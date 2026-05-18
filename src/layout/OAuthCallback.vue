<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/store/useAuthStore"

const router   = useRouter()
const auth     = useAuthStore()
let   handled  = false

onMounted(() => {
  if (handled) return
  handled = true

  const params       = new URLSearchParams(window.location.search)
  const accessToken  = params.get("access_token")
  const refreshToken = params.get("refresh_token")

  if (accessToken && refreshToken) {
    auth.setTokens(accessToken, refreshToken)
    window.history.replaceState({}, "", window.location.pathname)
    router.replace("/home")
  } else if (auth.isAuthenticated) {
    router.replace("/home")
  } else {
    router.replace("/trending")
  }
})
</script>

<template>
  <div class="min-h-screen bg-dark-black flex items-center justify-center">
    <div class="flex flex-col items-center gap-3">
      <div class="w-8 h-8 border-2 border-red-cinema/30 border-t-red-cinema rounded-full animate-spin" />
      <p class="text-slate-white/40 text-sm">Signing you in...</p>
    </div>
  </div>
</template>