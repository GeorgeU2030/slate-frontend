<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhFilmSlate, PhTelevision } from '@phosphor-icons/vue'
import { useMyTitles } from '@/queries/useHome'
import ScoreRingSmall from '@/components/custom/ScoreRingSmall.vue'
import { useRouter } from 'vue-router'
import type { RatedTitle } from '@/types/RatedTitle'
import { scoreColor } from '@/utils/scoreUtils'
import { FALLBACK } from '@/utils/fallbackUtils'
import { useRateStore } from '@/store/useRateStore'

const router = useRouter()
const rateStore = useRateStore()

const tab = ref<'movies' | 'shows'>('movies')
const { data, isLoading } = useMyTitles()

const movies = computed(() => data.value?.filter((t) => t.type === 'movie') ?? [])
const shows = computed(() => data.value?.filter((t) => t.type === 'tv') ?? [])
const active = computed(() => tab.value === 'movies' ? movies.value : shows.value)

// Group items by year function
const groupedByYear = computed(() => {
  const activeItems = active.value
  
  // Filter items without year
  const itemsWithYear = activeItems.filter(item => item.release_year)
  
  // Group items by year
  const groups = new Map<number, RatedTitle[]>()
  
  itemsWithYear.forEach(item => {
    const year = item.release_year
    if (!year) return
    if (!groups.has(year)) {
      groups.set(year, [])
    }
    groups.get(year)!.push(item)
  })
  
  // Group items by year and sort by score within each group
  const result: Array<{ year: number; items: (RatedTitle & { rank: number })[] }> = []
  
  groups.forEach((items, year) => {
    // Order items by score (descending)
    const sortedItems = [...items].sort((a, b) => b.score - a.score)
    
    // Asign rank to each item
    const itemsWithRank = sortedItems.map((item, index) => ({
      ...item,
      rank: index + 1
    }))
    
    result.push({
      year,
      items: itemsWithRank
    })
  })
  
  // Order years from most recent to oldest
  return result.sort((a, b) => b.year - a.year)
})

const avg = (list: RatedTitle[]) =>
  list.length ? list.reduce((s, t) => s + t.score, 0) / list.length : null

const stats = computed(() => {
  const mAvg = avg(movies.value)
  const sAvg = avg(shows.value)
  return [
    { label: 'Movies',    value: movies.value.length,                    icon: PhFilmSlate, color: '#E50914' },
    { label: 'TV Shows',  value: shows.value.length,                     icon: PhTelevision, color: '#D4AF37' },
    { label: 'Avg Movie', value: mAvg !== null ? mAvg.toFixed(1) : '—', icon: PhFilmSlate, color: mAvg !== null ? scoreColor(mAvg) : 'rgba(255,255,255,0.2)' },
    { label: 'Avg Show',  value: sAvg !== null ? sAvg.toFixed(1) : '—', icon: PhTelevision, color: sAvg !== null ? scoreColor(sAvg) : 'rgba(255,255,255,0.2)' },
  ]
})

const handleClick = (item: RatedTitle) => {
  rateStore.setTarget({
    ...item,
    _rated: true,
  })

  router.push('/rate')
}

const handleImgError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = FALLBACK
}
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-5 sm:px-8 py-8">
    <div class="mb-6">
      <h2 class="text-2xl font-black text-white tracking-tight">My Collection</h2>
      <p class="text-white/30 text-sm mt-1">Everything you've rated and tracked</p>
    </div>

    <div v-if="!isLoading && data && data.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div
        v-for="s in stats"
        :key="s.label"
        class="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3"
      >
        <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :style="{ background: `${s.color}18` }"
        >
          <component :is="s.icon" :size="14" :style="{ color: s.color }" />
        </div>
        <div>
          <p class="text-[10px] text-white/30 uppercase tracking-wider">{{ s.label }}</p>
          <p class="text-lg font-black text-white leading-tight">{{ s.value }}</p>
        </div>
      </div>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        :class="[
          'flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200',
          tab === 'movies' ? 'bg-red-cinema text-white' : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/8'
        ]"
        @click="tab = 'movies'"
      >
        <PhFilmSlate :size="12" />
        Movies
        <span v-if="movies.length > 0"
          :class="['text-[10px] px-1.5 py-0.5 rounded-full font-black', tab === 'movies' ? 'bg-white/20 text-white' : 'bg-white/8 text-white/40']"
        >{{ movies.length }}</span>
      </button>
      <button
        :class="[
          'flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200',
          tab === 'shows' ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/8'
        ]"
        @click="tab = 'shows'"
      >
        <PhTelevision :size="12" />
        TV Shows
        <span v-if="shows.length > 0"
          :class="['text-[10px] px-1.5 py-0.5 rounded-full font-black', tab === 'shows' ? 'bg-black/20 text-black' : 'bg-white/8 text-white/40']"
        >{{ shows.length }}</span>
      </button>
    </div>

    <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
      <div v-for="i in 12" :key="i" class="rounded-2xl overflow-hidden border border-white/6 animate-pulse">
        <div class="bg-white/5" style="aspect-ratio: 2/3" />
        <div class="p-2.5 flex flex-col gap-1.5">
          <div class="h-3 w-3/4 rounded bg-white/5" />
          <div class="h-2.5 w-1/2 rounded bg-white/5" />
        </div>
      </div>
    </div>

    <div v-else-if="groupedByYear.length === 0" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/8" style="background: rgba(255,255,255,0.03)">
        <PhFilmSlate v-if="tab === 'movies'" :size="28" class="text-white/15" />
        <PhTelevision v-else :size="28" class="text-white/15" />
      </div>
      <div class="text-center">
        <p class="text-white/30 text-sm font-medium">No {{ tab === 'movies' ? 'movies' : 'TV shows' }} yet</p>
        <p class="text-white/15 text-xs mt-1">Use Search to find titles and add them</p>
      </div>
    </div>

    <div v-else class="space-y-8">
      <!-- By Year -->
      <div v-for="group in groupedByYear" :key="group.year" class="space-y-3">
        <!-- Year header -->
        <div class="flex items-baseline gap-2 px-4 w-48 sticky top-0 bg-black/80 rounded-xl border border-gold backdrop-blur-sm py-2 z-10">
          <h3 class="text-xl font-black text-white tracking-tight">{{ group.year }}</h3>
          <span class="text-xs text-white/30">{{ group.items.length }} {{ group.items.length === 1 ? 'title' : 'titles' }}</span>
          <div class="flex-1 h-px bg-white/8"></div>
        </div>

        <!-- Items grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
          <div
            v-for="item in group.items"
            :key="item.user_title_id"
            class="group relative rounded-2xl overflow-hidden border border-white/8 bg-white/2 hover:border-white/16 hover:bg-white/4 transition-all duration-300 cursor-pointer"
            @click="handleClick(item)"
          >
            <div class="relative overflow-hidden" style="aspect-ratio: 2/3">
              <img
                :src="item.poster_url || FALLBACK"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="handleImgError"
              />
              <div class="absolute top-2 left-2">
                <div v-if="item.type === 'movie'" class="w-6 h-6 rounded-full bg-red-cinema/90 flex items-center justify-center">
                  <PhFilmSlate :size="20" class="text-white" />
                </div>
                <div v-else class="w-6 h-6 rounded-full bg-gold/90 flex items-center justify-center">
                  <PhTelevision :size="20" class="text-black" />
                </div>
              </div>
              <div class="absolute top-1.5 right-1.5 bg-black/55 backdrop-blur-sm rounded-full p-0.5">
                <ScoreRingSmall :value="item.score" :size="40" />
              </div>
              <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-2.5">
                <div class="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-2 rounded-xl" style="background: rgba(212,175,55,0.85); color: #000">
                  Edit Rating
                </div>
              </div>
            </div>
            <div class="p-2.5">
              <p class="text-white text-[11px] font-semibold leading-tight truncate">{{ item.title }}</p>
              <p class="text-white/30 text-[10px] mt-0.5">
                {{ [item.studio ?? item.network].filter(Boolean).join(' · ') }}
              </p>
              <p v-if="item.genres" class="text-white/20 text-[9px] mt-1 truncate">
                {{ item.genres.split(',').slice(0, 2).map((g: string) => g.trim()).join(', ') }}
              </p>
              
              <!-- Ranking badge -->
              <div
                class="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center backdrop-blur-sm rounded-full border"
                :class="{
                  'bg-black border-gold text-gold': item.rank === 1 || item.rank === 2 || item.rank === 3,
                  'bg-slate-white border-red-cinema text-red-cinema': item.rank > 3
                }"
              >
                <span class="text-xs font-black">
                  {{ item.rank }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>