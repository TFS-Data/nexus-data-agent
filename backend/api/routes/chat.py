from fastapi import APIRouter, Request, HTTPException, Depends
from sse_starlette.sse import EventSourceResponse
from models.chat import ChatRequest
from services.azure_ai import get_chat_stream
from core.security import verify_api_key
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

@router.post("/stream", dependencies=[Depends(verify_api_key)])
async def chat_stream(request: Request, chat_request: ChatRequest):
    """
    Endpoint de streaming SSE. Protegido por Chave de API.
    Retorna a resposta do Azure AI Foundry em pedaços (chunks).
    """
    # Validação de Segurança (Prompt Injection Firewall Básico)
    if chat_request.messages:
        last_message = chat_request.messages[-1].content.lower()
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, last_message):
                logger.warning(f"Tentativa de Prompt Injection detectada! Padrão: {pattern}")
                raise HTTPException(status_code=400, detail="Entrada de segurança violada. Por favor, reformule sua mensagem.")
        
        # Opcional: Aqui poderíamos injetar um System Prompt temporário caso não exista,
        # para garantir que o LLM não seja corrompido, mas como os requests já trazem history,
        # confiar na Azure Content Safety + essas verificações iniciais atende o requisito inicial.

    return EventSourceResponse(get_chat_stream(chat_request))
