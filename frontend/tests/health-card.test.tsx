import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HealthCard } from "@/components/dashboard/health-card";
import type { HealthStatus } from "@/types/api";

const useHealthStatusMock = vi.fn();

vi.mock("@/hooks/use-market-data", () => ({
  useHealthStatus: (...args: unknown[]) => useHealthStatusMock(...args),
}));

vi.mock("@/lib/api", () => ({
  fetchHealth: vi.fn(),
  normalizeApiError: (error: unknown) => ({
    message: error instanceof Error ? error.message : "Error desconocido",
  }),
}));

describe("HealthCard", () => {
  beforeEach(() => {
    useHealthStatusMock.mockReset();
  });

  it("renders success state", () => {
    const health: HealthStatus = {
      status: "active",
      version: "1.0.0",
      environment: "development",
    };

    useHealthStatusMock.mockReturnValue({
      data: health,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    });

    render(<HealthCard initialHealth={health} initialError={null} />);

    expect(screen.getByText("Conectado")).toBeInTheDocument();
    expect(screen.getByText("development")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    useHealthStatusMock.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
    });

    render(<HealthCard initialHealth={null} initialError={null} />);

    expect(screen.getByText("Cargando")).toBeInTheDocument();
  });

  it("renders error state", () => {
    useHealthStatusMock.mockReturnValue({
      data: undefined,
      error: new Error("Backend no disponible"),
      isLoading: false,
      mutate: vi.fn(),
    });

    render(<HealthCard initialHealth={null} initialError={null} />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Backend no disponible")).toBeInTheDocument();
  });
});
