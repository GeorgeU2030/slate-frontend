import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { authApi, type LoginPayload, type RegisterPayload } from "@/api/auth"
import { extractErrorMessage } from "@/utils/errorUtils"

export const useAuthStore = defineStore(
  "auth",
  () => {
    // State
    const accessToken  = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const isLoading    = ref(false)
    const error        = ref<string | null>(null)

    // Getter
    const isAuthenticated = computed(() => !!accessToken.value)

    // Actions
    const setTokens = (at: string, rt: string) => {
      accessToken.value  = at
      refreshToken.value = rt
    }

    const clearError = () => { error.value = null }

    const logout = () => {
      accessToken.value  = null
      refreshToken.value = null
      error.value        = null
    }

    const login = async (payload: LoginPayload) => {
      isLoading.value = true
      error.value     = null
      try {
        const tokens = await authApi.login(payload)
        setTokens(tokens.access_token, tokens.refresh_token)
      } catch (err: unknown) {
        error.value = extractErrorMessage(err, "Invalid email or password")
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const register = async (payload: RegisterPayload) => {
      isLoading.value = true
      error.value     = null
      try {
        const tokens = await authApi.register(payload)
        setTokens(tokens.access_token, tokens.refresh_token)
      } catch (err: unknown) {
        error.value = extractErrorMessage(err, "Could not create account")
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const refreshAccessToken = async () => {
      if (!refreshToken.value) {
        logout()
        throw new Error("No refresh token")
      }
      try {
        const tokens = await authApi.refresh(refreshToken.value)
        setTokens(tokens.access_token, tokens.refresh_token)
      } catch {
        logout()
        throw new Error("Session expired")
      }
    }

    return {
      accessToken, refreshToken, isLoading, error,
      isAuthenticated,
      setTokens, clearError, logout, login, register, refreshAccessToken,
    }
  },
  {
    persist: {
      pick: ["accessToken", "refreshToken"],
    },
  }
)