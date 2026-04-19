#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
HEALTH_URL="${BASE_URL}/api/v1/health"

echo "[smoke] Checking ${HEALTH_URL}"

for attempt in {1..15}; do
  if curl -sSf "${HEALTH_URL}" >/tmp/traderpulse-health.json; then
    echo "[smoke] Health endpoint reachable"
    cat /tmp/traderpulse-health.json
    exit 0
  fi
  echo "[smoke] Waiting for service (${attempt}/15)..."
  sleep 2
done

echo "[smoke] Service did not become healthy in time"
exit 1
