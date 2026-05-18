<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import gsap from 'gsap'
import { parseGenres, parseProviders } from '@/utils/parseUtils'
import ProviderPill from './ProviderPill.vue'
import type { Title } from '@/types/Title'
import { PhPlay, PhInfo } from '@phosphor-icons/vue'

const props = defineProps<{ featured: Title | undefined }>()

const imgRef       = ref<HTMLImageElement | null>(null)
const badgeRef     = ref<HTMLDivElement | null>(null)
const titleRef     = ref<HTMLHeadingElement | null>(null)
const metaRef      = ref<HTMLDivElement | null>(null)
const overviewRef  = ref<HTMLParagraphElement | null>(null)
const genresRef    = ref<HTMLDivElement | null>(null)
const providersRef = ref<HTMLDivElement | null>(null)
const buttonsRef   = ref<HTMLDivElement | null>(null)
const prevTitle    = ref<string | null>(null)

const providers = computed(() => parseProviders(props.featured?.watch_providers ?? null))

// Entrance animation
onMounted(() => {
  if (!imgRef.value || !badgeRef.value || !titleRef.value) return
  const tl = gsap.timeline({ delay: 0.1 })
  tl.from(imgRef.value,      { scale: 1.08, duration: 1.6, ease: 'power2.out' })
    .from(badgeRef.value,    { opacity: 0, x: -16, duration: 0.5, ease: 'power2.out' }, '-=1')
    .from(titleRef.value,    { opacity: 0, y: 20,  duration: 0.6, ease: 'power3.out' }, '-=0.8')
    .from(metaRef.value,     { opacity: 0, y: 10,  duration: 0.4, ease: 'power2.out' }, '-=0.5')
    .from(overviewRef.value, { opacity: 0, y: 14,  duration: 0.5, ease: 'power2.out' }, '-=0.4')
    .from(genresRef.value,   { opacity: 0, y: 10,  duration: 0.4, ease: 'power2.out' }, '-=0.35')
    .from(providersRef.value,{ opacity: 0, y: 8,   duration: 0.35,ease: 'power2.out' }, '-=0.3')
    .from(buttonsRef.value,  { opacity: 0, y: 10,  duration: 0.4, ease: 'power2.out' }, '-=0.3')
})

// Re-animate when featured changes
watch(() => props.featured, (val) => {
  if (!val || val.title === prevTitle.value) return
  prevTitle.value = val.title
  const targets = [
    badgeRef.value, titleRef.value, metaRef.value,
    overviewRef.value, genresRef.value, providersRef.value, buttonsRef.value,
  ]
  gsap.fromTo(
    targets,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.07, clearProps: 'all' }
  )
})

const openTrailer = () => {
  if (!props.featured?.title) return
  const query = encodeURIComponent(`${props.featured.title} trailer`)
  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
}

const openMoreInfo = () => {
  const item = props.featured
  if (!item?.tmdb_id) return

  const type = item.type === 'tv' ? 'tv' : 'movie'

  const url = `https://www.themoviedb.org/${type}/${item.tmdb_id}`

  window.open(url, '_blank')
}
</script>

<template>
  <div ref="heroRef" class="relative w-full h-[55vh] md:h-[72vh] overflow-hidden">
    <img
      v-if="featured?.backdrop_url"
      ref="imgRef"
      :src="featured.backdrop_url"
      :alt="featured.title"
      class="absolute inset-0 w-full h-full object-cover object-top"
      style="filter: brightness(0.5) contrast(1.05); transform-origin: center top"
    />
    <div class="absolute inset-0 bg-linear-to-r from-dark-black via-dark-black/55 to-transparent" />
    <div class="absolute inset-0 bg-linear-to-t from-dark-black via-transparent to-dark-black/25" />

    <div class="relative h-full flex flex-col justify-end px-6 md:px-10 pb-12">
      <div class="max-w-xl">

        <!-- Badge -->
        <div ref="badgeRef" class="flex items-center gap-2 mb-3">
          <span class="text-xs font-semibold tracking-[0.2em] text-red-cinema uppercase">Trending now</span>
          <span class="w-8 h-px bg-red-cinema/60" />
        </div>

        <!-- Title -->
        <h1 ref="titleRef" class="text-3xl md:text-5xl font-bold text-white leading-tight mb-2">
          {{ featured?.title ?? '' }}
        </h1>

        <!-- Meta -->
        <div ref="metaRef" class="flex items-center gap-3 mb-4 flex-wrap">
          <span v-if="featured?.release_year" class="text-xs text-white/50">
            {{ featured.release_year }}
          </span>
          <span v-if="featured?.studio ?? featured?.network" class="flex items-center gap-1 text-xs text-white/50">
            {{ featured?.studio ?? featured?.network }}
          </span>
          <span v-if="featured?.network && featured?.studio" class="flex items-center gap-1 text-xs text-white/50">
            {{ featured.network }}
          </span>
        </div>

        <!-- Overview -->
        <p
          v-if="featured?.overview"
          ref="overviewRef"
          class="text-white/60 text-sm md:text-base leading-relaxed line-clamp-3 mb-4 max-w-lg"
        >
          {{ featured.overview }}
        </p>

        <!-- Genres -->
        <div v-if="featured?.genres" ref="genresRef" class="flex gap-2 flex-wrap mb-4">
          <span
            v-for="g in parseGenres(featured.genres, 4)"
            :key="g"
            class="text-xs px-2.5 py-1 rounded-xl border border-white/10 bg-white/5 text-white/70"
          >
            {{ g }}
          </span>
        </div>

        <!-- Providers -->
        <div v-if="providers.length > 0" ref="providersRef" class="flex items-center gap-2 mb-5 flex-wrap">
          <span class="text-[11px] text-white/40 mr-0.5">Watch on</span>
          <ProviderPill v-for="p in providers" :key="p" :name="p" />
        </div>

        <!-- Buttons -->
        <div ref="buttonsRef" class="flex gap-3 flex-wrap">
          <button
            class="bg-red-cinema hover:bg-red-cinema/85 text-white font-semibold px-6 py-2 rounded-xl flex items-center gap-2 transition-colors"
            @click="openTrailer"
          >
            <PhPlay :size="16" weight="fill" />
            Trailer
          </button>
          <button
            class="border border-white/20 bg-white/5 text-white hover:text-white/80 hover:bg-white/10 px-5 py-2 rounded-xl flex items-center gap-2 transition-colors"
            @click="openMoreInfo"
          >
            <PhInfo :size="16" weight="fill" />
            More info
          </button>
        </div>

      </div>
    </div>
  </div>
</template>