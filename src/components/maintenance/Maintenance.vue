<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { PhArrowClockwise, PhWarningCircle } from '@phosphor-icons/vue'

const box = ref<HTMLElement | null>(null)

const reload = () => {
  window.location.reload()
}

onMounted(() => {
  gsap.from(box.value, {
    opacity: 0,
    y: 40,
    scale: 0.96,
    duration: 0.9,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-dark-black text-slate-white px-6">
    <div
      ref="box"
      class="text-center max-w-md w-full bg-black-card border border-white/5 rounded-2xl p-8 shadow-xl"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <PhWarningCircle
          :size="48"
          weight="fill"
          class="text-red-cinema"
        />
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold mb-2">
        We're having issues
      </h1>

      <!-- Subtitle -->
      <p class="text-slate-white/60 text-sm">
        Server is currently unavailable or under maintenance. Please try again later.
      </p>

      <!-- Button -->
      <button
        @click="reload"
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-cinema text-white font-semibold
               hover:opacity-90 active:scale-95 transition-all duration-200"
      >
        <PhArrowClockwise :size="16" weight="bold" />
        Retry
      </button>

      <!-- Footer hint -->
      <p class="text-xs text-white/30 mt-4">
        If the problem persists, check your connection.
      </p>
    </div>
  </div>
</template>