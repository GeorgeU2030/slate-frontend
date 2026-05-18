<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PhMagnifyingGlass, PhXCircle, PhCircleNotch,
  PhFilmSlate, PhTelevision, PhPlusCircle, PhStar
} from '@phosphor-icons/vue'
import { useSearchMine, useSearchTmdb } from '@/queries/useHome'
import { useRouter } from 'vue-router'
import { FALLBACK } from '@/utils/fallbackUtils'
import ScoreRingSmall from '@/components/custom/ScoreRingSmall.vue'
import type { Title } from '@/types/Title'
import type { RatedTitle } from '@/types/RatedTitle'
import { useRateStore } from '@/store/useRateStore'

type SearchResult = (Title | RatedTitle) & { _rated: boolean }

const router = useRouter()
const rateStore = useRateStore()

const inputValue = ref('')
const query = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const handleChange = (value: string) => {
  inputValue.value = value
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!value.trim()) { query.value = ''; return }
  debounceTimer = setTimeout(() => { query.value = value.trim() }, 380)
}

const handleClear = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  inputValue.value = ''
  query.value = ''
}

const { data: myResults, isFetching: myFetching } = useSearchMine(query)
const { data: tmdbResults, isFetching: tmdbFetching } = useSearchTmdb(query)

const isSearching = computed(() => query.value.length >= 2 && (myFetching.value || tmdbFetching.value))

const allResults = computed<SearchResult[]>(() => {
  const ratedKeys = new Set((myResults.value ?? []).map((r) => `${r.tmdb_id}-${r.type}`))
  const filteredTmdb = (tmdbResults.value ?? []).filter((t) => !ratedKeys.has(`${t.tmdb_id}-${t.type}`))
  return [
    ...(myResults.value ?? []).map((r): SearchResult => ({ ...r, _rated: true })),
    ...filteredTmdb.map((t): SearchResult => ({ ...t, _rated: false })),
  ]
})

const filteredTmdbCount = computed(() => {
  const ratedKeys = new Set((myResults.value ?? []).map((r) => `${r.tmdb_id}-${r.type}`))
  return (tmdbResults.value ?? []).filter((t) => !ratedKeys.has(`${t.tmdb_id}-${t.type}`)).length
})

const handleRate = (item: SearchResult) => {
  rateStore.setTarget(item)
  router.push('/rate')
}

const handleImgError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = FALLBACK
}
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-5 sm:px-8 py-8">
    <div class="max-w-2xl mb-8">
      <h2 class="text-2xl font-black text-white mb-1 tracking-tight">Search</h2>
      <p class="text-white/30 text-sm mb-5">Find movies and TV shows to rate and track</p>
      <div class="relative">
        <PhMagnifyingGlass :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          :value="inputValue"
          placeholder="Search movies & TV shows..."
          class="w-full pl-11 pr-11 py-3.5 bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-2xl text-sm focus:outline-none focus:border-red-cinema/50 focus:bg-white/[0.07] transition-all"
          @input="handleChange(($event.target as HTMLInputElement).value)"
        />
        <button v-if="inputValue" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors" @click="handleClear">
          <PhXCircle :size="14" />
        </button>
        <PhCircleNotch v-else-if="isSearching" :size="14" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 animate-spin" />
      </div>
    </div>

    <div v-if="query.length >= 2 && !isSearching && allResults.length === 0" class="text-center py-20">
      <p class="text-white/20 text-sm">
        No results for "<span class="text-white/40">{{ query }}</span>"
      </p>
    </div>

    <div v-if="allResults.length > 0">
      <p v-if="(myResults?.length ?? 0) > 0" class="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">
        {{ myResults!.length }} in your collection · {{ filteredTmdbCount }} from TMDB
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
        <div
          v-for="item in allResults"
          :key="`${item.tmdb_id}-${item.type}`"
          :class="[
            'group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer',
            item._rated
              ? 'border-white/12 bg-white/2.5'
              : 'border-white/8 bg-white/2 hover:border-white/16 hover:bg-white/4'
          ]"
        >
          <div class="relative overflow-hidden" style="aspect-ratio: 2/3">
            <img
              :src="item.poster_url || FALLBACK"
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="handleImgError"
            />
            <div class="absolute bottom-2 left-2">
              <div v-if="item.type === 'movie'" class="flex items-center gap-1 bg-red-cinema/60 backdrop-blur-sm text-white/70 text-sm font-bold px-1.5 py-0.5 rounded-full border border-white/10">
                <PhFilmSlate :size="16" /> Movie
              </div>
              <div v-else class="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-gold/80 text-sm font-bold px-1.5 py-0.5 rounded-full border border-white/10">
                <PhTelevision :size="16" /> TV
              </div>
            </div>
         
            <div v-if="item._rated && (item as RatedTitle).global_score !== undefined" class="absolute top-2 right-2 bg-black/55 backdrop-blur-sm rounded-full p-0.5">
              <ScoreRingSmall v-if="(item as RatedTitle).global_score !== undefined" :value="(item as RatedTitle).global_score" :size="44" />
            </div>
           
            <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-2.5">
              <button
                class="w-full flex items-center justify-center gap-1.5 text-white text-[10px] font-bold py-2 rounded-xl transition-colors"
                :style="{ background: item._rated ? 'rgba(212,175,55,0.85)' : 'rgba(229,9,20,0.90)', color: item._rated ? '#000' : '#fff' }"
                @click.stop="handleRate(item)"
              >
                <template v-if="item._rated"><PhStar :size="10" fill="currentColor" /> Edit Rating</template>
                <template v-else><PhPlusCircle :size="10" /> Rate</template>
              </button>
            </div>
          </div>
          <div class="p-2.5">
            <p class="text-white text-sm font-semibold leading-tight truncate">{{ item.title }}</p>
            <p class="text-white/40 text-[10px] mt-0.5">
              {{ [item.release_year, (item as any).studio ?? (item as any).network].filter(Boolean).join(' · ') }}
            </p>
            <p v-if="item.genres" class="text-white/20 text-[9px] mt-1 truncate">
              {{ item.genres.split(',').slice(0, 2).map((g: string) => g.trim()).join(', ') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="query.length < 2" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/8" style="background: rgba(255,255,255,0.03)">
        <PhMagnifyingGlass :size="28" class="text-white/15" />
      </div>
      <p class="text-white/20 text-sm">Type at least 2 characters to search</p>
    </div>
  </div>
</template>