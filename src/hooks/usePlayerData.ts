import { useState, useEffect } from 'react'
import { Player, PlayerDetail } from '../types'

export function usePlayerData(selectedId: number | null) {
    const [playerDetail, setPlayerDetail] = useState<PlayerDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [players, setPlayers] = useState<Player[]>([])

useEffect(() => {
    async function fetchPlayers() {
        const res = await fetch('http://localhost:3001/players')
        const data = await res.json()
        setPlayers(data)
    }
    fetchPlayers()
}, []) // ← empty array means "run once on mount"

    useEffect(() => {
        if (!selectedId){
            setPlayerDetail(null)
            return //do nothing if nothing selected
        }
        async function fetchPlayer() {
            setLoading(true)
            setError(null)

            try {
                const res = await fetch(`http://localhost:3001/players/${selectedId}/stats`)
                if (!res.ok) throw new Error('Failed to fetch player')
                const data = await res.json()

                const lastSeason = data.seasonTotals
                    ?.filter((s: any) => s.leagueAbbrev === 'NHL' && s.gameTypeId === 2)
                    ?.at(-1)
                const isGoalie = data.position === 'G'
                setPlayerDetail({
                    player: {
                        id: data.playerId,
                        fullName: `${data.firstName.default} ${data.lastName.default}`,
                        teamAbbrev: data.currentTeamAbbrev,
                        position: data.position,
                    },
                    stats: isGoalie
                    ? {
                        type: 'goalie',
                        season: lastSeason?.season?.toString() ?? 'N/A',
                        gamesPlayed: lastSeason?.gamesPlayed ?? 0,
                        wins: lastSeason?.wins ?? 0,
                        losses: lastSeason?.losses ?? 0,
                        otLosses: lastSeason?.otLosses ?? 0,
                        shutouts: lastSeason?.shutouts ?? 0,
                        savePercentage: lastSeason?.savePctg ?? 0,
                        goalsAgainstAverage: lastSeason?.goalsAgainstAvg ?? 0,
                      }
                    : {
                        type: 'skater',
                        season: lastSeason?.season?.toString() ?? 'N/A',
                        gamesPlayed: lastSeason?.gamesPlayed ?? 0,
                        goals: lastSeason?.goals ?? 0,
                        assists: lastSeason?.assists ?? 0,
                        points: lastSeason?.points ?? 0,
                        plusMinus: lastSeason?.plusMinus ?? 0,
                        shots: lastSeason?.shots ?? 0,
                        shootingPctg: lastSeason?.shootingPctg ?? 0,
                    },
                    imageUrl: `https://assets.nhle.com/mugs/nhl/20242025/${data.currentTeamAbbrev}/${selectedId}.png`,
                })
            } catch (err) {
                setError('Could not load player data.')
            } finally {
                setLoading(false)
            }
        }

        fetchPlayer()
    }, [selectedId])// re-runs whenever selectedId changes

    return { playerDetail, loading, error, players }
}