import { useQuery } from '@tanstack/vue-query'
import { axiosInstance } from '@/api/axios'
import type { UserOut } from '@/api/auth'

const fetchMe = async (): Promise<UserOut> => {
  const { data } = await axiosInstance.get<UserOut>('/auth/me')
  return data
}

export const useMe = () =>
  useQuery<UserOut>({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5,
  })