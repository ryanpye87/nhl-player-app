import { useState, useEffect } from "react"

export function usePercentiles(playerId: number | null) {
  const [percentiles, setPercentiles] = useState<Record<
    string,
    number
  > | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (playerId == null) {
      setPercentiles(null)
      return
    }

    let cancelled = false

    async function fetchPercentiles() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `http://localhost:3001/players/percentiles/${playerId}`,
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) setPercentiles(data.percentiles)
      } catch (err) {
        if (!cancelled) setError("Failed to load percentiles")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPercentiles()

    return () => {
      cancelled = true
    }
  }, [playerId])

  return { percentiles, loading, error }
}
