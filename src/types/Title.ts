export interface Title {
  tmdb_id: number
  type: "movie" | "tv"
  title: string
  original_title: string
  overview: string
  poster_url: string
  backdrop_url: string
  release_year: number | null
  genres: string | null
  studio: string | null
  network: string | null
  watch_providers: string | null
}