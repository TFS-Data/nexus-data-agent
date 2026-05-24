from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Antigravity AI Platform"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: List[AnyHttpUrl] | List[str] = ["http://localhost:3000"]

    # Azure AI Foundry
    AZURE_AI_FOUNDRY_ENDPOINT: str
    AZURE_OPENAI_ENDPOINT: str = ""
    AZURE_MODEL_DEPLOYMENT: str
    AZURE_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
