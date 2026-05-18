export const parseProviders = (raw: string | null): string[] => raw ? raw.split(",").slice(0, 3).map((p) => p.trim()) : []
export const parseGenres = (raw: string | null, max = 2): string[] => raw ? raw.split(",").slice(0, max).map((g) => g.trim()) : []
