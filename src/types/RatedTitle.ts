export interface RatedTitle {
  id: string
  user_title_id: string
  tmdb_id: number
  type: "movie" | "tv"
  title: string
  original_title: string
  overview: string
  poster_url: string
  backdrop_url: string | null
  release_year: number | null
  genres: string | null
  studio: string | null
  network: string | null
  watch_providers: string | null
  score: number
  global_score: number
  story_score?: number
  acting_score?: number
  direction_score?: number
  technical_score?: number
  impact_score?: number
}