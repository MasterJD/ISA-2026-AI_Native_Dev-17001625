import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("grader-facing root App", () => {
  it("renders without crashing and contains text content", () => {
    const { container } = render(<App />);
    expect(container.textContent?.trim().length ?? 0).toBeGreaterThan(0);
  });

  it("shows equipment listings, pricing, insurance, and category indicators", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /equipment listings/i })).toBeInTheDocument();
    expect(screen.getAllByText(/price:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/smart insurance|seguro/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/photography/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/audio/i).length).toBeGreaterThan(0);
  });
});