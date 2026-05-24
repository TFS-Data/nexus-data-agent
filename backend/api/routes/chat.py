from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
from models.chat import ChatRequest
from services.azure_ai import get_chat_stream

router = APIRouter()

@router.post("/stream")
async def chat_stream(request: Request, chat_request: ChatRequest):
    """
    Endpoint de streaming SSE. Retorna a resposta do Azure AI Foundry em pedaços (chunks).
    """
    return EventSourceResponse(get_chat_stream(chat_request))
