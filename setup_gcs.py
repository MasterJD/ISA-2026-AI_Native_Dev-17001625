#!/usr/bin/env python3
"""Initialize a GCS bucket for AI-generated images and run an IAM smoke test.

Recommended usage with uv:
1) uv sync
2) uv run setup_gcs.py
"""

from __future__ import annotations

import os
import sys
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple
from urllib.error import URLError
from urllib.request import urlopen

from dotenv import load_dotenv
from google.api_core.exceptions import NotFound
from google.cloud import storage


@dataclass(frozen=True)
class Settings:
    bucket_name: str
    project_id: str
    credentials_path: Path


def load_settings() -> Settings:
    load_dotenv()

    bucket_name = os.getenv("GCS_BUCKET_NAME", "").strip()
    project_id = os.getenv("GCS_PROJECT_ID", "").strip()
    credentials_raw = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "").strip()

    missing = []
    if not bucket_name:
        missing.append("GCS_BUCKET_NAME")
    if not project_id:
        missing.append("GCS_PROJECT_ID")
    if not credentials_raw:
        missing.append("GOOGLE_APPLICATION_CREDENTIALS")

    if missing:
        names = ", ".join(missing)
        raise RuntimeError(f"Missing required environment variables: {names}")

    credentials_path = Path(credentials_raw).expanduser().resolve()
    if not credentials_path.exists():
        raise FileNotFoundError(
            f"Service account key not found: {credentials_path}. "
            "Set GOOGLE_APPLICATION_CREDENTIALS to a valid JSON file path."
        )

    return Settings(
        bucket_name=bucket_name,
        project_id=project_id,
        credentials_path=credentials_path,
    )


def ensure_bucket(client: storage.Client, bucket_name: str, project_id: str) -> storage.Bucket:
    try:
        bucket = client.get_bucket(bucket_name)
        print(f"[INFO] Bucket already exists: {bucket_name}")
    except NotFound:
        bucket = storage.Bucket(client=client, name=bucket_name)
        bucket.location = "US"
        bucket = client.create_bucket(bucket=bucket, project=project_id)
        print(f"[INFO] Bucket created: {bucket_name}")

    return bucket


def ensure_public_access(bucket: storage.Bucket) -> None:
    if not bucket.iam_configuration.uniform_bucket_level_access_enabled:
        bucket.iam_configuration.uniform_bucket_level_access_enabled = True
        bucket.patch()
        print("[INFO] Enabled uniform bucket-level access")

    policy = bucket.get_iam_policy(requested_policy_version=3)
    role = "roles/storage.objectViewer"
    members = set(policy.get(role, []))

    if "allUsers" not in members:
        members.add("allUsers")
        policy[role] = list(members)
        bucket.set_iam_policy(policy)
        print("[INFO] Granted public read to allUsers")
    else:
        print("[INFO] Public read already configured")


def smoke_test(bucket: storage.Bucket) -> Tuple[str, str]:
    object_name = f"smoke-tests/{uuid.uuid4().hex}.txt"
    payload = "Rent my Gear GCS smoke test"
    blob = bucket.blob(object_name)
    blob.cache_control = "no-cache"

    blob.upload_from_string(payload, content_type="text/plain")
    public_url = blob.public_url
    print(f"[INFO] Uploaded test object: {object_name}")

    try:
        with urlopen(public_url) as response:  # nosec B310 - controlled URL from GCS
            body = response.read().decode("utf-8")
            if response.status != 200:
                raise RuntimeError(
                    f"Unexpected smoke-test status code: {response.status}"
                )
            if payload not in body:
                raise RuntimeError("Smoke-test payload mismatch")

        print(f"[INFO] Public URL verified: {public_url}")
    except URLError as exc:
        raise RuntimeError(
            f"Failed to verify public URL '{public_url}'. Check IAM and networking."
        ) from exc
    finally:
        blob.delete()
        print(f"[INFO] Deleted test object: {object_name}")

    return object_name, public_url


def main() -> int:
    try:
        settings = load_settings()
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(settings.credentials_path)

        client = storage.Client(project=settings.project_id)
        bucket = ensure_bucket(client, settings.bucket_name, settings.project_id)
        ensure_public_access(bucket)
        _, public_url = smoke_test(bucket)

        print("\n[SUCCESS] GCS setup completed")
        print(f"[SUCCESS] Bucket: {settings.bucket_name}")
        print(f"[SUCCESS] Smoke URL: {public_url}")
        return 0
    except Exception as exc:  # pragma: no cover - script-level guard
        print(f"\n[ERROR] setup_gcs.py failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
