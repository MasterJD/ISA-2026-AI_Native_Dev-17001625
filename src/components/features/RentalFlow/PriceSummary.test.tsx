import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PriceSummary } from "@/components/features/RentalFlow/PriceSummary";

describe("PriceSummary", () => {
  it("renders 20% Smart Insurance for photography", () => {
    render(
      <PriceSummary
        dailyRate={60}
        categoryId="fotografia-video"
        from={new Date(2026, 4, 1)}
        to={new Date(2026, 4, 3)}
      />,
    );

    expect(screen.getByText("Smart Insurance (20%)")).toBeInTheDocument();
    expect(screen.getByText("$36")).toBeInTheDocument();
    expect(screen.getByText("$216")).toBeInTheDocument();
  });

  it("renders 10% Smart Insurance for non-photography", () => {
    render(
      <PriceSummary
        dailyRate={50}
        categoryId="montana-camping"
        from={new Date(2026, 4, 1)}
        to={new Date(2026, 4, 2)}
      />,
    );

    expect(screen.getByText("Smart Insurance (10%)")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("$110")).toBeInTheDocument();
  });
});