<script setup lang="ts">
import { RouterView } from "vue-router"
import { useAppStatusStore } from "@/store/useAppStatusStore"
import Maintenance from "@/components/maintenance/Maintenance.vue";

const status = useAppStatusStore()
</script>

<template>
  <Maintenance v-if="status.isOffline || status.isServerDown" />
  <RouterView v-else />
</template>