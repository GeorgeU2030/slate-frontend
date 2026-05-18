<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'vue-router'
import HomeNav from '@/components/home/HomeNav.vue'
import TrendingHero from '@/components/home/TrendingHero.vue'
import SearchSection from '@/components/home/SearchSection.vue'
import CollectionSection from '@/components/home/CollectionSection.vue'

export type HomeSection = 'trending' | 'search' | 'collection'

const authStore = useAuthStore()
const router = useRouter()
const activeSection = ref<HomeSection>('trending')

onMounted(() => {
  gsap.from('.home-reveal', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.08,
  })
})

const handleSectionChange = (section: HomeSection) => {
  activeSection.value = section
  setTimeout(() => {
    gsap.fromTo(
      '.section-content',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    )
  }, 10)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/trending')
}
</script>

<template>
  <div ref="pageRef" class="min-h-screen bg-[#0c0c0c]">
    <HomeNav
      :active-section="activeSection"
      @section-change="handleSectionChange"
      @logout="handleLogout"
    />
    <main class="section-content home-reveal">
      <TrendingHero v-if="activeSection === 'trending'" />
      <SearchSection v-else-if="activeSection === 'search'" />
      <CollectionSection v-else-if="activeSection === 'collection'" />
    </main>
  </div>
</template>