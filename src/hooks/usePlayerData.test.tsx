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
  const detailResponse = {
    playerId: 1,
    firstName: { default: "Connor" },
    lastName: { default: "McDavid" },
    currentTeamAbbrev: "EDM",
    position: "C",
    seasonTotals: [
      {
        leagueAbbrev: "NHL",
        gameTypeId: 2,
        season: "20232024",
        gamesPlayed: 82,
        goals: 64,
        assists: 89,
        points: 153,
        plusMinus: 30,
        shots: 300,
        shootingPctg: 21.3,
      },
    ],
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
        if ((url as string).endsWith("/players/1/stats")) {
          return { ok: true, json: async () => detailResponse }
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
        if ((url as string).endsWith("/players/1/stats")) {
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
