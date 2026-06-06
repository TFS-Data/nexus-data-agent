from fastapi import APIRouter, Request, HTTPException
from sse_starlette.sse import EventSourceResponse
from models.chat import ChatRequest
from services.azure_ai import get_chat_stream
import re
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Padrões comuns de prompt injection / jailbreak
INJECTION_PATTERNS = [
    r"ignore (all )?previous instructions",
    r"forget (all )?previous instructions",
    r"bypass (all )?rules",
    r"you are now",
    r"act as",
    r"simule",
    r"desconsidere as instruções anteriores",
    r"system prompt",
    r"developer mode",
    r"dan (do anything now)"
]

@router.post("/stream")
async def chat_stream(request: Request, chat_request: ChatRequest):
    """
    Endpoint de streaming SSE. Retorna a resposta do Azure AI Foundry em pedaços (chunks).
    """
    # Validação de Segurança (Prompt Injection Firewall)
    if chat_request.messages:
        last_message = chat_request.messages[-1].content.lower()
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, last_message):
                logger.warning(f"Tentativa de Prompt Injection detectada! Padrão: {pattern}")
                raise HTTPException(status_code=400, detail="Entrada de segurança violada. Por favor, reformule sua mensagem de acordo com os propósitos do Nexus.")

    return EventSourceResponse(get_chat_stream(chat_request))
