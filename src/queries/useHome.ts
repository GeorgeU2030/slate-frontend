import { useQuery } from "@tanstack/vue-query"
import { axiosInstance } from "@/api/axios"
import type { RatedTitle } from "@/types/RatedTitle"
import type { Title } from "@/types/Title"
import type { Ref } from "vue"
import { computed } from "vue"

// My rated titles
const fetchMyTitles = async (): Promise<RatedTitle[]> => {
  const { data } = await axiosInstance.get<RatedTitle[]>("/titles")
  return data
}

export const useMyTitles = () =>
  useQuery<RatedTitle[]>({
    queryKey: ["my-titles"],
    queryFn: fetchMyTitles,
    staleTime: 1000 * 60 * 2,
  })

// Search my titles
const fetchSearchMine = async (q: string): Promise<RatedTitle[]> => {
  const { data } = await axiosInstance.get<RatedTitle[]>("/titles/search-mine", { params: { q } })
  return data
}

export const useSearchMine = (q: Ref<string>) =>
  useQuery<RatedTitle[]>({
    // queryKey reactivo: se recalcula cuando q cambia
    queryKey: computed(() => ["search-mine", q.value]),
    queryFn: () => fetchSearchMine(q.value),
    enabled: computed(() => q.value.trim().length >= 2),
    staleTime: 1000 * 30,
  })

// Search TMDB
const fetchSearchTmdb = async (q: string): Promise<Title[]> => {
  const { data } = await axiosInstance.get<Title[]>("/titles/search", { params: { q } })
  return data
}

export const useSearchTmdb = (q: Ref<string>) =>
  useQuery<Title[]>({
    queryKey: computed(() => ["search-tmdb", q.value]),
    queryFn: () => fetchSearchTmdb(q.value),
    enabled: computed(() => q.value.trim().length >= 2),
    staleTime: 1000 * 60,
  })