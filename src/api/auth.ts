import { axiosInstance } from "@/api/axios"

export interface AuthTokens {
  access_token: string
  refresh_token: string
}
export interface LoginPayload {
  email: string
  password: string
}
export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export interface UserOut {
  id: string
  email: string
  full_name: string | null
  picture: string | null
  is_active: boolean
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post<AuthTokens>("/auth/login", payload)
    return data
  },
  register: async (payload: RegisterPayload): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post<AuthTokens>("/auth/register", payload)
    return data
  },
  refresh: async (refresh_token: string): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post<AuthTokens>("/auth/refresh", { refresh_token })
    return data
  },
  getGoogleLoginUrl: () => `${import.meta.env.VITE_API_URL}/auth/google`,
}