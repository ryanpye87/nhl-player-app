import { useState, useEffect, useRef } from "react"
import { PlayerDetail } from "../types"

const API_BASE = "http://localhost:3001"

/** Transform an AggregatedStats document into a PlayerDetail. */
function buildPlayerDetail(data: any, playerId: number): PlayerDetail {
  const isGoalie: boolean = data.isGoalie
  return {
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
  }
}

/**
 * Fetch aggregated stats + percentiles for two players in a single
 * POST /players/batch call.  Pass null for either slot to clear it.
 *
 * Replaces the per-player N+1 pattern of
 *   usePlayerDetail(id) + usePercentiles(id)
 * with one request that shares percentile peer queries.
 */
export function usePlayerBatch(idA: number | null, idB: number | null) {
  const [detailA, setDetailA] = useState<PlayerDetail | null>(null)
  const [detailB, setDetailB] = useState<PlayerDetail | null>(null)
  const [pctA, setPctA] = useState<Record<string, number> | null>(null)
  const [pctB, setPctB] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Track the request sequence to avoid stale responses
  const seqRef = useRef(0)

  useEffect(() => {
    const ids = [idA, idB].filter((id): id is number => id != null)

    if (ids.length === 0) {
      setDetailA(null)
      setDetailB(null)
      setPctA(null)
      setPctB(null)
      return
    }

    let cancelled = false
    const seq = ++seqRef.current

    async function fetchBatch() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`${API_BASE}/players/batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        })
        if (!res.ok) {
          const text = await res.text()
          console.error(`[usePlayerBatch] HTTP ${res.status}: ${text}`)
          throw new Error(`HTTP ${res.status}`)
        }
        const { aggregated, percentiles } = await res.json()

        console.log(
          `[usePlayerBatch] got ${aggregated.length} aggregated, ${percentiles.length} percentiles for ids [${ids}]`,
        )

        if (cancelled || seq !== seqRef.current) return

        const aggA = aggregated.find((a: any) => a.playerId === idA)
        const aggB = aggregated.find((a: any) => a.playerId === idB)
        const pctsA = percentiles.find((p: any) => p.playerId === idA)
        const pctsB = percentiles.find((p: any) => p.playerId === idB)

        setDetailA(aggA ? buildPlayerDetail(aggA, idA!) : null)
        setDetailB(aggB ? buildPlayerDetail(aggB, idB!) : null)
        setPctA(pctsA?.percentiles ?? null)
        setPctB(pctsB?.percentiles ?? null)
      } catch (err) {
        console.error("[usePlayerBatch] fetch failed:", err)
        if (!cancelled && seq === seqRef.current) {
          setError("Could not load player data.")
        }
      } finally {
        if (!cancelled && seq === seqRef.current) {
          setLoading(false)
        }
      }
    }

    fetchBatch()

    return () => {
      cancelled = true
    }
  }, [idA, idB])

  return { detailA, detailB, pctA, pctB, loading, error }
}
