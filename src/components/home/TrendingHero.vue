<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { PhFilmSlate, PhTelevision, PhPlusCircle } from '@phosphor-icons/vue'
import { useTrendingMovies, useTrendingTV } from '@/queries/useTrending'
import { useRateStore } from '@/store/useRateStore'
import { FALLBACK } from '@/utils/fallbackUtils'
import type { Title } from '@/types/Title'

const { data: movies, isLoading: moviesLoading } = useTrendingMovies()
const { data: shows, isLoading: tvLoading } = useTrendingTV()

const featured  = computed(() => movies.value?.[0] ?? shows.value?.[0])
const router    = useRouter()
const rateStore = useRateStore()

const goToRate = (item: Title) => {
  rateStore.setTarget(item)
  router.push('/rate')
}

const handleImgError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = FALLBACK
}
</script>

<template>
  <div class="flex flex-col">
    <div v-if="moviesLoading" class="w-full bg-white/3 animate-pulse" style="height: 420px" />

    <div v-else-if="featured" class="relative w-full overflow-hidden" style="height: 420px">
      <div class="absolute inset-0">
        <img
          :src="featured.backdrop_url || featured.poster_url || FALLBACK"
          alt=""
          class="w-full h-full object-cover object-top scale-105"
          style="filter: brightness(0.45)"
          @error="handleImgError"
        />
        <div class="absolute inset-0 bg-linear-to-r from-[#0c0c0c] via-[#0c0c0c]/60 to-transparent" />
        <div class="absolute inset-0 bg-linear-to-t from-[#0c0c0c] via-transparent to-transparent" />
      </div>

      <div class="relative h-full flex items-end pb-10 px-8 max-w-screen-2xl mx-auto">
        <div class="flex items-end gap-6">
          <div
            class="hidden sm:block w-28 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            style="aspect-ratio: 2/3"
          >
            <img
              :src="featured.poster_url || FALLBACK"
              :alt="featured.title"
              class="w-full h-full object-cover"
              @error="handleImgError"
            />
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-red-cinema">
                #1 Trending
              </span>
              <span v-if="featured.release_year" class="text-white/30 text-xs">
                {{ featured.release_year }}
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
              {{ featured.title }}
            </h1>
            <div v-if="featured.genres" class="flex gap-2 flex-wrap">
              <span
                v-for="g in featured.genres.split(',').slice(0, 3)"
                :key="g"
                class="text-[10px] px-2.5 py-1 rounded-full bg-white/8 text-white/50 border border-white/10"
              >
                {{ g.trim() }}
              </span>
            </div>
            <div class="flex items-center gap-3 mt-1">
                <button
                  class="flex items-center gap-2 bg-red-cinema hover:bg-[#c40812] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                  @click="featured && goToRate(featured)"
                >
                  <PhPlusCircle :size="13" />
                  Add to Collection
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-8 py-8 max-w-screen-2xl mx-auto w-full">
      <div class="px-5 sm:px-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-0.5 h-5 rounded-full bg-red-cinema" />
          <PhFilmSlate :size="14" class="text-red-cinema" />
          <h2 class="text-sm font-bold text-white/80 tracking-wide">Movies Trending</h2>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-3" style="scrollbar-width: none">
          <template v-if="moviesLoading">
            <div v-for="i in 8" :key="i" class="shrink-0 w-32 sm:w-36 animate-pulse">
              <div class="rounded-xl bg-white/5" style="aspect-ratio: 2/3" />
              <div class="mt-2 h-2.5 w-3/4 rounded bg-white/5" />
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, i) in (movies ?? []).slice(0, 12)"
              :key="item.tmdb_id"
              class="shrink-0 w-32 sm:w-36 group cursor-pointer"
            >
              <div class="relative rounded-xl overflow-hidden border border-white/8 shadow-lg" style="aspect-ratio: 2/3">
                <img
                  :src="item.poster_url || FALLBACK"
                  :alt="item.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  @error="handleImgError"
                />
                <div class="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <span :class="['text-[10px] font-black', i + 1 <= 3 ? 'text-gold' : 'text-white/50']">
                    {{ i + 1 }}
                  </span>
                </div>
                <div class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <button
                      class="w-full flex items-center justify-center gap-1.5 bg-red-cinema/90 hover:bg-red-cinema text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors"
                      @click.stop="goToRate(item)"
                    >
                      <PhPlusCircle :size="10" /> Rate
                    </button>
                </div>
              </div>
              <p class="mt-2 text-[11px] text-white/55 font-medium truncate leading-tight">{{ item.title }}</p>
              <p v-if="item.release_year" class="text-[10px] text-white/25">{{ item.release_year }}</p>
            </div>
          </template>
        </div>
      </div>

      <div class="px-5 sm:px-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-0.5 h-5 rounded-full bg-gold" />
          <PhTelevision :size="14" class="text-gold" />
          <h2 class="text-sm font-bold text-white/80 tracking-wide">TV Shows Trending</h2>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-3" style="scrollbar-width: none">
          <template v-if="tvLoading">
            <div v-for="i in 8" :key="i" class="shrink-0 w-32 sm:w-36 animate-pulse">
              <div class="rounded-xl bg-white/5" style="aspect-ratio: 2/3" />
              <div class="mt-2 h-2.5 w-3/4 rounded bg-white/5" />
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, i) in (shows ?? []).slice(0, 12)"
              :key="item.tmdb_id"
              class="shrink-0 w-32 sm:w-36 group cursor-pointer"
            >
              <div class="relative rounded-xl overflow-hidden border border-white/8 shadow-lg" style="aspect-ratio: 2/3">
                <img
                  :src="item.poster_url || FALLBACK"
                  :alt="item.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  @error="handleImgError"
                />
                <div class="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <span :class="['text-[10px] font-black', i + 1 <= 3 ? 'text-gold' : 'text-white/50']">
                    {{ i + 1 }}
                  </span>
                </div>
                <div class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <button
                      class="w-full flex items-center justify-center gap-1.5 bg-gold/90 hover:bg-gold text-black text-[10px] font-bold py-1.5 rounded-lg transition-colors"
                      @click.stop="goToRate(item)"
                    >
                      <PhPlusCircle :size="10" /> Rate
                    </button>
                </div>
              </div>
              <p class="mt-2 text-[11px] text-white/55 font-medium truncate leading-tight">{{ item.title }}</p>
              <p v-if="item.release_year" class="text-[10px] text-white/25">{{ item.release_year }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>