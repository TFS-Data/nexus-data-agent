from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Antigravity AI Platform"
    API_V1_STR: str = "/api/v1"
    
    # CORS — usar strings simples evita que o Pydantic normalize/remova trailing slash
    # e cause mismatch entre a origem enviada pelo browser e a lista permitida.
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Azure AI Foundry
    AZURE_AI_FOUNDRY_ENDPOINT: str
    AZURE_OPENAI_ENDPOINT: str = ""
    AZURE_MODEL_DEPLOYMENT: str
    AZURE_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
