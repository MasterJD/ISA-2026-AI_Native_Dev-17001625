#!/usr/bin/env bash
set -euo pipefail

# Usage:
# PROJECT_ID=my-project REGION=us-central1 FRONTEND_URL=https://app.vercel.app ./scripts/deploy-cloud-run.sh

: "${PROJECT_ID:?PROJECT_ID is required}"
: "${REGION:?REGION is required}"
: "${FRONTEND_URL:?FRONTEND_URL is required}"

SERVICE_NAME="traderpulse-api"
REPOSITORY="traderpulse"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE_NAME}:latest"

echo "[deploy] Building image ${IMAGE}"
gcloud builds submit --tag "${IMAGE}" .

echo "[deploy] Deploying Cloud Run service ${SERVICE_NAME}"
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "ENVIRONMENT=production,PORT=8080,FRONTEND_URL=${FRONTEND_URL}" \
  --set-secrets "GEMINI_API_KEY=traderpulse-gemini-key:latest"

echo "[deploy] Completed"
