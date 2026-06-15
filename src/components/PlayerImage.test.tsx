import { render, screen } from "@testing-library/react";
import PlayerImage from "./PlayerImage";

describe("PlayerImage", () => {
  it("renders the image with the right src and alt text", () => {
    render(
      <PlayerImage
        imageUrl="https://example.com/image.png"
        playerName="Test Player"
      />,
    );

    const image = screen.getByRole("img", { name: /test player/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.png");
  });

  it("falls back to the placeholder image on error", async () => {
    render(
      <PlayerImage
        imageUrl="https://example.com/image.png"
        playerName="Test Player"
      />,
    );

    const image = screen.getByRole("img", { name: /test player/i });
    await image.dispatchEvent(new Event("error"));

    expect(image).toHaveAttribute(
      "src",
      "https://via.placeholder.com/270?text=No+Image",
    );
  });
});
