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


app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": f"Bem-vindo à {settings.PROJECT_NAME} API!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
