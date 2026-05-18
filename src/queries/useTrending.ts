import { useQuery } from "@tanstack/vue-query"
import { axiosInstance } from "@/api/axios"
import type { Title } from "@/types/Title"

const fetchTrendingMovies = async (): Promise<Title[]> => {
  const { data } = await axiosInstance.get<Title[]>("/titles/trending/movies")
  return data
}

const fetchTrendingTV = async (): Promise<Title[]> => {
  const { data } = await axiosInstance.get<Title[]>("/titles/trending/tv")
  return data
}

export const useTrendingMovies = () =>
  useQuery<Title[]>({
    queryKey: ["trending", "movies"],
    queryFn: fetchTrendingMovies,
    staleTime: 1000 * 60 * 5,
  })

export const useTrendingTV = () =>
  useQuery<Title[]>({
    queryKey: ["trending", "tv"],
    queryFn: fetchTrendingTV,
    staleTime: 1000 * 60 * 5,
  })