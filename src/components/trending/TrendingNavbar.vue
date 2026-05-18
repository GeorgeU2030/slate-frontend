<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useAuthModalStore } from '@/store/useAuthModalStore'

const modal  = useAuthModalStore()
const navRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!navRef.value) return
  gsap.from(Array.from(navRef.value.children), {
    opacity: 0,
    y: -14,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.1,
    delay: 0.05,
  })
})
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4">
    <div class="absolute inset-0 bg-linear-to-b from-dark-black/80 to-transparent backdrop-blur-[2px]" />
    <div ref="navRef" class="relative w-full flex items-center justify-between">
      <div class="flex items-center gap-1 bg-slate-white rounded-full px-2 py-1">
        <img src="/slate.png" alt="Slate Logo" class="h-8 w-8" />
        <span class="text-red-cinema font-semibold text-3xl tracking-tight">Slate</span>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors px-4 py-2 rounded-lg"
          @click="modal.openRegister()"
        >
          Register
        </button>
        <button
          class="bg-red-cinema hover:bg-red-cinema/85 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          @click="modal.openLogin()"
        >
          Sign in
        </button>
      </div>
    </div>
  </nav>
</template>