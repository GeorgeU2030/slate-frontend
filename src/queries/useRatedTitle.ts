import { useQuery } from '@tanstack/vue-query'
import { axiosInstance } from '@/api/axios'
import type { RatedTitle } from '@/types/RatedTitle'
import { computed, type Ref } from 'vue'

const fetchRatedTitle = async (userTitleId: string): Promise<RatedTitle> => {
  const { data } = await axiosInstance.get<RatedTitle>(`/titles/${userTitleId}`)
  return data
}

export const useRatedTitle = (userTitleId: Ref<string | null>) =>
  useQuery<RatedTitle>({
    queryKey: computed(() => ['title', userTitleId.value]),
    queryFn: () => fetchRatedTitle(userTitleId.value!),
    enabled: computed(() => !!userTitleId.value),
    staleTime: 1000 * 60 * 2,
  })