import { useState, useEffect } from "react"
import { Player, PlayerDetail } from "../types"

/** Fetch the full player list once on mount (for search dropdowns). */
export function usePlayerList() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPlayers() {
      try {
        const res = await fetch("http://localhost:3001/players")
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

/** Fetch stats for a single player. Pass null to clear. */
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
          `http://localhost:3001/players/${playerId}/stats`,
        )
        if (!res.ok) throw new Error("Failed to fetch player")
        const data = await res.json()

        if (!cancelled) {
          const lastSeason = data.seasonTotals
            ?.filter(
              (s: any) => s.leagueAbbrev === "NHL" && s.gameTypeId === 2,
            )
            ?.at(-1)

          const isGoalie = data.position === "G"

          // Parse avgToi from "mm:ss" → decimal minutes
          const toiParts = (lastSeason?.avgToi as string | undefined)
            ?.split(":")
            .map(Number) ?? [0, 0]
          const avgToi = (toiParts[0] ?? 0) + (toiParts[1] ?? 0) / 60

          setPlayerDetail({
            player: {
              id: data.playerId,
              fullName: `${data.firstName.default} ${data.lastName.default}`,
              teamAbbrev: data.currentTeamAbbrev,
              position: data.position,
            },
            stats: isGoalie
              ? {
                  type: "goalie",
                  season: lastSeason?.season?.toString() ?? "N/A",
                  gamesPlayed: lastSeason?.gamesPlayed ?? 0,
                  wins: lastSeason?.wins ?? 0,
                  losses: lastSeason?.losses ?? 0,
                  otLosses: lastSeason?.otLosses ?? 0,
                  shutouts: lastSeason?.shutouts ?? 0,
                  savePercentage: lastSeason?.savePctg ?? 0,
                  goalsAgainstAverage: lastSeason?.goalsAgainstAvg ?? 0,
                  avgToi,
                }
              : {
                  type: "skater",
                  season: lastSeason?.season?.toString() ?? "N/A",
                  gamesPlayed: lastSeason?.gamesPlayed ?? 0,
                  goals: lastSeason?.goals ?? 0,
                  assists: lastSeason?.assists ?? 0,
                  points: lastSeason?.points ?? 0,
                  plusMinus: lastSeason?.plusMinus ?? 0,
                  shots: lastSeason?.shots ?? 0,
                  shootingPctg: lastSeason?.shootingPctg ?? 0,
                  avgToi,
                  hits: lastSeason?.hits ?? 0,
                  blockedShots: lastSeason?.blockedShots ?? 0,
                  pim: lastSeason?.pim ?? 0,
                },
            imageUrl: `https://assets.nhle.com/mugs/nhl/20252026/${data.currentTeamAbbrev}/${playerId}.png`,
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
