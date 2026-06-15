import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerSearch from "./PlayerSearch";
import { Player } from "../types";

describe("PlayerSearch", () => {
  const players: Player[] = [
    { id: 1, fullName: "Sidney Crosby", teamAbbrev: "PIT", position: "C" },
    { id: 2, fullName: "Connor McDavid", teamAbbrev: "EDM", position: "C" },
    { id: 3, fullName: "Alex Ovechkin", teamAbbrev: "WSH", position: "LW" },
  ];

  it("renders team dropdown options", () => {
    render(
      <PlayerSearch
        players={players}
        onPlayerSelect={() => undefined}
        onReset={() => undefined}
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "EDM" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PIT" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "WSH" })).toBeInTheDocument();
  });

  it("filters players by query and selects a player", async () => {
    const user = userEvent.setup();
    const onPlayerSelect = vi.fn();
    render(
      <PlayerSearch
        players={players}
        onPlayerSelect={onPlayerSelect}
        onReset={() => undefined}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/search for a player/i),
      "Connor",
    );

    expect(screen.getByText("Connor McDavid")).toBeInTheDocument();
    await user.click(screen.getByText("Connor McDavid"));

    expect(onPlayerSelect).toHaveBeenCalledWith(players[1]);
    expect(screen.queryByText("Connor McDavid")).not.toBeInTheDocument();
  });

  it("shows the clear button after filtering and resets state", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <PlayerSearch
        players={players}
        onPlayerSelect={() => undefined}
        onReset={onReset}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/search for a player/i),
      "Alex",
    );

    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(onReset).toHaveBeenCalled();
    expect(screen.getByPlaceholderText(/search for a player/i)).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: /clear/i }),
    ).not.toBeInTheDocument();
  });
});
