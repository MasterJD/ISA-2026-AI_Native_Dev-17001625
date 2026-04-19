import json
import re

from google import genai

from app.models.schemas import SentimentResponse, StockQuoteResponse


class AIServiceError(RuntimeError):
    """Base exception for AI service failures."""


class AIUpstreamError(AIServiceError):
    """Raised when Gemini API call fails."""


class AIService:
    def __init__(self, api_key: str, model_name: str = "gemini-3.0-flash") -> None:
        if not api_key:
            raise AIServiceError("GEMINI_API_KEY is required for AI sentiment analysis.")

        self._client = genai.Client(api_key=api_key)
        self._model_name = model_name

    def analyze_sentiment(
        self,
        symbol: str,
        quote: StockQuoteResponse,
        headlines: list[str],
    ) -> SentimentResponse:
        if not headlines:
            raise AIServiceError("At least one headline is required for sentiment analysis.")

        prompt = self._build_prompt(symbol=symbol, quote=quote, headlines=headlines)

        try:
            response = self._client.models.generate_content(
                model=self._model_name,
                contents=prompt,
            )
        except Exception as exc:
            raise AIUpstreamError("Gemini request failed while generating sentiment.") from exc

        raw_text = (getattr(response, "text", "") or "").strip()
        payload = self._parse_json_payload(raw_text)
        sentiment = self._normalize_sentiment(payload.get("sentiment"))
        justification = str(payload.get("justification", "")).strip()

        if len(justification) < 8:
            raise AIServiceError("Gemini response did not include a valid Spanish justification.")

        return SentimentResponse(
            symbol=symbol.upper(),
            sentiment=sentiment,
            justification=justification,
            source_model=self._model_name,
        )

    def _build_prompt(
        self,
        *,
        symbol: str,
        quote: StockQuoteResponse,
        headlines: list[str],
    ) -> str:
        joined_headlines = "\n".join(f"- {headline}" for headline in headlines)
        return (
            "Eres un analista financiero. Responde SOLO JSON valido con este esquema: "
            '{"sentiment":"Bullish|Bearish|Neutral","justification":"texto breve en espanol"}.\n\n'
            f"Simbolo: {symbol.upper()}\n"
            f"Precio actual: {quote.price}\n"
            f"Cambio porcentual diario: {quote.change_percent}\n"
            f"Volumen: {quote.volume}\n"
            "Titulares recientes:\n"
            f"{joined_headlines}\n\n"
            "La justificacion debe ser breve (maximo 40 palabras), "
            "en espanol y sin recomendaciones de inversion."
        )

    @staticmethod
    def _parse_json_payload(raw_text: str) -> dict[str, object]:
        if not raw_text:
            raise AIServiceError("Gemini returned an empty response.")

        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", raw_text, flags=re.DOTALL)
            if not match:
                raise AIServiceError("Gemini response was not valid JSON.") from None
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError as exc:
                raise AIServiceError("Gemini response JSON could not be parsed.") from exc

    @staticmethod
    def _normalize_sentiment(value: object) -> str:
        normalized = str(value or "").strip().lower()
        mapping = {
            "bullish": "Bullish",
            "bearish": "Bearish",
            "neutral": "Neutral",
        }
        if normalized not in mapping:
            raise AIServiceError("Gemini returned an unsupported sentiment label.")
        return mapping[normalized]
