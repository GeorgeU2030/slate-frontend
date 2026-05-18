<script setup lang="ts">
import { computed } from 'vue'
import { useTrendingMovies, useTrendingTV } from '@/queries/useTrending'
import TrendingNavbar from '@/components/trending/TrendingNavbar.vue'
import HeroSection from '@/components/trending/HeroSection.vue'
import Carousel from '@/components/trending/carousel/Carousel.vue'
import FooterCTA from '@/components/trending/FooterCTA.vue'

const { data: movies,  isLoading: moviesLoading } = useTrendingMovies()
const { data: tvShows, isLoading: tvLoading }      = useTrendingTV()

const featured = computed(() => movies.value?.[0] ?? tvShows.value?.[0])
</script>

<template>
  <div class="min-h-screen bg-dark-black">
    <TrendingNavbar />
    <HeroSection :featured="featured" />
    <div class="mt-2">
      <Carousel title="Movies Trending"   icon="film" :items="movies"   :is-loading="moviesLoading" />
      <Carousel title="TV Shows Trending" icon="tv"   :items="tvShows"  :is-loading="tvLoading" />
    </div>
    <FooterCTA />
  </div>
</template>