<script setup lang="ts">
import { computed } from 'vue'
import { scoreColor, scoreLabel } from '@/utils/scoreUtils'

const props = defineProps<{
  myScore: number | null
  globalScore: number
  raterCount?: number
}>()

const gColor       = computed(() => scoreColor(props.globalScore))
const diff         = computed(() => props.myScore !== null ? props.myScore - props.globalScore : null)
const diffPositive = computed(() => diff.value !== null && diff.value > 0)
const diffZero     = computed(() => diff.value !== null && Math.abs(diff.value) < 0.05)
</script>

<template>
  <div class="w-full rounded-2xl border border-white/8 overflow-hidden" style="background: rgba(255,255,255,0.02)">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-white/6">
      <span class="text-[9px] font-bold text-white/30 uppercase tracking-widest">Community Score</span>
      <span v-if="raterCount !== undefined" class="text-[9px] text-white/20">{{ raterCount }} ratings</span>
    </div>

    <!-- Content -->
    <div class="p-3 flex items-center gap-3">
      <!-- Avg big number -->
      <div class="flex flex-col items-center gap-0.5 shrink-0">
        <span class="text-3xl font-black tabular-nums leading-none" :style="{ color: gColor }">
          {{ globalScore.toFixed(1) }}
        </span>
        <span class="text-[8px] font-bold uppercase tracking-wider" :style="{ color: gColor + '70' }">
          {{ scoreLabel(globalScore) }}
        </span>
        <span class="text-[8px] text-white/20 mt-0.5">Avg</span>
      </div>

      <div class="w-px self-stretch bg-white/8 mx-1" />

      <!-- Bars + delta -->
      <div class="flex-1 flex flex-col gap-2">
        <div class="flex flex-col gap-1.5">
          <!-- Avg bar -->
          <div class="flex items-center gap-2">
            <span class="text-[8px] text-white/22 w-6 shrink-0">Avg</span>
            <div class="flex-1 h-1 rounded-full bg-white/6 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-600"
                :style="{ width: `${(globalScore / 10) * 100}%`, background: gColor }"
              />
            </div>
            <span class="text-[8px] font-bold tabular-nums w-5 text-right" :style="{ color: gColor }">
              {{ globalScore.toFixed(1) }}
            </span>
          </div>
          <!-- My bar -->
          <div v-if="myScore !== null" class="flex items-center gap-2">
            <span class="text-[8px] text-white/22 w-6 shrink-0">You</span>
            <div class="flex-1 h-1 rounded-full bg-white/6 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-600"
                :style="{ width: `${(myScore / 10) * 100}%`, background: scoreColor(myScore) }"
              />
            </div>
            <span class="text-[8px] font-bold tabular-nums w-5 text-right" :style="{ color: scoreColor(myScore) }">
              {{ myScore.toFixed(1) }}
            </span>
          </div>
        </div>

        <!-- Delta badge -->
        <div v-if="diff !== null && !diffZero" class="flex items-center gap-1.5">
          <span
            class="text-[9px] font-black px-2 py-0.5 rounded-full"
            :style="{
              background: diffPositive ? 'rgba(74,222,128,0.14)' : 'rgba(248,113,113,0.14)',
              color: diffPositive ? '#4ADE80' : '#F87171',
              border: `1px solid ${diffPositive ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
            }"
          >
            {{ diffPositive ? '+' : '' }}{{ diff!.toFixed(1) }} vs community
          </span>
        </div>
        <span v-else-if="diff !== null && diffZero" class="text-[9px] text-white/25 px-2">
          Matches avg
        </span>
      </div>
    </div>
  </div>
</template>