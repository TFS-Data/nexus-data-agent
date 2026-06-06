import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.routes import chat

app = FastAPI(title=settings.PROJECT_NAME)

# Parse de CORS dinâmico
origins = ["*"]
if settings.CORS_ORIGINS:
    if settings.CORS_ORIGINS == "*":
        origins = ["*"]
    else:
        origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
        if "https://nexus-data-agent.vercel.app" not in origins:
            origins.append("https://nexus-data-agent.vercel.app")

allow_all = origins == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if not allow_all else ["*"],
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware de cabeçalhos de segurança básicos
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import time

# Rate Limiting Simples na Memória
request_counts = {}
RATE_LIMIT = 15 # requisições
RATE_LIMIT_WINDOW = 60 # segundos

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Aplica rate limit apenas no chat
    if request.url.path.startswith("/api/v1/chat"):
        client_ip = request.client.host
        current_time = time.time()
        
        # O(1): Limpa apenas o registro do IP solicitante, prevenindo DoS por iteração
        if client_ip in request_counts:
            if current_time - request_counts[client_ip]["start_time"] > RATE_LIMIT_WINDOW:
                del request_counts[client_ip]
                
        if client_ip not in request_counts:
            request_counts[client_ip] = {"count": 1, "start_time": current_time}
        else:
            if request_counts[client_ip]["count"] >= RATE_LIMIT:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Muitas requisições. Por favor, aguarde um momento antes de enviar mais mensagens."}
                )
            request_counts[client_ip]["count"] += 1

    response = await call_next(request)
    return response

app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": f"Bem-vindo à {settings.PROJECT_NAME} API!", "status": "online"}

@app.get("/health")
def health_check():
    from services.azure_ai import _build_endpoint, _API_VERSIONS
    endpoint_url = _build_endpoint(_API_VERSIONS[0])
    return {
        "status": "ok",
        "model": settings.AZURE_MODEL_DEPLOYMENT,
        "endpoint_resolved": endpoint_url,
        "api_versions_to_try": _API_VERSIONS,
    }



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
