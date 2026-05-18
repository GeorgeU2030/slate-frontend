<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'
import { PhX } from '@phosphor-icons/vue'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const modal      = useAuthModalStore()
const contentRef = ref<HTMLDivElement | null>(null)
const formRef    = ref<HTMLDivElement | null>(null)

watch(() => modal.isOpen, (open) => {
  if (!open || !contentRef.value) return
  gsap.fromTo(
    contentRef.value,
    { opacity: 0, scale: 0.96, y: 12 },
    { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
  )
})

watch(() => modal.activeTab, () => {
  if (!formRef.value) return
  gsap.fromTo(
    formRef.value,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' }
  )
})
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="modal.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.75); backdrop-filter: blur(4px)"
        @click.self="modal.close()"
      >
        <!-- Panel -->
        <div
          ref="contentRef"
          class="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/8"
          style="
            background: linear-gradient(145deg, #1a1a1a 0%, #141414 60%, #1f1a1a 100%);
            box-shadow: 0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06);
          "
          @click.stop
        >
          <!-- Top glow -->
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
            style="background: linear-gradient(90deg, transparent, rgba(229,9,20,0.4), transparent)"
          />

          <!-- Close -->
          <button
            class="absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
            @click="modal.close()"
          >
            <PhX :size="15" />
          </button>

          <!-- Header -->
          <div class="px-8 pt-8 pb-6">
            <div class="flex items-center gap-1.5 mb-6">
              <span class="text-red-cinema font-black text-xl tracking-tight">Slate</span>
            </div>
            <h2 class="text-white font-bold text-2xl leading-tight mb-1">
              {{ modal.activeTab === 'login' ? 'Welcome back' : 'Create your account' }}
            </h2>
            <p class="text-white/40 text-sm">
              {{ modal.activeTab === 'login'
                ? 'Sign in to track, rate and discover films.'
                : 'Join thousands of film lovers on Slate.' }}
            </p>
          </div>

          <!-- Tab switcher -->
          <div class="px-8 mb-6">
            <div class="flex rounded-lg bg-white/4 p-0.5 border border-white/6">
              <button
                v-for="tab in (['login', 'register'] as const)"
                :key="tab"
                :class="[
                  'flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-200',
                  modal.activeTab === tab
                    ? 'bg-red-cinema text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70'
                ]"
                @click="modal.setTab(tab)"
              >
                {{ tab === 'login' ? 'Sign in' : 'Register' }}
              </button>
            </div>
          </div>

          <div ref="formRef" class="px-8 pb-8">
            <LoginForm    v-if="modal.activeTab === 'login'" />
            <RegisterForm v-else />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>