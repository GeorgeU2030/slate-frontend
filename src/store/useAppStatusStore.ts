import { defineStore } from "pinia"

export const useAppStatusStore = defineStore("appStatus", {
  state: () => ({
    isOffline: false,
    isServerDown: false,
  }),
})