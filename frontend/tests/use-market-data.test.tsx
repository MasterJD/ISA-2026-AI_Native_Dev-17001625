import type React from "react";

import { renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useHealthStatus } from "@/hooks/use-market-data";
import { ApiError, fetchHealth } from "@/lib/api";

vi.mock("@/lib/api", () => {
  class MockApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
      this.name = "ApiError";
    }
  }

  return {
    ApiError: MockApiError,
    fetchHealth: vi.fn(),
    fetchStockQuote: vi.fn(),
    fetchStockHistory: vi.fn(),
    fetchSentiment: vi.fn(),
    fetchGamificationStatus: vi.fn(),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, errorRetryCount: 0 }}>
    {children}
  </SWRConfig>
);

describe("useHealthStatus", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns success state when API resolves", async () => {
    vi.mocked(fetchHealth).mockResolvedValue({
      status: "active",
      version: "1.0.0",
      environment: "development",
    });

    const { result } = renderHook(() => useHealthStatus(), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.status).toBe("active");
    });
    expect(result.current.error).toBeUndefined();
  });

  it("returns loading state while request is pending", () => {
    vi.mocked(fetchHealth).mockImplementation(
      () =>
        new Promise(() => {
          // Intentionally unresolved to assert loading state.
        }),
    );

    const { result } = renderHook(() => useHealthStatus(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it("returns error state when API rejects", async () => {
    vi.mocked(fetchHealth).mockRejectedValue(new ApiError("Servicio caido", 503));

    const { result } = renderHook(() => useHealthStatus(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
    expect(result.current.error?.message).toContain("Servicio caido");
  });
});
