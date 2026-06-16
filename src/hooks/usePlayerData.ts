import { useState, useEffect } from "react"
import { Player, PlayerDetail } from "../types"

const API_BASE = "http://localhost:3001"

/** Fetch the full player list once on mount (for search dropdowns). */
export function usePlayerList() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPlayers() {
      try {
        const res = await fetch(`${API_BASE}/players`)
        if (!res.ok) throw new Error("Failed to fetch players")
        const data = await res.json()
        if (!cancelled) setPlayers(data)
      } catch (err) {
        if (!cancelled) setError("Failed to load player list")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPlayers()

    return () => {
      cancelled = true
    }
  }, [])

  return { players, loading, error }
}

/** Fetch aggregated stats for a single player. Pass null to clear. */
export function usePlayerDetail(playerId: number | null) {
  const [playerDetail, setPlayerDetail] = useState<PlayerDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (playerId == null) {
      setPlayerDetail(null)
      return
    }

    let cancelled = false

    async function fetchPlayer() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `${API_BASE}/players/${playerId}/aggregated`,
        )
        if (!res.ok) throw new Error("Failed to fetch player")
        const data = await res.json()

        if (!cancelled) {
          const isGoalie: boolean = data.isGoalie

          setPlayerDetail({
            player: {
              id: data.playerId,
              fullName: data.fullName,
              teamAbbrev: data.teamAbbrev,
              position: data.position,
            },
            stats: isGoalie
              ? {
                  type: "goalie",
                  season: data.season ?? "N/A",
                  gamesPlayed: data.gamesPlayed ?? 0,
                  wins: data.wins ?? 0,
                  losses: data.losses ?? 0,
                  otLosses: data.otLosses ?? 0,
                  shutouts: data.shutouts ?? 0,
                  savePctg: data.savePctg ?? 0,
                  goalsAgainstAverage: data.goalsAgainstAvg ?? 0,
                  avgToi: data.avgToi ?? 0,
                }
              : {
                  type: "skater",
                  season: data.season ?? "N/A",
                  gamesPlayed: data.gamesPlayed ?? 0,
                  goals: data.goals ?? 0,
                  assists: data.assists ?? 0,
                  points: data.points ?? 0,
                  plusMinus: data.plusMinus ?? 0,
                  shots: data.shots ?? 0,
                  shootingPctg: data.shootingPctg ?? 0,
                  avgToi: data.avgToi ?? 0,
                  hits: data.hits ?? 0,
                  blockedShots: data.blockedShots ?? 0,
                  pim: data.pim ?? 0,
                },
            imageUrl: `https://assets.nhle.com/mugs/nhl/${data.season}/${data.teamAbbrev}/${playerId}.png`,
          })
        }
      } catch (err) {
        if (!cancelled) setError("Could not load player data.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPlayer()

    return () => {
      cancelled = true
    }
  }, [playerId])

  return { playerDetail, loading, error }
}
