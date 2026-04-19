from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import router
from app.config import get_settings


def _build_allowed_origins(frontend_url: str, environment: str) -> list[str]:
    normalized_frontend = frontend_url.rstrip("/")

    if environment == "production":
        return [normalized_frontend]

    return sorted(
        {
            normalized_frontend,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        }
    )


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="TraderPulse API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=_build_allowed_origins(str(settings.frontend_url), settings.environment),
        allow_credentials=True,
        allow_methods=["GET"],
        allow_headers=["*"],
    )

    app.include_router(router)

    return app


app = create_app()
