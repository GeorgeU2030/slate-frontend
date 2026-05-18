import type { RatedTitle } from "@/types/RatedTitle"

export type ScoreKey = "story_score" | "acting_score" | "direction_score" | "technical_score" | "impact_score"
export type Scores = Record<ScoreKey, number | null>

export const CRITERIA: {
  key: ScoreKey
  label: string
  sub: string
  weight: number
  color: string
  accent: string
}[] = [
  {
    key: "story_score",
    label: "Story",
    sub: "Narrative structure, dialogue & thematic depth",
    weight: 0.30,
    color: "#7C83FD", // cinematic indigo
    accent: "rgba(124,131,253,0.10)",
  },
  {
    key: "acting_score",
    label: "Acting",
    sub: "Performance authenticity & cast chemistry",
    weight: 0.20,
    color: "#60A5FA", // human blue
    accent: "rgba(232,121,121,0.10)",
  },
  {
    key: "direction_score",
    label: "Direction",
    sub: "Creative vision, pacing & scene composition",
    weight: 0.20,
    color: "#D4AF37", // auteur gold
    accent: "rgba(212,175,55,0.10)",
  },
  {
    key: "technical_score",
    label: "Technical",
    sub: "Cinematography, editing, sound & visual craft",
    weight: 0.15,
    color: "#34D399", // neon emerald
    accent: "rgba(52,211,153,0.10)",
  },
  {
    key: "impact_score",
    label: "Impact",
    sub: "Emotional resonance & lasting memorability",
    weight: 0.15,
    color: "#F97316", // intense orange
    accent: "rgba(249,115,22,0.10)",
  },
]

// Score quality color — based purely on the numeric value
// 1–2: red  |  3–4: orange  |  5–6: yellow  |  7–8: green  |  9–10: blue/teal
export const scoreColor = (v: number): string => {
  if (v >= 9) return "#60A5FA"   // blue   — outstanding
  if (v >= 7) return "#4ADE80"   // green  — good
  if (v >= 5) return "#FACC15"   // yellow — average
  if (v >= 3) return "#FB923C"   // orange — below average
  return "#F87171"               // red    — poor
}

export const scoreAccent = (v: number): string => {
  if (v >= 9) return "rgba(96,165,250,0.12)"
  if (v >= 7) return "rgba(74,222,128,0.12)"
  if (v >= 5) return "rgba(250,204,21,0.12)"
  if (v >= 3) return "rgba(251,146,60,0.12)"
  return "rgba(248,113,113,0.12)"
}

export const scoreLabel = (v: number | null): string => {
  if (v === null) return ""
  if (v >= 9.5) return "Masterpiece"
  if (v >= 8.5) return "Excellent"
  if (v >= 7.5) return "Great"
  if (v >= 6.5) return "Good"
  if (v >= 5)   return "Average"
  if (v >= 3)   return "Below avg"
  return "Poor"
}

export const calcWeighted = (scores: Scores): number | null => {
  const filled = CRITERIA.filter((c) => scores[c.key] !== null)
  if (filled.length === 0) return null
  const totalWeight = filled.reduce((s, c) => s + c.weight, 0)
  return filled.reduce((s, c) => s + (scores[c.key]! * c.weight), 0) / totalWeight
}

export const emptyScores = (): Scores => ({
  story_score: null,
  acting_score: null,
  direction_score: null,
  technical_score: null,
  impact_score: null,
})

export const scoresFromRated = (r: RatedTitle): Scores => ({
  story_score: r.story_score ?? null,
  acting_score: r.acting_score ?? null,
  direction_score: r.direction_score ?? null,
  technical_score: r.technical_score ?? null,
  impact_score: r.impact_score ?? null,
})