import { defineStore } from 'pinia'
import { ref } from 'vue'

type AuthTab = 'login' | 'register'

export const useAuthModalStore = defineStore('authModal', () => {
  const isOpen    = ref(false)
  const activeTab = ref<AuthTab>('login')

  const openLogin    = () => { activeTab.value = 'login';    isOpen.value = true  }
  const openRegister = () => { activeTab.value = 'register'; isOpen.value = true  }
  const close        = () => { isOpen.value = false }
  const setTab       = (tab: AuthTab) => { activeTab.value = tab }

  return { isOpen, activeTab, openLogin, openRegister, close, setTab }
})