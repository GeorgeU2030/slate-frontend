<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhEnvelope, PhLock, PhEye, PhEyeSlash, PhCircleNotch } from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { authApi } from '@/api/auth'
import GoogleIcon from './GoogleIcon.vue'

const router = useRouter()
const auth   = useAuthStore()
const modal  = useAuthModalStore()

const email        = ref('')
const password     = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)

const fieldErrors = ref({ email: '', password: '' })

const isPending = computed(() => isSubmitting.value || auth.isLoading)

const validate = () => {
  fieldErrors.value = { email: '', password: '' }
  let valid = true
  if (!email.value) {
    fieldErrors.value.email = 'Email is required'; valid = false
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    fieldErrors.value.email = 'Enter a valid email'; valid = false
  }
  if (!password.value) {
    fieldErrors.value.password = 'Password is required'; valid = false
  } else if (password.value.length < 6) {
    fieldErrors.value.password = 'At least 8 characters'; valid = false
  }
  return valid
}

const onSubmit = async () => {
  if (!validate()) return
  isSubmitting.value = true
  auth.clearError()
  try {
    await auth.login({ email: email.value, password: password.value })
    modal.close()
    router.push('/home')
  } catch {
    // error is already in auth.error
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleAuth = () => {
  window.location.href = authApi.getGoogleLoginUrl()
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Google -->
    <button
      type="button"
      class="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
      @click="handleGoogleAuth"
    >
      <GoogleIcon />
      Continue with Google
    </button>

    <!-- Divider -->
    <div class="flex items-center gap-3">
      <span class="flex-1 h-px bg-white/8" />
      <span class="text-xs text-white/30 uppercase tracking-wider">or</span>
      <span class="flex-1 h-px bg-white/8" />
    </div>

    <!-- API error -->
    <div v-if="auth.error" class="rounded-lg bg-red-cinema/10 border border-red-cinema/20 px-3 py-2.5">
      <p class="text-xs text-red-cinema">{{ auth.error }}</p>
    </div>

    <!-- Form -->
    <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">
      <!-- Email -->
      <div class="flex flex-col gap-1.5">
        <label for="login-email" class="text-xs text-white/60 uppercase tracking-wider">Email</label>
        <div class="relative">
          <PhEnvelope :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="user@gmail.com"
            class="w-full pl-9 pr-4 h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-red-cinema/50 focus:bg-white/[0.07] transition-all"
            :class="{ 'border-red-cinema/50': fieldErrors.email }"
          />
        </div>
        <p v-if="fieldErrors.email" class="text-[11px] text-red-cinema">{{ fieldErrors.email }}</p>
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <label for="login-password" class="text-xs text-white/60 uppercase tracking-wider">Password</label>
        </div>
        <div class="relative">
          <PhLock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            id="login-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full pl-9 pr-10 h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-red-cinema/50 focus:bg-white/[0.07] transition-all"
            :class="{ 'border-red-cinema/50': fieldErrors.password }"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
            @click="showPassword = !showPassword"
          >
            <PhEye v-if="!showPassword" :size="14" />
            <PhEyeSlash v-else :size="14" />
          </button>
        </div>
        <p v-if="fieldErrors.password" class="text-[11px] text-red-cinema">{{ fieldErrors.password }}</p>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="isPending"
        class="w-full h-11 mt-1 rounded-xl bg-red-cinema hover:bg-red-cinema/85 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center transition-colors"
      >
        <PhCircleNotch v-if="isPending" :size="16" class="animate-spin" />
        <span v-else>Sign in</span>
      </button>
    </form>

    <!-- Switch -->
    <p class="text-center text-xs text-white/40">
      Don't have an account?
      <button
        type="button"
        class="text-red-cinema/80 hover:text-red-cinema transition-colors font-medium"
        @click="auth.clearError(); modal.setTab('register')"
      >
        Create one
      </button>
    </p>
  </div>
</template>