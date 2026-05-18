<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuthModalStore } from '@/store/useAuthModalStore'

gsap.registerPlugin(ScrollTrigger)

const modal  = useAuthModalStore()
const ctaRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!ctaRef.value) return
  gsap.from(Array.from(ctaRef.value.children), {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: ctaRef.value,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  })
})
</script>

<template>
  <div
    ref="ctaRef"
    class="py-16 px-6 md:px-10 flex flex-col items-center text-center border-t border-white/5 mt-4"
  >
    <h3 class="text-white text-xl font-semibold mb-2">Want to save your favorites?</h3>
    <p class="text-white/50 text-sm mb-6 max-w-sm">
      Create a free account to access personalized lists and much more.
    </p>
    <button
      class="bg-red-cinema hover:bg-red-cinema/85 text-white font-semibold px-8 py-2.5 rounded-full transition-colors"
      @click="modal.openRegister()"
    >
      Create free account
    </button>
    <h1 class="text-slate-white text-xs mt-4">Developed by <span class="text-gold">JADE</span> powered by <span class="text-red-cinema">TMDB</span></h1>
  </div>
</template>