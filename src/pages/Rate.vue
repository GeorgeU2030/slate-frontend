<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import gsap from 'gsap'
import { useRateStore } from '@/store/useRateStore'
import { useRatedTitle } from '@/queries/useRatedTitle'
import { titlesApi } from '@/api/titles'
import { FALLBACK } from '@/utils/fallbackUtils'
import {
  CRITERIA, calcWeighted, emptyScores,
  scoreColor, scoresFromRated,
  type ScoreKey, type Scores,
} from '@/utils/scoreUtils'
import GlobalScoreWidget from '@/components/rate/GlobalScoreWidget.vue'
import NumberPicker from '@/components/rate/NumberPicker.vue'
import ScoreRingSmall from '@/components/custom/ScoreRingSmall.vue'
import type { RatedTitle } from '@/types/RatedTitle'
import { PhPlay, PhArrowLeft, PhPencilSimple } from '@phosphor-icons/vue'

const router      = useRouter()
const rateStore   = useRateStore()
const queryClient = useQueryClient()

const titleFromStore = rateStore.target

// Redirect if no target
if (!titleFromStore) {
  router.replace('/home')
}

const isEditing   = !!(titleFromStore && '_rated' in titleFromStore && titleFromStore._rated)
const userTitleId = computed(() => isEditing ? (titleFromStore as RatedTitle).user_title_id : null)

const { data: fetchedRated, isLoading: loadingRated } = useRatedTitle(userTitleId)

const globalScore = computed(() =>
  isEditing
    ? (fetchedRated.value?.global_score ?? (titleFromStore as RatedTitle)?.global_score ?? null)
    : null
)

const baseScores = computed<Scores>(() => {
  if (isEditing && fetchedRated.value) return scoresFromRated(fetchedRated.value)
  if (isEditing && titleFromStore)     return scoresFromRated(titleFromStore as RatedTitle)
  return emptyScores()
})

const editedScores = ref<Partial<Scores>>({})
const scores = computed<Scores>(() => ({ ...baseScores.value, ...editedScores.value }))

const isSubmitting = ref(false)
const success      = ref(false)
const error        = ref<string | null>(null)

const title       = computed(() => fetchedRated.value ?? titleFromStore!)
const weighted    = computed(() => calcWeighted(scores.value))
const filledCount = computed(() => CRITERIA.filter((c) => scores.value[c.key] !== null).length)
const allFilled   = computed(() => filledCount.value === 5)

const setScore = (key: ScoreKey, v: number) => {
  editedScores.value = { ...editedScores.value, [key]: v }
}

onMounted(() => {
  gsap.fromTo('.rate-header',    { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
  gsap.fromTo('.info-strip',     { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.05 })
  gsap.fromTo('.scores-strip',   { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.2 })
  gsap.fromTo('.criterion-row',  { opacity: 0, y: 8  }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.05, delay: 0.3 })
  gsap.fromTo('.submit-strip',   { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.5 })
})

const handleSubmit = async () => {
  if (!allFilled.value || isSubmitting.value) return
  isSubmitting.value = true
  error.value = null

  const payload = {
    story_score:     scores.value.story_score!,
    acting_score:    scores.value.acting_score!,
    direction_score: scores.value.direction_score!,
    technical_score: scores.value.technical_score!,
    impact_score:    scores.value.impact_score!,
  }

  try {
    if (isEditing && userTitleId.value) {
      await titlesApi.update(userTitleId.value, payload)
      await queryClient.invalidateQueries({ queryKey: ['title', userTitleId.value] })
    } else {
      await titlesApi.rate({ tmdb_id: title.value.tmdb_id, type: title.value.type, ...payload })
    }

    await queryClient.invalidateQueries({ queryKey: ['my-titles'] })
    await queryClient.invalidateQueries({ queryKey: ['search-mine'] })

    editedScores.value = {}
    success.value = true

    gsap.fromTo('.submit-strip',
      { scale: 1 },
      { scale: 1.012, duration: 0.1, yoyo: true, repeat: 1,
        onComplete: () => setTimeout(() => {
          rateStore.clearTarget()
          router.push('/home')
        }, 900)
      }
    )
  } catch {
    error.value = 'Something went wrong. Please try again.'
    isSubmitting.value = false
  }
}

const submitStyle = computed(() => ({
  background: success.value    ? 'rgba(108,255,184,0.15)'
            : allFilled.value  ? '#E50914'
            : 'rgba(255,255,255,0.05)',
  color: success.value   ? '#6CFFB8'
       : allFilled.value ? '#fff'
       : 'rgba(255,255,255,0.18)',
  border: success.value   ? '1px solid rgba(108,255,184,0.3)'
        : allFilled.value ? '1px solid transparent'
        : '1px solid rgba(255,255,255,0.07)',
  boxShadow: allFilled.value && !success.value ? '0 0 20px rgba(229,9,20,0.25)' : undefined,
  cursor: !allFilled.value || isSubmitting.value || success.value ? 'not-allowed' : 'pointer',
}))
</script>

<template>
  <div v-if="title" ref="pageRef" class="min-h-screen" style="background: #0c0c0c">

    <!-- Ambient backdrop -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <img
        v-if="title.backdrop_url || title.poster_url"
        :src="title.backdrop_url || title.poster_url"
        alt=""
        class="w-full h-full object-cover"
        style="opacity: 0.05; filter: blur(80px) saturate(2)"
      />
      <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(12,12,12,0.5) 0%, #0c0c0c 60%)" />
    </div>

    <!-- Navbar -->
    <header
      class="rate-header sticky top-0 z-50 border-b border-white/6"
      style="background: rgba(10,10,10,0.96); backdrop-filter: blur(20px)"
    >
      <div class="max-w-screen-2xl mx-auto px-5 sm:px-8 h-13 flex items-center justify-between gap-6">
    
        <!-- LEFT -->
        <div class="flex items-center gap-3 shrink-0">
    
          <!-- Back -->
          <button
            class="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-semibold transition-colors"
            @click="router.back()"
          >
            <PhArrowLeft :size="14" weight="bold" />
            Back
          </button>
    
          <div class="h-4 w-px bg-white/10" />
    
          <!-- Brand -->
          <div class="flex items-center gap-1.5 bg-white rounded-full px-3 py-2">
            <img src="/slate.png" alt="Slate" class="h-5 w-5" />
            <span class="text-red-cinema font-black text-base tracking-tight leading-none">
              Slate
            </span>
          </div>
        </div>
    
        <!-- CENTER -->
        <div class="flex items-center gap-3">
          <span
            v-if="isEditing"
            class="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gold/15 text-gold"
          >
            <PhPencilSimple :size="12" weight="bold" />
            Editing
          </span>
    
          <span class="text-[11px] text-white/20 truncate hidden sm:block">
            {{ isEditing ? 'Update' : 'Rate' }} ·
            <span class="text-white/40">{{ title.title }}</span>
          </span>
        </div>
    
      </div>
    </header>

    <!-- Loading overlay -->
    <div v-if="loadingRated" class="fixed inset-0 z-30 flex items-center justify-center bg-[#0c0c0c]/80 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-3">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        <p class="text-white/30 text-xs">Loading your scores…</p>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-5 pb-28">

      <!-- Info strip -->
      <div class="info-strip flex items-start gap-5 mb-6 pb-6 border-b border-white/6">

        <!-- Poster -->
        <div class="shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style="width: 180px; aspect-ratio: 2/3">
          <img
            :src="title.poster_url || FALLBACK"
            :alt="title.title"
            class="w-full h-full object-cover"
            @error="($event.target as HTMLImageElement).src = FALLBACK"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0 flex flex-col gap-3 pt-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="text-[9px] sm:text-xs font-black tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
              :style="{
                background: title.type === 'movie' ? 'rgba(229,9,20,0.15)' : 'rgba(212,175,55,0.15)',
                color: title.type === 'movie' ? '#E50914' : '#D4AF37',
              }"
            >
              {{ title.type === 'movie' ? 'Movie' : 'TV Show' }}
            </span>
            <span v-if="title.release_year" class="text-white/35 text-[10px] sm:text-sm font-semibold">{{ title.release_year }}</span>
            <template v-if="title.genres">
              <span class="text-white/15">·</span>
              <span class="text-white/25 text-[10px] sm:text-sm">
                {{ title.genres.split(',').slice(0, 3).map((g: string) => g.trim()).join(', ') }}
              </span>
            </template>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
            {{ title.title }}
          </h1>

          <div class="flex items-center gap-2 flex-wrap">
            <span v-if="title.studio" class="text-xs sm:text-base text-white/30 font-medium">{{ title.studio }}</span>
            <span v-else-if="title.network" class="text-[11px] sm:text-sm text-white/30 font-medium">{{ title.network }}</span>
            <div v-if="title.watch_providers" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5">
              <span class="text-[11px] sm:text-sm text-white/50 font-semibold flex gap-2 items-center">
                <PhPlay class="text-xs" :stroke-width="1.5" />
                {{ title.watch_providers }}
              </span>
            </div>
          </div>

          <p v-if="title.overview" class="text-white/50 w-3/4 text-[10px] sm:text-[13px] leading-relaxed line-clamp-5">
            {{ title.overview }}
          </p>
        </div>

        <!-- Desktop: score panels -->
        <div class="shrink-0 hidden md:flex flex-col gap-3" style="width: 200px">
          <div class="rounded-2xl border border-white/8 p-4 flex items-center gap-3" style="background: rgba(255,255,255,0.025)">
            <ScoreRingSmall :value="weighted || 0" />
            <div class="flex flex-col gap-2 flex-1">
              <p class="text-[9px] text-white/25 uppercase tracking-wider font-bold">Your Score</p>
              <div v-for="c in CRITERIA" :key="c.key" class="flex items-center gap-1.5">
                <span class="text-[8px] text-white/20 w-10 shrink-0">{{ c.label }}</span>
                <div class="flex-1 h-0.5 rounded-full bg-white/6 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-400"
                    :style="{
                      width: scores[c.key] !== null ? `${(scores[c.key]! / 10) * 100}%` : '0%',
                      background: scores[c.key] !== null ? scoreColor(scores[c.key]!) : 'transparent',
                    }"
                  />
                </div>
                <span class="text-[8px] font-bold w-3 text-right tabular-nums shrink-0"
                  :style="{ color: scores[c.key] !== null ? scoreColor(scores[c.key]!) : 'rgba(255,255,255,0.1)' }"
                >
                  {{ scores[c.key] ?? '·' }}
                </span>
              </div>
            </div>
          </div>
          <GlobalScoreWidget
            v-if="isEditing && globalScore !== null"
            :my-score="weighted"
            :global-score="globalScore"
          />
        </div>
      </div>

      <!-- Scores strip -->
      <div class="scores-strip flex flex-col gap-2">
        <div class="flex items-center justify-between mb-1">
          <p class="text-[11px] text-white/30 font-medium">
            {{ isEditing ? 'Update each dimension · 1 to 10' : 'Score each dimension · 1 to 10' }}
          </p>
          <span class="text-[10px] font-bold tabular-nums"
            :style="{ color: allFilled ? '#4ADE80' : 'rgba(255,255,255,0.25)' }"
          >
            {{ filledCount }} / 5 rated
          </span>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <NumberPicker
            v-for="c in CRITERIA"
            :key="c.key"
            :criterion="c"
            :value="scores[c.key]"
            @change="setScore(c.key, $event)"
          />
        </div>

        <p v-if="error" class="text-red-cinema text-xs text-center py-2 mt-1">{{ error }}</p>
      </div>

      <!-- Mobile score panels -->
      <div class="md:hidden mt-4 flex flex-col gap-3">
        <div class="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/2">
          <ScoreRingSmall :value="weighted || 0" />
          <div class="flex flex-col gap-1.5 flex-1">
            <p class="text-[9px] text-white/25 uppercase tracking-wider">Your Score</p>
            <div v-for="c in CRITERIA" :key="c.key" class="flex items-center gap-2">
              <span class="text-[9px] text-white/20 w-12 shrink-0">{{ c.label }}</span>
              <div class="flex-1 h-1 rounded-full bg-white/6 overflow-hidden">
                <div class="h-full rounded-full"
                  :style="{
                    width: scores[c.key] !== null ? `${(scores[c.key]! / 10) * 100}%` : '0%',
                    background: scores[c.key] !== null ? scoreColor(scores[c.key]!) : 'transparent',
                  }"
                />
              </div>
              <span class="text-[9px] font-bold w-4 text-right tabular-nums"
                :style="{ color: scores[c.key] !== null ? scoreColor(scores[c.key]!) : 'rgba(255,255,255,0.12)' }"
              >
                {{ scores[c.key] ?? '·' }}
              </span>
            </div>
          </div>
        </div>
        <GlobalScoreWidget
          v-if="isEditing && globalScore !== null"
          :my-score="weighted"
          :global-score="globalScore"
        />
      </div>
    </div>

    <!-- Submit strip -->
    <div
      class="submit-strip fixed bottom-0 left-0 right-0 z-20 border-t border-white/5"
      style="background: rgba(10,10,10,0.97); backdrop-filter: blur(24px)"
    >
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-4">
        <!-- Weights legend (desktop) -->
        <div class="hidden md:flex items-center gap-3 flex-1">
          <div v-for="c in CRITERIA" :key="c.key" class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full" :style="{ background: c.color }" />
            <span class="text-[10px] text-white/22">
              {{ c.label }}
              <span :style="{ color: c.color + '70' }">{{ Math.round(c.weight * 100) }}%</span>
            </span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="flex-1 md:flex-none md:w-36 h-1 rounded-full bg-white/6 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :style="{ width: `${(filledCount / 5) * 100}%`, background: 'linear-gradient(90deg, #6C8EFF, #E50914)' }"
          />
        </div>

        <!-- Submit button -->
        <button
          :disabled="!allFilled || isSubmitting || success"
          :style="submitStyle"
          class="flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-black transition-all duration-300 shrink-0"
          @click="handleSubmit"
        >
          <template v-if="isSubmitting">
            <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving…
          </template>
          <template v-else-if="success">
            ✓ Saved!
          </template>
          <template v-else>
            {{ isEditing ? 'Update Rating' : 'Submit Rating' }}
            <span v-if="!allFilled" class="opacity-40 text-xs font-normal ml-1">({{ filledCount }}/5)</span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>