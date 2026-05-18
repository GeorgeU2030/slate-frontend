import axios from "axios"
import { useAuthStore } from "@/store/useAuthStore"
import { useAppStatusStore } from "@/store/useAppStatusStore"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

// Attach token
axiosInstance.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

// Refresh on 401
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {

    const status = useAppStatusStore()

    if (!error.response) {
      status.isOffline = true
      return Promise.reject(error)
    }

    if (error.response.status >= 500) {
      status.isServerDown = true
    }
    
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return axiosInstance(original)
          })
          .catch((err) => Promise.reject(err))
      }
      original._retry = true
      isRefreshing = true
      try {
        const auth = useAuthStore()
        await auth.refreshAccessToken()
        processQueue(null, auth.accessToken)
        original.headers.Authorization = `Bearer ${auth.accessToken}`
        return axiosInstance(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)