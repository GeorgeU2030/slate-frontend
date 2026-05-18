<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <span class="text-[9px] px-1.5 py-0.5 rounded-full border border-gold/30 text-gold/80 bg-gold/5 font-medium whitespace-nowrap">
    {{ name }}
  </span>
</template>