import { useState, useEffect } from "react"

export interface AggregatedStatLine {
  playerId: number
  fullName: string
  position: string
  teamAbbrev: string
  season: string
  isGoalie: boolean
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  plusMinus: number
  shots: number
  shootingPctg: number
  avgToi: number
  hits: number
  blockedShots: number
  pim: number
  wins: number
  losses: number
  otLosses: number
  shutouts: number
  savePctg: number
  goalsAgainstAvg: number
}

export function useAggregatedStats(playerId: number | null) {
  const [stats, setStats] = useState<AggregatedStatLine | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (playerId == null) {
      setStats(null)
      return
    }

    let cancelled = false

    async function fetchStats() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `http://localhost:3001/players/${playerId}/aggregated`,
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) setStats(data)
      } catch (err) {
        if (!cancelled) setError("Failed to load aggregated stats")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStats()

    return () => {
      cancelled = true
    }
  }, [playerId])

  return { stats, loading, error }
}
