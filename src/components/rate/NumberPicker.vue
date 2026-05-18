<script setup lang="ts">
import { computed } from 'vue'
import { scoreColor, scoreAccent, scoreLabel, type CRITERIA } from '@/utils/scoreUtils'

const props = defineProps<{
  criterion: typeof CRITERIA[number]
  value: number | null
}>()

const emit = defineEmits<{ change: [v: number] }>()

const weight  = computed(() => Math.round(props.criterion.weight * 100))
const qColor  = computed(() => props.value !== null ? scoreColor(props.value) : null)
const qAccent = computed(() => props.value !== null ? scoreAccent(props.value) : null)

const btnStyle = (n: number) => {
  const isActive = props.value === n
  const isFilled = props.value !== null && n <= props.value
  const nColor   = scoreColor(n)
  return {
    height: '34px',
    background: isActive ? nColor : isFilled ? nColor + '22' : 'rgba(255,255,255,0.04)',
    color:      isActive ? '#fff'  : isFilled ? nColor        : 'rgba(255,255,255,0.20)',
    border:     isActive ? `1px solid ${nColor}` : isFilled ? `1px solid ${nColor}30` : '1px solid rgba(255,255,255,0.05)',
    transform:  isActive ? 'translateY(-2px)' : undefined,
    boxShadow:  isActive ? `0 4px 14px ${nColor}50` : undefined,
    fontWeight: isActive ? 900 : isFilled ? 700 : 600,
  }
}
</script>

<template>
  <div
    class="criterion-row transition-all duration-300"
    :style="{
      borderRadius: '16px',
      border: `1px solid ${qColor ? qColor + '35' : criterion.color + '20'}`,
      background: qAccent ?? 'rgba(255,255,255,0.015)',
      padding: '14px 18px',
    }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <div class="w-1 h-7 rounded-full shrink-0" :style="{ background: criterion.color }" />
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-black text-white tracking-tight">{{ criterion.label }}</span>
            <span
              class="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              :style="{ background: criterion.color + '25', color: criterion.color }"
            >
              {{ weight }}%
            </span>
          </div>
          <p class="text-[10px] text-white/28 mt-0.5 leading-tight">{{ criterion.sub }}</p>
        </div>
      </div>
      <!-- Big score -->
      <div class="text-right min-w-12">
        <span
          class="text-4xl font-black tabular-nums leading-none transition-colors duration-200"
          :style="{ color: qColor ?? 'rgba(255,255,255,0.08)' }"
        >
          {{ value !== null ? value : '·' }}
        </span>
        <p v-if="value !== null"
          class="text-[9px] font-semibold mt-0.5 transition-colors duration-200"
          :style="{ color: qColor ? qColor + '90' : 'transparent' }"
        >
          {{ scoreLabel(value) }}
        </p>
      </div>
    </div>

    <!-- Buttons 1-10 -->
    <div class="flex gap-1">
      <button
        v-for="n in Array.from({ length: 10 }, (_, i) => i + 1)"
        :key="n"
        :style="btnStyle(n)"
        class="flex-1 rounded-lg text-xs font-black transition-all duration-150 select-none active:scale-90 hover:opacity-90"
        @click="emit('change', n)"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>