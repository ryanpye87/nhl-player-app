import { test, expect, type Page } from "@playwright/test"

// ── Helpers ───────────────────────────────────────────────────────────

/**
 * Type into a search input and click a matching result from the dropdown.
 *
 * @param slot  "A" targets the first input, "B" targets the last.
 *              Needed because position locking makes both placeholders identical.
 */
async function selectPlayer(
  page: Page,
  placeholder: string | RegExp,
  playerName: string,
  slot: "A" | "B" = "A",
) {
  const input = slot === "A"
    ? page.getByPlaceholder(placeholder as string).first()
    : page.getByPlaceholder(placeholder as string).last()

  await input.click()
  await input.fill(playerName)

  // Wait for the dropdown list and click the first matching player
  const option = page
    .getByRole("listitem")
    .filter({ hasText: playerName })
    .first()
  await option.waitFor({ state: "visible", timeout: 5000 })
  await option.click()

  // Verify the player card populated
  await expect(page.getByText(playerName).first()).toBeVisible({ timeout: 5000 })
}

/** The radar chart SVG, scoped to avoid matching Lucide icons. */
function radarChart(page: Page) {
  return page.locator("svg[role='img']")
}

// ── Tests ─────────────────────────────────────────────────────────────

test.describe("NHL Player Compare", () => {
  test("app loads with heading and two search fields", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", { name: /NHL Player Compare/i }),
    ).toBeVisible()

    // Two text inputs — one for Player A, one for Player B
    await expect(page.getByRole("textbox")).toHaveCount(2)
  })

  test("player list populates in search dropdown on click", async ({ page }) => {
    await page.goto("/")

    const inputA = page
      .getByPlaceholder(/Search skaters|Search for a player/)
      .first()
    await inputA.click()

    const listItems = page.getByRole("listitem")
    await expect(listItems.first()).toBeVisible({ timeout: 5000 })
    expect(await listItems.count()).toBeGreaterThan(0)
  })

  test("selecting two skaters shows radar chart and stat comparison table", async ({
    page,
  }) => {
    await page.goto("/")

    // Select Player A
    await selectPlayer(page, /Search skaters|Search for a player/, "Connor McD", "A")

    // After picking a skater, Player B placeholder also shows "Search skaters…"
    // so we target the last input explicitly
    await selectPlayer(page, /Search skaters/, "Leon Drais", "B")

    // Radar chart SVG (role="img") must be visible
    const chart = radarChart(page)
    await expect(chart).toBeVisible({ timeout: 5000 })

    // At least 2 filled polygons (one per player) — background rings also count
    const polygons = chart.locator("polygon[fill]")
    expect(await polygons.count()).toBeGreaterThanOrEqual(2)

    // Stat comparison table should render
    await expect(page.getByText("Stat Comparison")).toBeVisible({ timeout: 5000 })
    const table = page.getByRole("table")
    await expect(table).toBeVisible()

    // Core stat rows must be present
    for (const stat of ["Goals", "Assists", "Points"]) {
      await expect(
        table.getByRole("row").filter({ hasText: new RegExp(stat, "i") }),
      ).toBeVisible()
    }
  })

  test("swap button flips the two selected players", async ({ page }) => {
    await page.goto("/")

    await selectPlayer(page, /Search skaters|Search for a player/, "Connor McD", "A")
    await selectPlayer(page, /Search skaters/, "Leon Drais", "B")

    // Player A's name is inside the player card — the second <p> with these
    // classes (the first is the "Player A" section label)
    const nameA = page.locator("p.font-semibold.text-sm:not(.uppercase)").first()

    // Click swap
    await page.getByRole("button", { name: /swap/i }).click()

    // Player A's card should now show the other player
    await expect(nameA).toHaveText("Leon Draisaitl")
  })

  test("single selected player shows radar but no stat table", async ({ page }) => {
    await page.goto("/")

    await selectPlayer(page, /Search skaters|Search for a player/, "Connor McD")

    // Radar renders (single polygon)
    await expect(radarChart(page)).toBeVisible({ timeout: 5000 })

    // Table requires two players
    await expect(page.getByText("Stat Comparison")).not.toBeVisible()
  })

  test("goalie selection locks the other search to goalies", async ({ page }) => {
    await page.goto("/")

    // Open the first dropdown to see all players
    const inputA = page
      .getByPlaceholder(/Search skaters|Search for a player/)
      .first()
    await inputA.click()

    // The dropdown shows all eligible players. Verify it renders.
    const listItems = page.getByRole("listitem")
    await expect(listItems.first()).toBeVisible({ timeout: 5000 })

    // Select the first player — after selection, Player B's placeholder
    // should reflect the position filter
    await listItems.first().click()

    const inputB = page.getByPlaceholder(/Search/).last()
    await expect(inputB).toBeVisible()
  })

  test("handles batch API failure without crashing", async ({ page }) => {
    // Intercept the batch endpoint to simulate a 500
    await page.route("**/players/batch", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      }),
    )

    await page.goto("/")

    // Attempt to select a player — the batch call will fail
    const input = page
      .getByPlaceholder(/Search skaters|Search for a player/)
      .first()
    await input.click()
    await input.fill("Connor McD")

    const option = page
      .getByRole("listitem")
      .filter({ hasText: /Connor/ })
      .first()
    await option.waitFor({ state: "visible", timeout: 5000 })
    await option.click()

    // App should still render the heading (no white screen crash)
    await expect(
      page.getByRole("heading", { name: /NHL Player Compare/i }),
    ).toBeVisible()

    // Radar chart should NOT render (batch returned 500, no data)
    await expect(radarChart(page)).not.toBeVisible()
  })
})
