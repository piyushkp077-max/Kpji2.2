import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";

import { Route } from "@/routes/index";

const App = Route.options.component as unknown as ComponentType;

describe("Roast Mode placement", () => {
  it("keeps the Roast Mode switch, Roast chip and language selector off the home screen", () => {
    render(<App />);

    expect(screen.getByText("Trending Now")).toBeInTheDocument();
    expect(screen.queryByRole("switch", { name: "Roast Mode" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Roast" })).toBeNull();
    expect(screen.queryByRole("group", { name: "Caption language" })).toBeNull();
  });

  it("offers the Roast Mode switch and language selector inside the AI Photo caption generator", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "AI Photo" }));

    expect(screen.getByRole("switch", { name: "Roast Mode" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Roast" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Caption language" })).toBeInTheDocument();
  });
});
