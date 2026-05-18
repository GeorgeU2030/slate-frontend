<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Title } from '@/types/Title'
import CardSkeleton from './CardSkeleton.vue'
import TitleCard from './TitleCard.vue'
import { PhFilmSlate, PhTelevision } from '@phosphor-icons/vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  title: string
  icon: 'film' | 'tv'
  items: Title[] | undefined
  isLoading: boolean
}>()

const ICONS = {
  film: PhFilmSlate,
  tv: PhTelevision,
} as const

const sectionRef    = ref<HTMLElement | null>(null)
const trackRef      = ref<HTMLDivElement | null>(null)
const headingRef    = ref<HTMLDivElement | null>(null)
const canScrollLeft  = ref(false)
const canScrollRight = ref(true)
const prevItemsLen   = ref(0)

const updateScrollState = () => {
  const el = trackRef.value
  if (!el) return
  canScrollLeft.value  = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

onMounted(() => {
  trackRef.value?.addEventListener('scroll', updateScrollState, { passive: true })
  updateScrollState()

  if (!sectionRef.value || !headingRef.value) return
  gsap.from(headingRef.value, {
    x: -30,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  })
})

onUnmounted(() => {
  trackRef.value?.removeEventListener('scroll', updateScrollState)
})

// Animate cards when items load
watch(() => props.items, (val) => {
  if (!val?.length || val.length === prevItemsLen.value) return
  prevItemsLen.value = val.length
  const cards = trackRef.value?.children
  if (!cards) return
  gsap.from(cards, {
    opacity: 0,
    y: 24,
    scale: 0.94,
    duration: 0.5,
    ease: 'power3.out',
    stagger: 0.06,
    clearProps: 'all',
  })
})

const scroll = (dir: number) => {
  const el = trackRef.value
  if (!el) return
  const target = { val: el.scrollLeft }
  gsap.to(target, {
    val: el.scrollLeft + dir * 340,
    duration: 0.65,
    ease: 'power3.inOut',
    onUpdate() { el.scrollLeft = target.val },
  })
}
</script>

<template>
  <section ref="sectionRef" class="mb-10">
    <div ref="headingRef" class="flex items-center justify-between mb-4 px-6 md:px-10">
      <div class="flex items-center gap-2">
        <component
          :is="ICONS[icon]"
          :size="16"
          weight="fill"
          class="text-red-cinema"
        />
        <h2 class="text-white font-semibold text-base tracking-wide">{{ title }}</h2>
      </div>
      <div class="flex gap-1">
        <button
          v-for="dir in (['left', 'right'] as const)"
          :key="dir"
          :disabled="dir === 'left' ? !canScrollLeft : !canScrollRight"
          class="w-7 h-7 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          @click="scroll(dir === 'left' ? -1 : 1)"
        >
          {{ dir === 'left' ? '‹' : '›' }}
        </button>
      </div>
    </div>
    <div
      ref="trackRef"
      class="flex gap-3 overflow-x-auto px-6 md:px-10 pb-1"
      style="scrollbar-width: none"
    >
      <template v-if="isLoading">
        <CardSkeleton v-for="i in 6" :key="i" />
      </template>
      <template v-else>
        <TitleCard
          v-for="item in (items ?? [])"
          :key="item.tmdb_id"
          :item="item"
        />
      </template>
    </div>
  </section>
</template>