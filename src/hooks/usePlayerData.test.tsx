import { render, screen, waitFor } from "@testing-library/react"
import { usePlayerList, usePlayerDetail } from "./usePlayerData"
import { vi } from "vitest"

interface TestProps {
  selectedId: number | null
}

function TestComponent({ selectedId }: TestProps) {
  const { players, loading: listLoading } = usePlayerList()
  const { playerDetail, loading: detailLoading, error } =
    usePlayerDetail(selectedId)

  return (
    <div>
      <div>{listLoading || detailLoading ? "loading" : "not loading"}</div>
      <div>{error ?? "no error"}</div>
      <div>{players.length}</div>
      <div>{playerDetail ? playerDetail.player.fullName : "no player"}</div>
    </div>
  )
}

describe("usePlayerData", () => {
  const playersResponse = [
    { id: 1, fullName: "Connor McDavid", teamAbbrev: "EDM", position: "C" },
  ]
  const aggregatedResponse = {
    playerId: 1,
    fullName: "Connor McDavid",
    teamAbbrev: "EDM",
    position: "C",
    season: "20252026",
    isGoalie: false,
    gamesPlayed: 82,
    goals: 64,
    assists: 89,
    points: 153,
    plusMinus: 30,
    shots: 300,
    shootingPctg: 0.213,
    avgToi: 21.5,
    hits: 45,
    blockedShots: 20,
    pim: 28,
    wins: 0,
    losses: 0,
    otLosses: 0,
    shutouts: 0,
    savePctg: 0,
    goalsAgainstAvg: 0,
    updatedAt: "2026-06-16T00:00:00.000Z",
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches players on mount", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if ((url as string).endsWith("/players")) {
          return { ok: true, json: async () => playersResponse }
        }
        throw new Error("Unexpected request")
      }),
    )

    render(<TestComponent selectedId={null} />)

    await waitFor(() => expect(screen.getByText("1")).toBeInTheDocument())
    expect(screen.getByText("no player")).toBeInTheDocument()
  })

  it("fetches player detail when selectedId is set", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if ((url as string).endsWith("/players")) {
          return { ok: true, json: async () => playersResponse }
        }
        if ((url as string).endsWith("/players/1/aggregated")) {
          return { ok: true, json: async () => aggregatedResponse }
        }
        return { ok: false }
      }),
    )

    render(<TestComponent selectedId={1} />)

    await waitFor(() =>
      expect(screen.getByText(/Connor McDavid/i)).toBeInTheDocument(),
    )
    expect(screen.getByText("not loading")).toBeInTheDocument()
  })

  it("sets error when player detail fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if ((url as string).endsWith("/players")) {
          return { ok: true, json: async () => playersResponse }
        }
        if ((url as string).endsWith("/players/1/aggregated")) {
          return { ok: false, json: async () => ({}) }
        }
        return { ok: false }
      }),
    )

    render(<TestComponent selectedId={1} />)

    await waitFor(() =>
      expect(
        screen.getByText(/Could not load player data./i),
      ).toBeInTheDocument(),
    )
    expect(screen.getByText("not loading")).toBeInTheDocument()
  })
})
