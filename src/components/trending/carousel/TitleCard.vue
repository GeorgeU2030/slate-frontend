<script setup lang="ts">
import { ref, computed } from 'vue'
import gsap from 'gsap'
import { parseGenres, parseProviders } from '@/utils/parseUtils'
import ProviderPill from '../ProviderPill.vue'
import { FALLBACK } from '@/utils/fallbackUtils'
import type { Title } from '@/types/Title'

const props = defineProps<{ item: Title }>()

const imgError   = ref(false)
const overlayRef = ref<HTMLDivElement | null>(null)
const imgRef     = ref<HTMLImageElement | null>(null)

const genres    = computed(() => parseGenres(props.item.genres))
const providers = computed(() => parseProviders(props.item.watch_providers))
const imgSrc    = computed(() => imgError.value ? FALLBACK : props.item.poster_url)

const onMouseEnter = () => {
  gsap.to(imgRef.value,     { scale: 1.07, duration: 0.4, ease: 'power2.out' })
  gsap.to(overlayRef.value, { opacity: 1,  duration: 0.3, ease: 'power2.out' })
}
const onMouseLeave = () => {
  gsap.to(imgRef.value,     { scale: 1,   duration: 0.4,  ease: 'power2.inOut' })
  gsap.to(overlayRef.value, { opacity: 0, duration: 0.25, ease: 'power2.in' })
}
</script>

<template>
  <div
    ref="cardRef"
    class="shrink-0 w-36 md:w-44 cursor-pointer"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="relative aspect-2/3 rounded-lg overflow-hidden border border-white/5">
      <img
        ref="imgRef"
        :src="imgSrc"
        :alt="item.title"
        class="w-full h-full object-cover"
        style="transform-origin: center center"
        @error="imgError = true"
      />

      <!-- GSAP overlay -->
      <div
        ref="overlayRef"
        class="absolute inset-0 flex flex-col justify-end p-3 gap-1.5"
        style="opacity: 0; background: linear-gradient(to top, rgba(18,18,18,0.97) 0%, rgba(18,18,18,0.4) 55%, transparent 100%)"
      >
        <!-- Genres -->
        <div class="flex gap-1 flex-wrap">
          <span
            v-for="g in genres"
            :key="g"
            class="text-[10px] px-1.5 py-0.5 rounded bg-red-cinema/80 text-white font-medium"
          >
            {{ g }}
          </span>
        </div>

        <!-- Studio / Network -->
        <p v-if="item.studio ?? item.network" class="text-[10px] text-white/50 truncate">
          {{ item.studio ?? item.network }}
        </p>

        <!-- Providers -->
        <div v-if="providers.length > 0" class="flex gap-1 flex-wrap">
          <ProviderPill v-for="p in providers" :key="p" :name="p" />
        </div>

        <button class="mt-1 w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 backdrop-blur-sm border border-white/10 transition-colors">
          ▶ More info
        </button>
      </div>

      <!-- Year badge -->
      <div class="absolute top-2 right-2">
        <div class="flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5 backdrop-blur-sm">
          <span class="text-[10px] text-gold font-semibold">{{ item.release_year }}</span>
        </div>
      </div>
    </div>

    <p class="mt-2 text-xs text-white font-medium truncate">{{ item.title }}</p>
    <p class="text-[10px] text-white/40 mt-0.5 truncate">
      {{ item.studio ?? item.network ?? String(item.release_year ?? '') }}
    </p>
  </div>
</template>