from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings

security = HTTPBearer()

def verify_api_key(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifica se o token enviado via Authorization: Bearer corresponde à NEXUS_API_KEY.
    """
    if credentials.credentials != settings.NEXUS_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas. Chave de API Incorreta.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials
