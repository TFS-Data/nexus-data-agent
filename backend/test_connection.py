import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from openai import AsyncOpenAI
from core.config import settings

async def test_connection():
    print("Iniciando teste de conexao com o Azure AI Foundry...")
    print(f"Endpoint: {settings.AZURE_AI_FOUNDRY_ENDPOINT}")
    print(f"Model Deployment: {settings.AZURE_MODEL_DEPLOYMENT}")
    
    try:
        client = AsyncOpenAI(
            base_url=settings.AZURE_AI_FOUNDRY_ENDPOINT,
            api_key=settings.AZURE_API_KEY
        )
        
        print("Enviando requisicao de teste...")
        response = await client.chat.completions.create(
            messages=[{"role": "user", "content": "Ola, este e um teste de conexao rapida. Responda apenas com a palavra 'OK'."}],
            model=settings.AZURE_MODEL_DEPLOYMENT,
            max_tokens=10
        )
        
        if response and response.choices:
            reply = response.choices[0].message.content
            print(f"\n[SUCESSO] Conexao estabelecida com sucesso!")
            print(f"Resposta do modelo: '{reply}'")
        else:
            print("\n[ERRO] Nenhuma resposta recebida do modelo.")
            
    except Exception as e:
        print(f"\n[FALHA] Erro ao se conectar com o Azure AI Foundry: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_connection())
