import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Title } from '@/types/Title'
import type { RatedTitle } from '@/types/RatedTitle'

export type RateTarget = (Title | RatedTitle) & { _rated?: boolean }

export const useRateStore = defineStore('rate', () => {
  const target = ref<RateTarget | null>(null)

  const setTarget = (item: RateTarget) => { target.value = item }
  const clearTarget = () => { target.value = null }

  return { target, setTarget, clearTarget }
})