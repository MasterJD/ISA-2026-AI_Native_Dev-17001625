import os

import pytest
from fastapi.testclient import TestClient

# Ensure app-level imports have valid settings even before fixture monkeypatching.
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")
os.environ.setdefault("GEMINI_API_KEY", "test-gemini-key")
os.environ.setdefault("PORT", "8000")

from app.config import get_settings
from app.main import create_app


@pytest.fixture
def app(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "development")
    monkeypatch.setenv("FRONTEND_URL", "http://localhost:3000")
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setenv("PORT", "8000")

    get_settings.cache_clear()
    created_app = create_app()
    yield created_app
    get_settings.cache_clear()


@pytest.fixture
def client(app):
    with TestClient(app) as test_client:
        yield test_client
