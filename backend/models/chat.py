from pydantic import BaseModel, Field, constr
from typing import List, Optional, Literal

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    # Limita o tamanho de cada mensagem a 2000 caracteres para evitar buffer overflow / hallucination attacks
    content: constr(min_length=1, max_length=2000, strip_whitespace=True)

class ChatRequest(BaseModel):
    # Limita o histórico a no máximo 30 mensagens
    messages: List[Message] = Field(..., max_items=30)
    stream: bool = True
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1024, ge=1)
