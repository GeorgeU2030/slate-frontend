<script setup lang="ts">
import {
  PhSignOut, PhTrendUp, PhMagnifyingGlass, PhStack
} from '@phosphor-icons/vue'
import type { HomeSection } from '@/pages/Home.vue'
import type { Component } from 'vue'
import { useMe } from '@/queries/useMe'

const props = defineProps<{ activeSection: HomeSection }>()
const emit  = defineEmits<{
  sectionChange: [section: HomeSection]
  logout: []
}>()

const { data: user } = useMe()

const TABS: { id: HomeSection; label: string; icon: Component }[] = [
  { id: 'trending',   label: 'Trending',      icon: PhTrendUp },
  { id: 'search',     label: 'Search',        icon: PhMagnifyingGlass },
  { id: 'collection', label: 'My Collection', icon: PhStack },
]

const tabClass = (id: HomeSection) => {
  const base = 'relative flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs font-semibold transition-all duration-200'
  if (props.activeSection === id) {
    if (id === 'trending')   return `${base} bg-red-cinema text-white`
    if (id === 'collection') return `${base} bg-gold text-black`
    return `${base} bg-white/12 text-white`
  }
  return `${base} text-white/35 hover:text-white/65 hover:bg-white/5`
}

</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-white/6"
    style="background: rgba(10,10,10,0.96); backdrop-filter: blur(20px)"
  >
    <div class="max-w-screen-2xl mx-auto px-5 sm:px-8 h-13 flex items-center justify-between gap-6">

      <!-- Logo -->
      <div class="flex items-center gap-2 shrink-0">
        <div class="flex items-center gap-1.5 bg-white rounded-full px-3 py-2">
          <img src="/slate.png" alt="Slate" class="h-6 w-6" />
          <span class="text-red-cinema font-black text-base tracking-tight leading-none">Slate</span>
        </div>
      </div>

      <!-- Tabs -->
      <nav class="flex items-center gap-0.5 bg-white/4 rounded-xl p-0.5 border border-white/[0.07]">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          :class="tabClass(tab.id)"
          @click="emit('sectionChange', tab.id)"
        >
          <component :is="tab.icon" :size="14" weight="bold" />
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
      </nav>

      <!-- Right: user + logout -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- User info -->
        <div v-if="user" class="hidden sm:flex items-center gap-2.5">
          <!-- Name or email -->
          <span class="text-white/50 text-xs truncate max-w-28">
            {{ user.full_name ?? user.email }}
          </span>
        </div>

        <!-- Divider -->
        <div v-if="user" class="hidden sm:block h-4 w-px bg-white/10" />

        <!-- Sign out -->
        <button
          class="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"
          @click="emit('logout')"
        >
          <PhSignOut :size="14" weight="bold" />
          <span class="hidden sm:inline">Sign out</span>
        </button>
      </div>

    </div>
  </header>
</template>