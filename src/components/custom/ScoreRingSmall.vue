<script setup lang="ts">
import { ref, watch, computed } from "vue"
import gsap from "gsap"
import { scoreColor } from "@/utils/scoreUtils"

const props = defineProps<{
  value: number
  size?: number
}>()

const size  = props.size ?? 44
const r     = 16
const circ  = 2 * Math.PI * r
const color = computed(() => scoreColor(props.value))
const displayValue = ref(props.value)

const circleRef = ref<SVGCircleElement | null>(null)
const textRef   = ref<HTMLSpanElement | null>(null)

const animate = (val: number) => {
  if (!circleRef.value || !textRef.value) return

  const targetDash = (val / 10) * circ

  // set initial correct state immediately
  displayValue.value = val
  textRef.value.textContent = val.toFixed(1)

  gsap.to(circleRef.value, {
    strokeDasharray: `${targetDash} ${circ}`,
    duration: 0.7,
    ease: "power3.out",
  })

  const obj = { val: displayValue.value }

  gsap.to(obj, {
    val,
    duration: 0.6,
    ease: "power2.out",
    onUpdate() {
      if (textRef.value) {
        textRef.value.textContent = obj.val.toFixed(1)
      }
    },
  })

  displayValue.value = val
}

watch(
  () => props.value,
  (val) => {
    requestAnimationFrame(() => {
      animate(val)
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg class="-rotate-90" viewBox="0 0 40 40" :width="size" :height="size">
      <circle
        cx="20" cy="20" :r="r"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="3"
      />
      <circle
        ref="circleRef"
        cx="20" cy="20" :r="r"
        fill="none"
        :stroke="color"
        stroke-width="3"
        stroke-linecap="round"
        :stroke-dasharray="`0 ${circ}`"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span
        ref="textRef"
        class="font-black tabular-nums leading-none"
        :style="{ fontSize: size >= 44 ? '11px' : '10px', color }"
      >
        0.0
      </span>
    </div>
  </div>
</template>