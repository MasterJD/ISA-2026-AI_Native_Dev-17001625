import DashboardClient from "@/components/dashboard/dashboard-client";
import { fetchHealth, normalizeApiError } from "@/lib/api";
import type { HealthStatus } from "@/types/api";

interface InitialHealthState {
  health: HealthStatus | null;
  error: string | null;
}

async function getInitialHealthState(): Promise<InitialHealthState> {
  try {
    const health = await fetchHealth();
    return { health, error: null };
  } catch (error) {
    return {
      health: null,
      error: normalizeApiError(error).message,
    };
  }
}

export default async function Page() {
  const { health, error } = await getInitialHealthState();

  return <DashboardClient initialHealth={health} initialHealthError={error} />;
}
