from dataclasses import dataclass, field
from threading import Lock

from app.models.schemas import GamificationStatusResponse


@dataclass
class _GamificationState:
    user_id: str = "demo-user"
    points: int = 1240
    level: int = 4
    badges: list[str] = field(
        default_factory=lambda: [
            "Explorador de Mercados",
            "Racha de Analisis x7",
            "Radar Cripto",
        ]
    )


class GamificationService:
    def __init__(self) -> None:
        self._state = _GamificationState()
        self._lock = Lock()

    def get_status(self) -> GamificationStatusResponse:
        with self._lock:
            next_level_points = self._required_points_for_level(self._state.level + 1)
            current_level_floor = self._required_points_for_level(self._state.level)
            span = max(next_level_points - current_level_floor, 1)
            progress = ((self._state.points - current_level_floor) / span) * 100

            return GamificationStatusResponse(
                user_id=self._state.user_id,
                level_name=self._level_name(self._state.level),
                level=self._state.level,
                points=self._state.points,
                next_level_points=next_level_points,
                progress_percent=round(max(0.0, min(progress, 100.0)), 2),
                badges=list(self._state.badges),
            )

    @staticmethod
    def _required_points_for_level(level: int) -> int:
        if level <= 1:
            return 0
        return (level - 1) * 400

    @staticmethod
    def _level_name(level: int) -> str:
        names = {
            1: "Inversionista Novato",
            2: "Analista en Progreso",
            3: "Operador Estrategico",
            4: "Especialista Cuantitativo",
            5: "Maestro del Mercado",
        }
        return names.get(level, "Elite Trader")
