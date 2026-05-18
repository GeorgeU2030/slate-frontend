import { axiosInstance } from '@/api/axios'
import type { RatedTitle } from '@/types/RatedTitle'

export interface RatePayload {
  tmdb_id: number
  type: 'movie' | 'tv'
  story_score: number
  acting_score: number
  direction_score: number
  technical_score: number
  impact_score: number
}

export interface UpdateScoresPayload {
  story_score: number
  acting_score: number
  direction_score: number
  technical_score: number
  impact_score: number
}

export const titlesApi = {
  rate: async (payload: RatePayload): Promise<RatedTitle> => {
    const { data } = await axiosInstance.post<RatedTitle>('/titles', payload)
    return data
  },
  update: async (userTitleId: string, payload: UpdateScoresPayload): Promise<RatedTitle> => {
    const { data } = await axiosInstance.patch<RatedTitle>(`/titles/${userTitleId}`, payload)
    return data
  },
}